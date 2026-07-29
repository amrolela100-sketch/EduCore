const fs = require("fs");
const path = require("path");

// Manually load .env file to ensure variables are available
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
  console.error("Failed to load .env file manually:", e);
}

const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");
const crypto = require("crypto");

// Set the WebSocket constructor for Neon serverless driver
neonConfig.webSocketConstructor = ws;

// Helper to hash password using scryptSync
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  console.log("DATABASE_URL:", JSON.stringify(process.env.DATABASE_URL));
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log("Seeding database via Raw SQL...");

  try {
    // 1. Seed Roles
    const roles = ["CANDIDATE", "HR_ADMIN", "TECH_ADMIN", "SYSTEM_ADMIN"];
    const roleMap = {};

    for (const roleName of roles) {
      // Check if role exists
      const checkRole = await pool.query('SELECT id FROM "Role" WHERE name = $1', [roleName]);
      let roleId;
      if (checkRole.rows.length > 0) {
        roleId = checkRole.rows[0].id;
      } else {
        roleId = crypto.randomUUID();
        await pool.query(
          'INSERT INTO "Role" (id, name, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
          [roleId, roleName, `${roleName} role description`]
        );
      }
      roleMap[roleName] = roleId;
      console.log(`Role: ${roleName} -> ${roleId}`);
    }

    // 2. Seed Users
    const usersToCreate = [
      {
        email: "hr@educore.com",
        name: "HR Manager",
        roleId: roleMap["HR_ADMIN"],
        password: "hrpassword",
      },
      {
        email: "tech@educore.com",
        name: "Lead Tech Interviewer",
        roleId: roleMap["TECH_ADMIN"],
        password: "techpassword",
      },
      {
        email: "candidate@example.com",
        name: "John Doe",
        roleId: roleMap["CANDIDATE"],
        password: "candidatepassword",
      },
      {
        email: "system@educore.com",
        name: "System Admin",
        roleId: roleMap["SYSTEM_ADMIN"],
        password: "systempassword",
      },
    ];

    const userMap = {};
    for (const u of usersToCreate) {
      const checkUser = await pool.query('SELECT id FROM "User" WHERE email = $1', [u.email]);
      let userId;
      if (checkUser.rows.length > 0) {
        userId = checkUser.rows[0].id;
      } else {
        userId = crypto.randomUUID();
        await pool.query(
          'INSERT INTO "User" (id, email, name, "passwordHash", "roleId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
          [userId, u.email, u.name, hashPassword(u.password), u.roleId]
        );
      }
      userMap[u.email] = userId;
      console.log(`User: ${u.email} -> ${userId}`);
    }

    // 3. Seed Company
    const checkCompany = await pool.query('SELECT id FROM "Company" WHERE name = $1', ["EduCore Corp"]);
    let companyId;
    if (checkCompany.rows.length > 0) {
      companyId = checkCompany.rows[0].id;
    } else {
      companyId = crypto.randomUUID();
      await pool.query(
        'INSERT INTO "Company" (id, name, description, website, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [companyId, "EduCore Corp", "Leading Next-Gen Educational Technology Platform", "https://educore.com"]
      );
    }
    console.log(`Company: EduCore Corp -> ${companyId}`);

    // 4. Seed Job Postings (always create to verify flow)
    const jobs = [
      {
        title: "Senior Backend Engineer (TypeScript/Node.js)",
        description: "We are seeking a senior engineer experienced in building fast, scalable GraphQL/REST APIs, working with Prisma, PostgreSQL, and designing distributed systems.",
        requirements: ["TypeScript", "Node.js", "Prisma", "PostgreSQL", "GraphQL"],
        salaryRange: "$120,000 - $150,000",
        location: "Remote",
      },
      {
        title: "UI/UX Product Designer",
        description: "Seeking a designer with experience creating premium design systems, high-fidelity prototypes, user journey mapping, and a modern aesthetic.",
        requirements: ["Figma", "Design Systems", "User Research", "Wireframing", "Prototyping"],
        salaryRange: "$95,000 - $125,000",
        location: "Remote",
      },
      {
        title: "Senior Corporate Accountant",
        description: "We are seeking an experienced Corporate Accountant to manage financial reporting, IFRS compliance, tax filings, and corporate ledger auditing.",
        requirements: ["Financial Reporting", "IFRS", "Corporate Tax", "Excel", "Auditing"],
        salaryRange: "$80,000 - $105,000",
        location: "On-site (New York)",
      },
      {
        title: "Growth Marketing Specialist",
        description: "Join us as a growth marketer focusing on SEM, technical SEO, A/B testing, and managing data-driven advertising campaigns.",
        requirements: ["SEO", "Google Analytics", "SEM", "Content Strategy", "A/B Testing"],
        salaryRange: "$70,000 - $90,000",
        location: "Hybrid",
      },
      {
        title: "Enterprise Sales Representative",
        description: "Looking for a seasoned sales professional to drive enterprise B2B sales cycles, lead generation, CRM pipelines, and contract negotiations.",
        requirements: ["B2B Sales", "Lead Generation", "CRM", "Contract Negotiation", "Enterprise Software"],
        salaryRange: "$100,000 - $140,000",
        location: "Remote",
      }
    ];

    let backendJobId = "";
    for (const job of jobs) {
      const jobPostingId = crypto.randomUUID();
      if (job.title === "Senior Backend Engineer (TypeScript/Node.js)") {
        backendJobId = jobPostingId;
      }
      await pool.query(
        'INSERT INTO "JobPosting" (id, title, description, requirements, "salaryRange", location, status, "companyId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())',
        [
          jobPostingId,
          job.title,
          job.description,
          job.requirements,
          job.salaryRange,
          job.location,
          "OPEN",
          companyId,
        ]
      );
      console.log(`Job Posting created: ${job.title} -> ${jobPostingId}`);
    }

    // 5. Seed Candidate Profile for John Doe
    const johnDoeUserId = userMap["candidate@example.com"];
    const checkProfile = await pool.query('SELECT id FROM "CandidateProfile" WHERE "userId" = $1', [johnDoeUserId]);
    let profileId;
    if (checkProfile.rows.length > 0) {
      profileId = checkProfile.rows[0].id;
    } else {
      profileId = crypto.randomUUID();
      await pool.query(
        'INSERT INTO "CandidateProfile" (id, "userId", skills, experience, education, certifications, languages, projects, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())',
        [
          profileId,
          johnDoeUserId,
          ["TypeScript", "Node.js", "React.js", "PostgreSQL", "Next.js"],
          JSON.stringify([
            {
              role: "Software Engineer",
              company: "TechSolutions Inc",
              duration: "2023 - Present",
              description: "Developed and maintained full-stack web applications using TypeScript and Next.js. Integrated database schemas and optimized REST API performance.",
            },
            {
              role: "Junior Web Developer",
              company: "WebDev Hub",
              duration: "2021 - 2023",
              description: "Worked on frontend features using React.js and CSS. Built responsive web page dashboards.",
            },
          ]),
          JSON.stringify([
            {
              degree: "Bachelor of Science in Computer Science",
              school: "State University",
              year: "2021",
            },
          ]),
          JSON.stringify(["Prisma Certified Developer", "AWS Solutions Architect Associate"]),
          JSON.stringify(["English (Fluent)", "Arabic (Native)"]),
          JSON.stringify([
            {
              name: "Audit Trail Platform",
              description: "A secure log management dashboard utilizing cryptographic proof of integrity.",
              technologies: ["Node.js", "TypeScript", "PostgreSQL"],
            },
          ]),
        ]
      );
    }
    console.log(`Candidate Profile: ${profileId}`);

    // 6. Create Application
    const applicationId = crypto.randomUUID();
    await pool.query(
      'INSERT INTO "Application" (id, status, "matchScore", "missingSkills", "rankingReason", "rankingPosition", "candidateProfileId", "jobPostingId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())',
      [
        applicationId,
        "EVALUATED",
        84.0,
        ["Prisma", "GraphQL"],
        "Strong fit in TypeScript, Node.js, and PostgreSQL. Missing GraphQL/Prisma in candidate skills list, but has substantial project history.",
        1,
        profileId,
        backendJobId,
      ]
    );
    console.log(`Application created: ${applicationId}`);

    // 7. Create Interview Session
    const interviewSessionId = crypto.randomUUID();
    await pool.query(
      'INSERT INTO "InterviewSession" (id, status, transcript, "submittedCode", "sandboxOutput", "applicationId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())',
      [
        interviewSessionId,
        "COMPLETED",
        JSON.stringify({
          challengeType: "CODING",
          challengeTitle: "Scalability fizz-buzz challenge",
          challengeDescription: "Write a high-performance FizzBuzz algorithm in TypeScript and handle standard scaling limitations.",
          candidateResponse: "I implemented a simple loop. In production, I would use modular arithmetic optimization or lookup caches.",
        }),
        `// John Doe - Scalability challenge solution
function solve(n) {
  let result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(i.toString());
  }
  return result;
}`,
        "Success: run completed in 0.04s. Exit code 0.",
        applicationId,
      ]
    );
    console.log(`Interview Session created: ${interviewSessionId}`);

    // 8. Create Assessment
    const assessmentId = crypto.randomUUID();
    const techUserId = userMap["tech@educore.com"];
    await pool.query(
      'INSERT INTO "Assessment" (id, "overallScore", summary, "interviewSessionId", "evaluatorId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
      [
        assessmentId,
        88.0,
        "Excellent candidate who demonstrated strong problem-solving skills, clean TypeScript code, and clear technical communication.",
        interviewSessionId,
        techUserId,
      ]
    );
    console.log(`Assessment created: ${assessmentId}`);

    // 9. Create Assessment Scores
    const scores = [
      {
        dimension: "code_quality",
        score: 90,
        justification: "Clean, readable, modular code. Good naming conventions. Used standard TS syntax correctly.",
      },
      {
        dimension: "problem_solving",
        score: 85,
        justification: "Implemented the algorithm correctly. Offered performance tuning notes.",
      },
      {
        dimension: "communication",
        score: 90,
        justification: "Highly descriptive and transparent thought process during the interview session.",
      },
      {
        dimension: "consistency",
        score: 88,
        justification: "High correlation between the skills listed on their profile and the code submitted.",
      },
    ];

    for (const s of scores) {
      await pool.query(
        'INSERT INTO "AssessmentScore" (id, dimension, score, justification, "assessmentId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [crypto.randomUUID(), s.dimension, s.score, s.justification, assessmentId]
      );
    }
    console.log("Assessment scores inserted.");

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await pool.end();
  }
}

main();
