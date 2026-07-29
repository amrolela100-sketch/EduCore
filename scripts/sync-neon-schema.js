const fs = require("fs");
const path = require("path");

try {
  const envPath = fs.existsSync(path.join(__dirname, ".env")) ? path.join(__dirname, ".env") : path.resolve(".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || "").trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.error("Failed to load .env file:", e);
}

const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");
neonConfig.webSocketConstructor = ws;

async function syncSchema() {
  console.log("Connecting to Neon PostgreSQL via Serverless Pooler...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const statements = [
    // 1. Add missing columns to JobPosting
    `ALTER TABLE "JobPosting" ADD COLUMN IF NOT EXISTS "archetype" TEXT;`,
    `ALTER TABLE "JobPosting" ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;`,
    `ALTER TABLE "JobPosting" ADD COLUMN IF NOT EXISTS "sourceType" TEXT;`,

    // 2. Add missing columns to Application
    `ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "gapAnalysis" JSONB;`,

    // 3. Create JobMatchEvaluation table if missing
    `CREATE TABLE IF NOT EXISTS "JobMatchEvaluation" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "overallScore" DOUBLE PRECISION NOT NULL,
        "profileMatchScore" DOUBLE PRECISION NOT NULL,
        "growthScore" DOUBLE PRECISION NOT NULL,
        "compensationScore" DOUBLE PRECISION NOT NULL,
        "cultureFitScore" DOUBLE PRECISION NOT NULL,
        "roleClarityScore" DOUBLE PRECISION NOT NULL,
        "redFlagScore" DOUBLE PRECISION NOT NULL,
        "summary" TEXT NOT NULL,
        "gaps" TEXT[],
        "strengths" TEXT[],
        "recommendations" TEXT NOT NULL,
        "rawAnalysis" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "applicationId" TEXT NOT NULL UNIQUE REFERENCES "Application"("id") ON DELETE CASCADE
    );`,

    // 4. Create TailoredResume table if missing
    `CREATE TABLE IF NOT EXISTS "TailoredResume" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "tailoredContent" TEXT NOT NULL,
        "highlightedSkills" TEXT[],
        "matchPercentage" DOUBLE PRECISION,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "originalResumeId" TEXT NOT NULL REFERENCES "Resume"("id") ON DELETE CASCADE,
        "jobPostingId" TEXT NOT NULL REFERENCES "JobPosting"("id") ON DELETE CASCADE
    );`,

    // Unique constraint on TailoredResume
    `CREATE UNIQUE INDEX IF NOT EXISTS "TailoredResume_originalResumeId_jobPostingId_key" ON "TailoredResume"("originalResumeId", "jobPostingId");`
  ];

  for (const stmt of statements) {
    try {
      await pool.query(stmt);
      console.log("SUCCESS:", stmt.split("\n")[0]);
    } catch (err) {
      console.error("Statement Error:", err.message);
    }
  }

  await pool.end();
  console.log("Schema synchronization completed successfully!");
}

syncSchema();
