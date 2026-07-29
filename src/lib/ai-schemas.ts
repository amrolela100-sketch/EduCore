/**
 * AI Response Validation Schemas
 *
 * Zod schemas for every AI-generated JSON output consumed by the app.
 * All AI response parsers must:
 *   1. stripMarkdownFences(raw)
 *   2. JSON.parse(cleaned)
 *   3. schema.parse(parsed)  (or safeParse with explicit error handling)
 *
 * Never consume an AI response without running it through its schema.
 */

import { z } from "zod";

// ─── Shared Primitives ──────────────────────────────────────────────

export const AssessmentScoreSchema = z.object({
  dimension: z.string().min(1),
  score: z.number().min(0).max(100),
  justification: z.string(),
});

export const DimensionScoreSchema = z.object({
  score: z.number().min(0).max(100),
  justification: z.string(),
});

// ─── Interview Evaluation (evaluate-interview route) ────────────────

export const InterviewEvaluationSchema = z.object({
  syntax_correctness: DimensionScoreSchema,
  algorithm_efficiency: DimensionScoreSchema,
  code_structure: DimensionScoreSchema,
  edge_cases: DimensionScoreSchema,
  communication: DimensionScoreSchema,
  overall_score: z.number().min(0).max(100),
  summary: z.string(),
});

// ─── Job-Candidate Match (job-evaluator service) ────────────────────

export const AxisScoreSchema = z.object({
  axis: z.string().length(1),
  score: z.number(),
  justification: z.string(),
});

export const JobMatchEvaluationSchema = z.object({
  axes: z.array(AxisScoreSchema).length(6),
  summary: z.string(),
  gaps: z.array(z.string()),
  strengths: z.array(z.string()),
  recommendations: z.string(),
});

// ─── Skill-Gap Analysis (gap-analyzer service) ──────────────────────

export const SkillGapSchema = z.object({
  skill: z.string().min(1),
  importance: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  suggestion: z.string(),
});

export const LearningStepSchema = z.object({
  order: z.number().int().nonnegative(),
  skill: z.string().min(1),
  action: z.string(),
  estimatedTime: z.string(),
});

export const GapAnalysisSchema = z.object({
  criticalGaps: z.array(SkillGapSchema),
  niceToHaveGaps: z.array(SkillGapSchema),
  transferableSkills: z.array(z.string()),
  learningPath: z.array(LearningStepSchema),
});

// ─── Tailored Resume (cv-tailor service) ────────────────────────────

export const TailoredResumeSchema = z.object({
  tailoredContent: z.string().min(1),
  highlightedSkills: z.array(z.string()),
  matchPercentage: z.number().min(0).max(100),
});

// ─── Helpers ────────────────────────────────────────────────────────

/**
 * Remove markdown JSON fences (```json … ```) from an AI response.
 */
export function stripMarkdownFences(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
  }
  return cleaned;
}
