import { getUser } from "../../utils/api";
import { prisma } from "../../../prisma/db";

export default defineEventHandler(async (event) => {
  const u = await getUser(event);

  return prisma.report.findMany({
    where: {
      OR: [{ submittedById: u.id }, { participants: { some: { userId: u.id } } }],
    },
    select: {
      id: true,
      title: true,
      severity: true,
      status: true,
      createdAt: true,
      submittedBy: { select: { username: true, verified: true } },
      program: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
  });
});
