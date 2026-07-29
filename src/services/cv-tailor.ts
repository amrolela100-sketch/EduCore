/**
 * CV Tailor Service — Per-job resume customization
 * 
 * Takes a candidate's resume text and a job posting, then generates
 * a tailored version that highlights the most relevant skills and experience
 * without fabricating or altering facts.
 */

import { sanitizePromptInput } from "@/lib/prompt-sanitizer";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { TailoredResumeSchema, stripMarkdownFences } from "@/lib/ai-schemas";

// ─── Input/Output Types ─────────────────────────────────────────────
interface TailorInput {
  resumeText: string;
  jobTitle: string;
  jobDescription: string;
  jobRequirements: string[];
  companyName: string;
}

interface TailorResult {
  tailoredContent: string;
  highlightedSkills: string[];
  matchPercentage: number;
}

// ─── Prompt Builder ─────────────────────────────────────────────────
function buildTailorPrompt(input: TailorInput): string {
  return `You are an expert ATS-optimization consultant. Your job is to re-order and rephrase a candidate's resume to best match a specific job posting.

## CRITICAL RULES
1. **NEVER fabricate** skills, experience, or qualifications the candidate doesn't have.
2. **NEVER remove** important information — only re-order and re-emphasize.
3. **Re-order sections** so the most relevant experience/skills appear first.
4. **Use keywords** from the job description naturally where the candidate's experience genuinely matches.
5. **Quantify achievements** where possible using the candidate's existing data.

## Candidate's Original Resume
${sanitizePromptInput(input.resumeText.substring(0, 4000), "resume-text")}

## Target Job
- **Title**: ${input.jobTitle}
- **Company**: ${input.companyName}
- **Required Skills**: ${input.jobRequirements.join(", ")}
- **Description**: ${sanitizePromptInput(input.jobDescription.substring(0, 2000), "job-description")}

## Output Format (JSON only, no markdown fences)
{
  "tailoredContent": "The full re-ordered and optimized resume text",
  "highlightedSkills": ["skill1", "skill2", "skill3"],
  "matchPercentage": 75
}

- "tailoredContent" is the full tailored resume text (keep the same language as the original).
- "highlightedSkills" are the candidate's skills that best match the job.
- "matchPercentage" is your honest estimate (0-100) of how well this candidate matches the job.

Respond with ONLY the JSON object.`;
}

// ─── Parse Response ─────────────────────────────────────────────────
function parseTailorResponse(raw: string): TailorResult {
  const cleaned = stripMarkdownFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[cv-tailor] Raw AI response (parse failure):", raw);
    throw new Error("فشل تحليل استجابة تخصيص السيرة الذاتية. يرجى المحاولة مرة أخرى.");
  }

  const validation = TailoredResumeSchema.safeParse(parsed);
  if (!validation.success) {
    console.error("[cv-tailor] Raw AI response (schema failure):", raw);
    console.error("[cv-tailor] Zod issues:", validation.error.issues);
    throw new Error("استجابة الذكاء الاصطناعي لا تطابق التنسيق المتوقع. يرجى المحاولة مرة أخرى.");
  }

  const data = validation.data;
  return {
    tailoredContent: data.tailoredContent,
    highlightedSkills: data.highlightedSkills,
    matchPercentage: Math.max(0, Math.min(100, data.matchPercentage)),
  };
}

// ─── Public API ─────────────────────────────────────────────────────
/**
 * Generates a tailored version of a resume for a specific job posting.
 * Re-orders and emphasizes relevant skills without fabricating content.
 */
export async function tailorResume(input: TailorInput): Promise<TailorResult> {
  const prompt = buildTailorPrompt(input);

  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
    temperature: 0.2, // Very low temperature for factual accuracy
  });

  return parseTailorResponse(text);
}
