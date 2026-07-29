/**
 * POST /api/tailor-resume
 * 
 * Generates a tailored version of a candidate's resume for a specific job posting.
 * Requires the CANDIDATE to own the resume, or HR_ADMIN/TECH_ADMIN roles.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser, hasRole } from "@/lib/rbac";
import { createSafeResult, createSafeError } from "@/lib/errors";
import { tailorResume } from "@/services/cv-tailor";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = await checkRateLimit(`tailor_resume_${clientIp}`, 10, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetMs);
    }

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        createSafeError(null, "tailor-resume:auth", "يرجى تسجيل الدخول."),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { resumeId, jobPostingId } = body;

    if (!resumeId || !jobPostingId) {
      return NextResponse.json(
        createSafeError(null, "tailor-resume:validation", "معرّف السيرة الذاتية ومعرّف الوظيفة مطلوبان."),
        { status: 400 }
      );
    }

    // Fetch resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        candidateProfile: {
          include: { user: { select: { id: true } } },
        },
      },
    });

    if (!resume) {
      return NextResponse.json(
        createSafeError(null, "tailor-resume:not-found", "السيرة الذاتية غير موجودة."),
        { status: 404 }
      );
    }

    // Authorization: owner or admin
    const isOwner = resume.candidateProfile?.user?.id === user.id;
    const isAdmin = hasRole(user, ["HR_ADMIN", "TECH_ADMIN", "SYSTEM_ADMIN"]);
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        createSafeError(null, "tailor-resume:forbidden", "ليس لديك صلاحية الوصول."),
        { status: 403 }
      );
    }

    // Check if already tailored for this job
    const existing = await prisma.tailoredResume.findUnique({
      where: {
        originalResumeId_jobPostingId: {
          originalResumeId: resumeId,
          jobPostingId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        createSafeResult(existing, "تم تخصيص هذه السيرة الذاتية لهذه الوظيفة مسبقاً.")
      );
    }

    // Fetch job posting
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json(
        createSafeError(null, "tailor-resume:job-not-found", "الوظيفة غير موجودة."),
        { status: 404 }
      );
    }

    // Run the tailoring
    const result = await tailorResume({
      resumeText: resume.extractedText || "لا يوجد نص بالسيرة الذاتية",
      jobTitle: job.title || "وظيفة غير محددة",
      jobDescription: job.description || "لا يوجد وصف للوظيفة",
      jobRequirements: job.requirements ?? [],
      companyName: job.company?.name ?? "غير محدد",
    });

    // Save the tailored resume
    const tailored = await prisma.tailoredResume.create({
      data: {
        originalResumeId: resumeId,
        jobPostingId,
        tailoredContent: result.tailoredContent,
        highlightedSkills: result.highlightedSkills,
        matchPercentage: result.matchPercentage,
      },
    });

    return NextResponse.json(
      createSafeResult(tailored, "تم تخصيص السيرة الذاتية بنجاح.")
    );
  } catch (error) {
    console.error("[CRITICAL ERROR - tailor-resume]:", error);
    return NextResponse.json(
      createSafeError(error, "tailor-resume", "حدث خطأ أثناء تخصيص السيرة الذاتية."),
      { status: 500 }
    );
  }
}
