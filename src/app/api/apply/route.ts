import { NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { jobMatcherClient, interviewerClient } from "@/lib/agents-client";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";
import { createSafeError, createSafeResult } from "@/lib/errors";
import { validateRequestOrigin, createCsrfForbiddenResponse } from "@/lib/csrf";

export async function POST(request: Request) {
  try {
    if (!validateRequestOrigin(request)) {
      return createCsrfForbiddenResponse();
    }

    // 0. Rate limiting protection (max 10 applications per 60s per IP)
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`apply_job_${clientIp}`, 10, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse();
    }


    const user = await getCurrentUser();

    if (!hasRole(user, ["CANDIDATE"])) {
      return NextResponse.json(
        createSafeError(null, "apply:auth", "غير مصرح بالدخول."),
        { status: 401 }
      );
    }

    // Since next-auth forms submit content-type urlencoded, support both JSON and URL-encoded forms
    let jobPostingId = "";
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      jobPostingId = body.jobPostingId;
    } else {
      const formData = await request.formData();
      jobPostingId = formData.get("jobPostingId") as string;
    }

    if (!jobPostingId) {
      return NextResponse.json(
        createSafeError(null, "apply:validation", "معرف الوظيفة مطلوب."),
        { status: 400 }
      );
    }

    // 1. Fetch Candidate Profile
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user!.id },
    });

    if (!candidateProfile) {
      return NextResponse.json(
        createSafeError(null, "apply:profile-not-found", "لم يتم العثور على ملف المرشح. يرجى رفع السيرة الذاتية أولاً."),
        { status: 404 }
      );
    }

    // 2. Fetch Job Posting
    const jobPosting = await prisma.jobPosting.findUnique({
      where: { id: jobPostingId },
    });

    if (!jobPosting) {
      return NextResponse.json(
        createSafeError(null, "apply:job-not-found", "الوظيفة غير موجودة."),
        { status: 404 }
      );
    }

    // Check if application already exists
    const existingApp = await prisma.application.findFirst({
      where: {
        candidateProfileId: candidateProfile.id,
        jobPostingId: jobPosting.id,
      },
    });

    if (existingApp) {
      if (!contentType.includes("application/json")) {
        return new Response(null, {
          status: 302,
          headers: { Location: "/candidate" },
        });
      }
      return NextResponse.json(
        createSafeResult(existingApp, "تم التقديم بالفعل.")
      );
    }

    // 3. Compute match score instantly
    const candidateSkills = candidateProfile.skills || [];
    const jobReqs = jobPosting.requirements || [];

    const matchedSkills = jobReqs.filter((req) =>
      candidateSkills.some(
        (s) => s.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(s.toLowerCase())
      )
    );

    const missingSkills = jobReqs.filter((req) => !matchedSkills.includes(req));

    // Calculate match percentage (base 40% + proportion of matched skills up to 98%)
    const matchRatio = jobReqs.length > 0 ? matchedSkills.length / jobReqs.length : 0.8;
    const matchPercentage = Math.min(98, Math.round(matchRatio * 60 + 38));

    const rankingReason = `Autonomous Agent Match: Candidate matches ${matchedSkills.length}/${jobReqs.length || 1} core requirements (${matchedSkills.join(", ") || "General Alignment"}). Alignment Score: ${matchPercentage}%.`;

    // 4. Create Application record
    const app = await prisma.application.create({
      data: {
        candidateProfileId: candidateProfile.id,
        jobPostingId: jobPosting.id,
        status: "INTERVIEWING",
        matchScore: matchPercentage,
        missingSkills,
        rankingReason,
      },
    });

    // 5. Create InterviewSession record instantly
    await prisma.interviewSession.create({
      data: {
        applicationId: app.id,
        status: "SCHEDULED",
        transcript: {
          challengeTitle: `Technical Assessment: ${jobPosting.title}`,
          description: `Role-calibrated engineering challenge evaluating proficiency in ${jobReqs.slice(0, 3).join(", ") || "software engineering"}.`,
        },
        submittedCode: `// Starter Code Template for ${jobPosting.title}\n// Candidate: ${user!.name || user!.email}\n\nfunction solution() {\n  // Write clean, efficient TypeScript/JavaScript solution here\n  return true;\n}\n`,
      },
    });

    // 6. Fire-and-forget background notice to Eve Agents (Non-blocking)
    try {
      const jobMatcherSession = jobMatcherClient.session();
      jobMatcherSession.send({
        message: `Match notification for Application ID "${app.id}"`,
      }).catch((e) => console.warn("[BACKGROUND EVE JOB MATCHER NOTICE]:", e.message));

      const interviewerSession = interviewerClient.session();
      interviewerSession.send({
        message: `Interview setup for Application ID "${app.id}"`,
      }).catch((e) => console.warn("[BACKGROUND EVE INTERVIEWER NOTICE]:", e.message));
    } catch {
      console.warn("[BACKGROUND EVE AGENTS NOTICE]: Eve client call skipped.");
    }

    // Redirect or return JSON depending on client request type
    if (!contentType.includes("application/json")) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/candidate" },
      });
    }

    return NextResponse.json(
      createSafeResult(app, "تم التقديم وإنشاء المقابلة بنجاح!"),
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[CRITICAL ERROR - Job Application Route]:", error);
    return NextResponse.json(
      createSafeError(error, "apply", "حدث خطأ غير متوقع أثناء معالجة طلبك. يرجى المحاولة لاحقاً."),
      { status: 500 }
    );
  }
}
