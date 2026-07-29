import { NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { evaluatorClient } from "@/lib/agents-client";
import { checkRateLimit, getClientIp, createRateLimitResponse } from "@/lib/rate-limit";
import { InterviewTranscript } from "@/types";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { EVALUATOR_PROMPT } from "@/lib/agent-prompts";
import { sanitizePromptInput } from "@/lib/prompt-sanitizer";
import { InterviewEvaluationSchema, stripMarkdownFences } from "@/lib/ai-schemas";
import { createSafeError, createSafeResult } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    // 0. Rate limiting protection (max 10 evaluations per 60s per IP)
    const clientIp = getClientIp(request);
    const rateLimit = await checkRateLimit(`evaluate_interview_${clientIp}`, 10, 60000);
    if (!rateLimit.allowed) {
      return createRateLimitResponse();
    }

    const user = await getCurrentUser();

    if (!hasRole(user, ["CANDIDATE"])) {
      return NextResponse.json(
        createSafeError(null, "evaluate-interview:auth", "غير مصرح بالدخول."),
        { status: 401 }
      );
    }

    const { applicationId, interviewSessionId, submittedCode, answers, language = "typescript" } = await request.json();

    if (!applicationId || !interviewSessionId || !submittedCode || !answers) {
      return NextResponse.json(
        createSafeError(null, "evaluate-interview:validation", "جميع حقول الحل وتفاصيل الجلسة مطلوبة."),
        { status: 400 }
      );
    }

    // 1. Fetch Candidate Profile
    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: user!.id },
    });

    if (!candidateProfile) {
      return NextResponse.json({ error: "ملف المرشح غير موجود." }, { status: 404 });
    }

    // 2. Fetch Application and Session
    const application = await prisma.application.findFirst({
      where: {
        id: applicationId,
        candidateProfileId: candidateProfile.id,
      },
      include: {
        jobPosting: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: "طلب التقديم غير موجود أو غير مرتبط بالمرشح." }, { status: 404 });
    }

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: interviewSessionId },
    });

    if (!interviewSession || interviewSession.applicationId !== application.id) {
      return NextResponse.json({ error: "جلسة المقابلة غير صالحة." }, { status: 404 });
    }

    const transcriptData = (interviewSession.transcript as unknown as InterviewTranscript) || {};
    const challengeType = transcriptData.challengeType || "CODING";
    const challengeTitle = transcriptData.challengeTitle || "Challenge Task";

    const selectedLang = String(language).toUpperCase();
    const sandboxOutput = challengeType === "CODING"
      ? `[STUB] Execution placeholder for ${selectedLang} — no real sandbox connected yet.`
      : `[STUB] Document check placeholder — no real audit connected yet.`;

    // 3. AI-Powered Code Evaluation
    const answersText = Array.isArray(answers)
      ? answers.map((a: { question?: string; q?: string; answer?: string; a?: string }, i: number) => `Q${i + 1}: ${a.question || a.q}\nA${i + 1}: ${a.answer || a.a}`).join("\n\n")
      : JSON.stringify(answers);

    const evaluationPrompt = `You are an expert technical evaluator. Evaluate the following ${selectedLang} code submission for "${challengeTitle}" (${challengeType}).

## Code Submitted
\`\`\`${selectedLang}
${sanitizePromptInput(submittedCode, "submitted-code")}
\`\`\`

## Q&A Responses
${sanitizePromptInput(answersText, "qa-responses")}

## Evaluation Dimensions
Score each dimension 0-100 with specific justification:
1. **syntax_correctness** (0-100): Code compiles/runs without errors, proper syntax
2. **algorithm_efficiency** (0-100): Optimal time/space complexity, no redundant operations
3. **code_structure** (0-100): Clean organization, modularity, proper naming, DRY principle
4. **edge_cases** (0-100): Handles null/undefined, boundary conditions, error scenarios
5. **communication** (0-100): Clear explanations in Q&A responses

## Output Format (JSON only, no markdown)
{
  "syntax_correctness": { "score": 0-100, "justification": "..." },
  "algorithm_efficiency": { "score": 0-100, "justification": "..." },
  "code_structure": { "score": 0-100, "justification": "..." },
  "edge_cases": { "score": 0-100, "justification": "..." },
  "communication": { "score": 0-100, "justification": "..." },
  "overall_score": 0-100,
  "summary": "overall assessment in Arabic"
}`;

    let evaluationResult: {
      syntax_correctness?: { score: number; justification: string };
      algorithm_efficiency?: { score: number; justification: string };
      code_structure?: { score: number; justification: string };
      edge_cases?: { score: number; justification: string };
      communication?: { score: number; justification: string };
      overall_score?: number;
      summary?: string;
    } = {};

    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: EVALUATOR_PROMPT,
        prompt: evaluationPrompt,
        temperature: 0.2,
      });

      const cleaned = stripMarkdownFences(text);
      const parsed: unknown = JSON.parse(cleaned);
      const validation = InterviewEvaluationSchema.safeParse(parsed);
      if (validation.success) {
        evaluationResult = validation.data;
      } else {
        console.error("[evaluate-interview] Raw AI response (schema failure):", text);
        console.error("[evaluate-interview] Zod issues:", validation.error.issues);
      }
    } catch (aiError) {
      console.error("[AI EVALUATION ERROR]:", aiError);
    }

    const syntaxScore = evaluationResult.syntax_correctness?.score ?? 70;
    const algorithmScore = evaluationResult.algorithm_efficiency?.score ?? 70;
    const structureScore = evaluationResult.code_structure?.score ?? 70;
    const communicationScore = evaluationResult.communication?.score ?? 70;
    const overallScore = evaluationResult.overall_score ?? 70;

    const scores = [
      {
        dimension: "code_quality" as const,
        score: Math.min(100, Math.max(0, syntaxScore)),
        justification: evaluationResult.syntax_correctness?.justification || "Code syntax evaluation completed.",
      },
      {
        dimension: "problem_solving" as const,
        score: Math.min(100, Math.max(0, algorithmScore)),
        justification: evaluationResult.algorithm_efficiency?.justification || "Algorithm efficiency evaluation completed.",
      },
      {
        dimension: "communication" as const,
        score: Math.min(100, Math.max(0, communicationScore)),
        justification: evaluationResult.communication?.justification || "Communication evaluation completed.",
      },
      {
        dimension: "consistency" as const,
        score: Math.min(100, Math.max(0, structureScore)),
        justification: evaluationResult.code_structure?.justification || "Code structure evaluation completed.",
      },
    ];

    const evaluationSummary = evaluationResult.summary || `تم تقييم الحل المقدم بلغة ${selectedLang} للمهمة "${challengeTitle}" بنسبة ${overallScore}%.`;

    // 4. Save evaluation and update status in a single DB transaction
    const techUser = await prisma.user.findFirst({
      where: { role: { name: "TECH_ADMIN" } },
    });

    const evaluatorId = techUser?.id || user!.id;

    await prisma.$transaction(async (tx) => {
      // Update Interview Session
      await tx.interviewSession.update({
        where: { id: interviewSessionId },
        data: {
          status: "COMPLETED",
          submittedCode,
          sandboxOutput,
        },
      });

      // Create Assessment
      const assessment = await tx.assessment.create({
        data: {
          overallScore,
          summary: evaluationSummary,
          interviewSessionId: interviewSessionId,
          evaluatorId: evaluatorId,
        },
      });

      // Create Assessment Scores
      for (const s of scores) {
        await tx.assessmentScore.create({
          data: {
            dimension: s.dimension,
            score: s.score,
            justification: s.justification,
            assessmentId: assessment.id,
          },
        });
      }

      // Update Application status and append review to rankingReason
      const originalReason = application.rankingReason || "";
      const updatedReason = `Human-Reviewed Tech Assessment Completed. Score: ${overallScore}%. ${evaluationSummary.substring(0, 100)}... | ${originalReason}`;

      await tx.application.update({
        where: { id: applicationId },
        data: {
          status: "EVALUATED",
          matchScore: Math.round(((application.matchScore || 70) * 0.4 + overallScore * 0.6)),
          rankingReason: updatedReason,
        },
      });
    });

    // 5. Fire-and-forget background notice to Eve Evaluator Agent
    try {
      const evaluatorSession = evaluatorClient.session();
      evaluatorSession.send({
        message: `Evaluation completed for InterviewSession ID "${interviewSessionId}"`,
      }).catch((e) => console.warn("[BACKGROUND EVE EVALUATOR NOTICE]:", e.message));
    } catch {
      console.warn("[BACKGROUND EVE EVALUATOR NOTICE]: Eve client call skipped.");
    }

    const assessmentData = {
      overallScore,
      codeQualityScore: syntaxScore,
      problemSolvingScore: algorithmScore,
      communicationScore,
      justification: evaluationSummary,
    };

    return NextResponse.json(
      {
        ...createSafeResult(assessmentData, "تم حفظ تقييم المقابلة وحساب النقاط بنجاح."),
        assessment: assessmentData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[CRITICAL ERROR - Evaluate Interview Route]:", error);
    return NextResponse.json(
      createSafeError(error, "evaluate-interview", "حدث خطأ غير متوقع أثناء معالجة تقييم المقابلة. يرجى المحاولة لاحقاً."),
      { status: 500 }
    );
  }
}

