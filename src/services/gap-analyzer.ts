/**
 * Gap Analyzer Service — Enhanced skill gap analysis
 * 
 * Goes beyond simple "missing skills" lists. Classifies gaps by importance,
 * identifies transferable skills, and suggests a learning path.
 */

import { sanitizePromptInput } from "@/lib/prompt-sanitizer";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { type GapAnalysis } from "@/lib/evaluation-rubric";
import { GapAnalysisSchema, stripMarkdownFences } from "@/lib/ai-schemas";

// ─── Input Types ────────────────────────────────────────────────────
interface GapAnalysisInput {
  candidateSkills: string[];
  candidateExperience: unknown;
  candidateEducation: unknown;
  resumeText?: string;
  jobRequirements: string[];
  jobDescription: string;
  jobTitle: string;
}

// ─── Prompt Builder ─────────────────────────────────────────────────
function buildGapAnalysisPrompt(input: GapAnalysisInput): string {
  return `You are an expert career advisor and technical recruiter. Perform a deep gap analysis between a candidate and a job posting.

## Candidate
- **Skills**: ${input.candidateSkills.length > 0 ? sanitizePromptInput(input.candidateSkills.join(", "), "skills") : "Not specified"}
- **Experience**: ${input.candidateExperience ? sanitizePromptInput(JSON.stringify(input.candidateExperience), "experience") : "Not specified"}
- **Education**: ${input.candidateEducation ? sanitizePromptInput(JSON.stringify(input.candidateEducation), "education") : "Not specified"}
${input.resumeText ? `- **Resume excerpt**: ${sanitizePromptInput(input.resumeText.substring(0, 2000), "resume-text")}` : ""}

## Job
- **Title**: ${input.jobTitle}
- **Required Skills**: ${sanitizePromptInput(input.jobRequirements.join(", "), "job-requirements")}
- **Description**: ${sanitizePromptInput(input.jobDescription.substring(0, 2000), "job-description")}

## Analysis Instructions
1. **Critical Gaps**: Skills explicitly required that the candidate clearly lacks. These would likely result in rejection.
2. **Nice-to-Have Gaps**: Preferred/bonus skills the candidate doesn't have, but won't be deal-breakers.
3. **Transferable Skills**: Skills the candidate has from other domains that partially cover a gap (e.g., Python experience transferring to a role that needs Go).
4. **Learning Path**: Practical, ordered steps to close the critical gaps, with realistic time estimates.

## Output Format (JSON only, no markdown fences)
{
  "criticalGaps": [
    { "skill": "Kubernetes", "importance": "CRITICAL", "suggestion": "..." }
  ],
  "niceToHaveGaps": [
    { "skill": "GraphQL", "importance": "MEDIUM", "suggestion": "..." }
  ],
  "transferableSkills": ["Python → Go (similar syntax paradigms)", "..."],
  "learningPath": [
    { "order": 1, "skill": "Docker", "action": "...", "estimatedTime": "1 week" }
  ]
}

Respond with ONLY the JSON object. All text content (suggestions, actions) should be in Arabic.`;
}

// ─── Parse Response ─────────────────────────────────────────────────
function parseGapAnalysisResponse(raw: string): GapAnalysis {
  const cleaned = stripMarkdownFences(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error("[gap-analyzer] Raw AI response (parse failure):", raw);
    // Return a safe empty analysis if parsing fails
    return {
      criticalGaps: [],
      niceToHaveGaps: [],
      transferableSkills: [],
      learningPath: [],
    };
  }

  const validation = GapAnalysisSchema.safeParse(parsed);
  if (!validation.success) {
    console.error("[gap-analyzer] Raw AI response (schema failure):", raw);
    console.error("[gap-analyzer] Zod issues:", validation.error.issues);
    // Return a safe empty analysis if schema validation fails
    return {
      criticalGaps: [],
      niceToHaveGaps: [],
      transferableSkills: [],
      learningPath: [],
    };
  }

  return validation.data;
}

// ─── Public API ─────────────────────────────────────────────────────
/**
 * Performs a deep gap analysis between a candidate's profile and a job posting.
 * Uses Gemini AI to classify gaps, find transferable skills, and suggest a learning path.
 */
import { requireAI } from "@/lib/ai-config";

export async function analyzeGaps(input: GapAnalysisInput): Promise<GapAnalysis> {
  requireAI();
  const prompt = buildGapAnalysisPrompt(input);


  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
    temperature: 0.3,
  });

  return parseGapAnalysisResponse(text);
}
