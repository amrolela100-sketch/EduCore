/**
 * POST /api/evaluate-match
 * 
 * Evaluates how well a candidate matches a job posting using A-F rubric.
 * Requires HR_ADMIN or TECH_ADMIN role.
 * Saves the evaluation result to JobMatchEvaluation table.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/rbac";
import { createSafeResult, createSafeError } from "@/lib/errors";
import { evaluateCandidateJobMatch } from "@/services/job-evaluator";
import { analyzeGaps } from "@/services/gap-analyzer";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = await checkRateLimit(`evaluate_match_${clientIp}`, 10, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.resetMs);
    }

    // RBAC: Only HR_ADMIN and TECH_ADMIN can trigger evaluations
    await requireRole(["HR_ADMIN", "TECH_ADMIN", "SYSTEM_ADMIN"]);

    const body = await req.json();
    const { applicationId } = body;

    if (!applicationId || typeof applicationId !== "string") {
      return NextResponse.json(
        createSafeError(null, "evaluate-match:validation", "معرّف الطلب مطلوب."),
        { status: 400 }
      );
    }

    // Fetch application with related data
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidateProfile: {
          include: {
            resumes: {
              orderBy: { uploadedAt: "desc" },
              take: 1,
            },
          },
        },
        jobPosting: {
          include: { company: true },
        },
        matchEvaluation: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        createSafeError(null, "evaluate-match:not-found", "الطلب غير موجود."),
        { status: 404 }
      );
    }

    // If already evaluated, return existing evaluation
    if (application.matchEvaluation) {
      return NextResponse.json(
        createSafeResult(application.matchEvaluation, "تم تقييم هذا الطلب مسبقاً.")
      );
    }

    const profile = application.candidateProfile;
    const job = application.jobPosting;
    const latestResume = profile?.resumes?.[0];

    if (!profile) {
      return NextResponse.json(
        createSafeError(null, "evaluate-match:no-profile", "الملف الشخصي للمرشح غير موجود."),
        { status: 400 }
      );
    }

    // Run evaluation and gap analysis in parallel
    const [evaluationResult, gapResult] = await Promise.all([
      evaluateCandidateJobMatch(
        {
          skills: profile.skills ?? [],
          experience: profile.experience ?? null,
          education: profile.education ?? null,
          certifications: profile.certifications ?? null,
          languages: profile.languages ?? null,
          projects: profile.projects ?? null,
          resumeText: latestResume?.extractedText || "",
        },
        {
          title: job.title || "وظيفة غير محددة",
          description: job.description || "",
          requirements: job.requirements ?? [],
          salaryRange: job.salaryRange ?? null,
          location: job.location ?? null,
          companyName: job.company?.name ?? "غير محدد",
          companyDescription: job.company?.description ?? null,
        }
      ),
      analyzeGaps({
        candidateSkills: profile.skills ?? [],
        candidateExperience: profile.experience ?? null,
        candidateEducation: profile.education ?? null,
        resumeText: latestResume?.extractedText || "",
        jobRequirements: job.requirements ?? [],
        jobDescription: job.description || "",
        jobTitle: job.title || "وظيفة غير محددة",
      }),
    ]);

    // Extract axis scores for DB columns
    const getAxisScore = (axis: string) =>
      evaluationResult.axes.find((a) => a.axis === axis)?.score ?? 3.0;

    // Save evaluation and update application in a transaction
    const evaluation = await prisma.$transaction(async (tx) => {
      const created = await tx.jobMatchEvaluation.create({
        data: {
          applicationId,
          overallScore: evaluationResult.overallScore,
          profileMatchScore: getAxisScore("A"),
          growthScore: getAxisScore("B"),
          compensationScore: getAxisScore("C"),
          cultureFitScore: getAxisScore("D"),
          roleClarityScore: getAxisScore("E"),
          redFlagScore: getAxisScore("F"),
          summary: evaluationResult.summary,
          gaps: evaluationResult.gaps,
          strengths: evaluationResult.strengths,
          recommendations: evaluationResult.recommendations,
          rawAnalysis: JSON.parse(JSON.stringify({
            axes: evaluationResult.axes,
            gapAnalysis: gapResult,
          })),
        },
      });

      // Update application with match score and gap analysis
      await tx.application.update({
        where: { id: applicationId },
        data: {
          matchScore: evaluationResult.overallScore,
          missingSkills: evaluationResult.gaps,
          gapAnalysis: JSON.parse(JSON.stringify(gapResult)),
          status: "MATCHED",
        },
      });

      return created;
    });

    return NextResponse.json(
      createSafeResult(evaluation, "تم تقييم التطابق بنجاح.")
    );
  } catch (error) {
    console.error("[CRITICAL ERROR - evaluate-match]:", error);
    return NextResponse.json(
      createSafeError(error, "evaluate-match", "حدث خطأ أثناء تقييم التطابق. يرجى المحاولة مرة أخرى."),
      { status: 500 }
    );
  }
}
