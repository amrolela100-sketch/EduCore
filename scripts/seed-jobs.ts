import fs from "fs";
import path from "path";

// Load .env variables natively
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    envFile.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*"(.*)"\s*$/) || line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        process.env[match[1]] = match[2];
      }
    });
  }
} catch (e) {
  console.warn("Could not load .env file:", e);
}

import { prisma } from "../src/lib/db";

async function seedJobs() {
  console.log("Seeding diverse job postings into Neon PostgreSQL...");

  // 1. Get or create primary company
  let company = await prisma.company.findFirst({
    where: { name: "Apex Global Technologies" },
  });

  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "Apex Global Technologies",
        description: "Leading enterprise AI and fintech solutions provider.",
        website: "https://apexglobal.tech",
      },
    });
  }

  // 2. Define diverse jobs across domains and seniority levels
  const jobsData = [
    {
      title: "Senior Full-Stack TypeScript Engineer",
      description: "Design and implement scalable microservices using Next.js, Node.js, and PostgreSQL.",
      requirements: ["TypeScript", "Next.js", "PostgreSQL", "Node.js", "Docker"],
      salaryRange: "$120,000 - $160,000",
      location: "Remote / Dubai",
      status: "OPEN" as const,
    },
    {
      title: "Senior Financial Accountant & Auditor",
      description: "Lead quarterly financial reporting, balance sheet reconciliations, and tax compliance audits.",
      requirements: ["Accounting", "Financial Analysis", "IFRS", "Excel", "Tax Audit"],
      salaryRange: "$85,000 - $110,000",
      location: "Riyadh / Hybrid",
      status: "OPEN" as const,
    },
    {
      title: "Lead UI/UX Product Designer",
      description: "Craft intuitive, accessible user experiences for complex enterprise dashboards and mobile web apps.",
      requirements: ["Figma", "UI/UX Design", "Design Systems", "Prototyping", "User Research"],
      salaryRange: "$95,000 - $130,000",
      location: "Dubai / Remote",
      status: "OPEN" as const,
    },
    {
      title: "Growth Marketing Specialist",
      description: "Formulate multi-channel acquisition strategies, manage campaign budgets, and analyze CAC/LTV metrics.",
      requirements: ["Digital Marketing", "SEO", "Google Analytics", "Campaign Strategy", "A/B Testing"],
      salaryRange: "$75,000 - $95,000",
      location: "Remote",
      status: "OPEN" as const,
    },
    {
      title: "Technical B2B Sales Executive",
      description: "Drive enterprise SaaS deals, conduct technical product demos, and negotiate key contract terms.",
      requirements: ["B2B Sales", "Enterprise SaaS", "Negotiation", "CRM", "Client Management"],
      salaryRange: "$90,000 - $140,000",
      location: "Abu Dhabi / On-site",
      status: "OPEN" as const,
    },
  ];

  for (const j of jobsData) {
    const existing = await prisma.jobPosting.findFirst({
      where: { title: j.title, companyId: company.id },
    });

    if (!existing) {
      await prisma.jobPosting.create({
        data: {
          ...j,
          companyId: company.id,
        },
      });
      console.log(`✅ Seeded job: ${j.title}`);
    } else {
      console.log(`ℹ️ Job already exists: ${j.title}`);
    }
  }

  console.log("Seeding complete!");
}

seedJobs()
  .catch((e) => {
    console.error("Error seeding jobs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
