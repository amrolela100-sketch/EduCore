/**
 * Job Evaluator Service — AI-powered candidate-job matching
 * 
 * Inspired by career-ops evaluation engine. Uses Gemini AI to assess
 * how well a candidate's profile matches a job posting across 6 axes (A-F).
 */

import { sanitizePromptInput } from "@/lib/prompt-sanitizer";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import {
  type EvaluationResult,
  type AxisScore,
  type EvaluationAxis,
  calculateOverallScore,
} from "@/lib/evaluation-rubric";
import { JobMatchEvaluationSchema, stripMarkdownFences } from "@/lib/ai-schemas";

// ─── Input Types ────────────────────────────────────────────────────
interface CandidateData {
  skills: string[];
  experience: unknown;     // Json from Prisma
  education: unknown;
  certifications: unknown;
  languages: unknown;
  projects: unknown;
  resumeText?: string;     // Extracted text from the latest resume
}

interface JobData {
  title: string;
  description: string;
  requirements: string[];
  salaryRange: string | null;
  location: string | null;
  companyName: string;
  companyDescription: string | null;
}

// ─── Evaluation Prompt ──────────────────────────────────────────────
function buildEvaluationPrompt(candidate: CandidateData, job: JobData): string {
  const candidateSection = `
## Candidate Profile
- **Skills**: ${candidate.skills.length > 0 ? sanitizePromptInput(candidate.skills.join(", "), "skills") : "Not specified"}
- **Experience**: ${candidate.experience ? sanitizePromptInput(JSON.stringify(candidate.experience), "experience") : "Not specified"}
- **Education**: ${candidate.education ? sanitizePromptInput(JSON.stringify(candidate.education), "education") : "Not specified"}
- **Certifications**: ${candidate.certifications ? sanitizePromptInput(JSON.stringify(candidate.certifications), "certifications") : "None"}
- **Languages**: ${candidate.languages ? sanitizePromptInput(JSON.stringify(candidate.languages), "languages") : "Not specified"}
- **Projects**: ${candidate.projects ? sanitizePromptInput(JSON.stringify(candidate.projects), "projects") : "None"}
${candidate.resumeText ? `- **Resume Text**: ${sanitizePromptInput(candidate.resumeText.substring(0, 3000), "resume-text")}` : ""}
`.trim();

  const jobSection = `
## Job Posting
- **Title**: ${job.title}
- **Company**: ${job.companyName}${job.companyDescription ? ` — ${sanitizePromptInput(job.companyDescription, "company-description")}` : ""}
- **Description**: ${sanitizePromptInput(job.description, "job-description")}
- **Required Skills**: ${job.requirements.length > 0 ? sanitizePromptInput(job.requirements.join(", "), "job-requirements") : "Not specified"}
- **Salary Range**: ${job.salaryRange ?? "Not disclosed"}
- **Location**: ${job.location ?? "Not specified"}
`.trim();

  return `You are an expert recruitment evaluator. Assess how well the candidate matches the job posting using the A-F rubric below. Be honest and specific — do not inflate scores.

${candidateSection}

${jobSection}

## Evaluation Rubric (score each axis 1.0–5.0)

**A – Profile Match**: How well do the candidate's skills, experience, and qualifications align with the job requirements?
**B – Growth Opportunity**: How much growth potential does this role offer the candidate?
**C – Compensation Alignment**: Based on the candidate's level and the stated salary range, how aligned is the compensation? If salary is undisclosed, score 3.0 (neutral) and note it.
**D – Culture Fit**: Based on available signals (company description, role description, team structure), how likely is a culture fit?
**E – Role Clarity**: How clearly defined are the role requirements and expectations? Vague or bloated JDs score lower.
**F – Red Flags**: Are there warning signs? Unrealistic requirements, very long requirement lists, unclear responsibilities, signs of high turnover? Score 5.0 for no red flags, 1.0 for many.

## Required Output Format (JSON only, no markdown fences)
{
  "axes": [
    { "axis": "A", "score": 0.0, "justification": "..." },
    { "axis": "B", "score": 0.0, "justification": "..." },
    { "axis": "C", "score": 0.0, "justification": "..." },
    { "axis": "D", "score": 0.0, "justification": "..." },
    { "axis": "E", "score": 0.0, "justification": "..." },
    { "axis": "F", "score": 0.0, "justification": "..." }
  ],
  "summary": "2-3 sentence overall assessment in Arabic",
  "gaps": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "recommendations": "Specific advice for the candidate in Arabic"
}

Respond with ONLY the JSON object. No additional text.`;
}

// ─── Parse AI Response ──────────────────────────────────────────────
function parseEvaluationResponse(raw: string): EvaluationResult {
  const cleaned = stripMarkdownFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[job-evaluator] Raw AI response (parse failure):", raw);
    throw new Error("فشل تحليل استجابة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
  }

  const validation = JobMatchEvaluationSchema.safeParse(parsed);
  if (!validation.success) {
    console.error("[job-evaluator] Raw AI response (schema failure):", raw);
    console.error("[job-evaluator] Zod issues:", validation.error.issues);
    throw new Error("استجابة الذكاء الاصطناعي لا تطابق التنسيق المتوقع. يرجى المحاولة مرة أخرى.");
  }

  const data = validation.data;

  // Validate and clamp scores to 1.0–5.0
  const axes: AxisScore[] = data.axes.map((a) => ({
    axis: a.axis as EvaluationAxis,
    score: Math.max(1.0, Math.min(5.0, Number(a.score) || 3.0)),
    justification: a.justification || "",
  }));

  // Ensure all 6 axes are present
  const requiredAxes: EvaluationAxis[] = ["A", "B", "C", "D", "E", "F"];
  for (const axis of requiredAxes) {
    if (!axes.find((a) => a.axis === axis)) {
      axes.push({ axis, score: 3.0, justification: "لم يتم تقييم هذا المحور" });
    }
  }

  return {
    overallScore: calculateOverallScore(axes),
    axes,
    summary: data.summary || "لم يتم إنشاء ملخص.",
    gaps: data.gaps ?? [],
    strengths: data.strengths ?? [],
    recommendations: data.recommendations || "لا توجد توصيات.",
  };
}

// ─── Public API ─────────────────────────────────────────────────────
/**
 * Evaluates how well a candidate matches a job posting using AI.
 * Returns a structured EvaluationResult with 6-axis scores.
 * 
 * @throws Error if AI call fails or response is unparseable
 */
import { requireAI } from "@/lib/ai-config";

export async function evaluateCandidateJobMatch(
  candidate: CandidateData,
  job: JobData,
): Promise<EvaluationResult> {
  requireAI();
  const prompt = buildEvaluationPrompt(candidate, job);


  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
    temperature: 0.3, // Low temperature for consistent, objective scoring
  });

  return parseEvaluationResponse(text);
}
