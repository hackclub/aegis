import type { UserRole } from "../../prisma/db";
import { prisma } from "../../prisma/db";

export const isGlobalAdmin = (role: UserRole) => role === "GLOBAL_ADMIN";
export const isProgramAdmin = (role: UserRole) => role === "PROGRAM_ADMIN" || role === "GLOBAL_ADMIN";
export const isAdmin = (role: UserRole) => isProgramAdmin(role);
export const isSuperAdmin = (role: UserRole) => isGlobalAdmin(role);
export const isReportOwner = (report: { submittedById: string }, userId: string) => report.submittedById === userId;

export async function canAccessProgram(userId: string, programId: string, role: UserRole): Promise<boolean> {
  if (isGlobalAdmin(role)) return true;
  if (role !== "PROGRAM_ADMIN") return false;
  const a = await prisma.programMember.findUnique({ where: { userId_programId: { userId, programId } } });
  return !!a;
}

export async function canAccessProgramBySlug(userId: string, slug: string, role: UserRole): Promise<boolean> {
  if (isGlobalAdmin(role)) return true;
  if (role !== "PROGRAM_ADMIN") return false;
  const p = await prisma.program.findUnique({ where: { slug }, select: { id: true } });
  return p ? canAccessProgram(userId, p.id, role) : false;
}

export async function getUserPrograms(userId: string, role: UserRole) {
  if (isGlobalAdmin(role)) {
    return prisma.program.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, slug: true, iconUrl: true } });
  }
  const a = await prisma.programMember.findMany({
    where: { userId },
    include: { program: { select: { id: true, title: true, slug: true, iconUrl: true } } },
    orderBy: { program: { title: "asc" } },
  });
  return a.map((x) => x.program);
}

export function hasTriageAccess(participants: { userId: string; role: string }[], userId: string): boolean {
  return participants.some((p) => p.userId === userId && p.role === "triage");
}

export async function addTriage(reportId: string, userId: string, username: string): Promise<boolean> {
  const existing = await prisma.reportParticipant.findUnique({ where: { reportId_userId: { reportId, userId } } });
  if (existing) return false;
  await prisma.reportParticipant.create({ data: { reportId, userId, username, role: "triage" } });
  return true;
}

export async function getReportWithAccessCheck(reportId: string, userId: string, userRole: UserRole) {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      submittedBy: true,
      program: true,
      participants: true,
      activities: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!report) return null;

  const hasTriage = hasTriageAccess(report.participants, userId);
  const isOwner = isReportOwner(report, userId);
  const isAdminUser = isAdmin(userRole);

  let hasProgramAccess = false;
  if (report.programId && isProgramAdmin(userRole)) {
    hasProgramAccess = await canAccessProgram(userId, report.programId, userRole);
  }

  const canView = isOwner || isAdminUser || hasTriage || hasProgramAccess;
  const needsBreakGlass = (isAdminUser || hasProgramAccess) && !isOwner && !hasTriage;

  return {
    report,
    access: {
      canView,
      canViewDetails: isOwner || hasTriage || hasProgramAccess,
      canTriage: hasTriage || hasProgramAccess,
      canChangeStatus: hasTriage || hasProgramAccess,
      canChangeSeverity: hasTriage || hasProgramAccess,
      canReassignProgram: isGlobalAdmin(userRole),
      isOwner,
      isAdmin: isAdminUser,
      isGlobalAdmin: isGlobalAdmin(userRole),
      isProgramAdmin: hasProgramAccess,
      canDisclose: (hasProgramAccess || isGlobalAdmin(userRole)) && ["RESOLVED", "INFORMATIVE", "DUPLICATE", "SPAM"].includes(report.status),
      isTriage: hasTriage,
      needsBreakGlass,
    },
  };
}
