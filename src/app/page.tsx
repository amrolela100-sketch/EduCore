import { prisma } from "@/lib/db";
import { LandingMotion } from "@/components/landing-motion";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    other: {
      "article:tag": "AI Recruitment, Hiring Platform, Technical Assessment, Saudi Arabia Jobs",
    },
  };
}

type SelectedJob = Prisma.JobPostingGetPayload<{
  select: {
    id: true;
    title: true;
    description: true;
    requirements: true;
    salaryRange: true;
    location: true;
    status: true;
    createdAt: true;
    company: { select: { id: true; name: true } };
  };
}>;

function generateJobPostingSchema(jobPostings: SelectedJob[]) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "EduCore Active Job Openings",
    "description": "Current job openings verified through EduCore's autonomous recruitment engine",
    "numberOfItems": jobPostings.length,
    "itemListElement": jobPostings.slice(0, 20).map((job) => ({
      "@type": "JobPosting",
      "@id": `https://educore.ai/#jobposting-${job.id}`,
      "title": job.title,
      "description": job.description,
      "identifier": { "@type": "PropertyValue", "name": "EduCore", "value": job.id },
      "datePosted": new Date(job.createdAt).toISOString().split("T")[0],
      "validThrough": new Date(new Date(job.createdAt).setDate(new Date(job.createdAt).getDate() + 30)).toISOString().split("T")[0],
      "employmentType": "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "@id": "https://educore.ai/#organization",
        "name": job.company?.name || "EduCore",
        "sameAs": "https://educore.ai",
      },
      "jobLocation": job.location ? {
        "@type": "Place",
        "address": { "@type": "PostalAddress", "addressCountry": "SA", "addressRegion": job.location },
      } : {
        "@type": "Place",
        "address": { "@type": "PostalAddress", "addressCountry": "SA", "addressRegion": "Saudi Arabia" },
      },
      "baseSalary": job.salaryRange ? {
        "@type": "MonetaryAmount",
        "currency": "SAR",
        "value": { "@type": "QuantitativeValue", "description": job.salaryRange },
      } : undefined,
      "requirements": job.requirements,
    })),
  };
  return schema;
}

export default async function Home() {
  let jobPostings: SelectedJob[] = [];
  try {
    jobPostings = await prisma.jobPosting.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        salaryRange: true,
        location: true,
        status: true,
        createdAt: true,
        company: { select: { id: true, name: true } },
      },
      where: { status: "OPEN" },
      take: 20,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[HOME PAGE DATABASE FETCH ERROR]:", error);
  }

  const jobPostingSchema = generateJobPostingSchema(jobPostings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <LandingMotion initialJobPostings={jobPostings} />
    </>
  );
}
