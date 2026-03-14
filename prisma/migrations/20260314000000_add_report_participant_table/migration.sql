CREATE TABLE "ReportParticipant" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReportParticipant_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReportParticipant_reportId_idx" ON "ReportParticipant"("reportId");

CREATE INDEX "ReportParticipant_userId_idx" ON "ReportParticipant"("userId");

CREATE UNIQUE INDEX "ReportParticipant_reportId_userId_key" ON "ReportParticipant"("reportId", "userId");

ALTER TABLE "ReportParticipant" ADD CONSTRAINT "ReportParticipant_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ReportParticipant" ADD CONSTRAINT "ReportParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "ReportParticipant" ("id", "role", "username", "joinedAt", "reportId", "userId")
SELECT
    gen_random_uuid()::text,
    p->>'role',
    p->>'username',
    COALESCE((p->>'joinedAt')::timestamp, NOW()),
    r."id",
    p->>'userId'
FROM "Report" r,
     jsonb_array_elements(r."participants"::jsonb) AS p
WHERE r."participants" IS NOT NULL
  AND r."participants"::text != '[]'
  AND (p->>'userId') IS NOT NULL
ON CONFLICT ("reportId", "userId") DO NOTHING;

ALTER TABLE "Report" DROP COLUMN "participants";
