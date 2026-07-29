/**
 * Evaluation Rubric Type System — inspired by career-ops A-F scoring
 * 
 * Defines the structured evaluation framework used to assess how well
 * a candidate's profile matches a specific job posting. Each axis is
 * scored 1.0–5.0 with required justification.
 */

// ─── Evaluation Axis Definitions ────────────────────────────────────
export type EvaluationAxis = "A" | "B" | "C" | "D" | "E" | "F";

export const EVALUATION_AXES: Record<EvaluationAxis, { label: string; labelAr: string; description: string }> = {
  A: {
    label: "Profile Match",
    labelAr: "تطابق الملف الشخصي",
    description: "Skills, experience, and qualifications alignment with job requirements",
  },
  B: {
    label: "Growth Opportunity",
    labelAr: "فرصة النمو",
    description: "Learning potential, career advancement, and professional development opportunity",
  },
  C: {
    label: "Compensation Alignment",
    labelAr: "توافق التعويضات",
    description: "Salary range, benefits, and total compensation package alignment",
  },
  D: {
    label: "Culture Fit",
    labelAr: "ملاءمة الثقافة",
    description: "Company culture, values, work style, and team dynamics fit",
  },
  E: {
    label: "Role Clarity",
    labelAr: "وضوح الدور",
    description: "How clearly defined the role requirements, responsibilities, and expectations are",
  },
  F: {
    label: "Red Flags",
    labelAr: "إشارات تحذيرية",
    description: "Warning signals — unrealistic requirements, vague descriptions, turnover indicators (inverted: 5.0 = no red flags)",
  },
};

// ─── Score Interpretation ───────────────────────────────────────────
export type ScoreGrade = "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "CRITICAL";

export function getScoreGrade(score: number): ScoreGrade {
  if (score >= 4.5) return "EXCELLENT";
  if (score >= 3.5) return "GOOD";
  if (score >= 2.5) return "FAIR";
  if (score >= 1.5) return "POOR";
  return "CRITICAL";
}

export function getScoreLabel(score: number): string {
  const grade = getScoreGrade(score);
  const labels: Record<ScoreGrade, string> = {
    EXCELLENT: "ممتاز",
    GOOD: "جيد",
    FAIR: "مقبول",
    POOR: "ضعيف",
    CRITICAL: "حرج",
  };
  return labels[grade];
}

export function getScoreColor(score: number): string {
  const grade = getScoreGrade(score);
  const colors: Record<ScoreGrade, string> = {
    EXCELLENT: "#10b981",
    GOOD: "#3b82f6",
    FAIR: "#f59e0b",
    POOR: "#ef4444",
    CRITICAL: "#dc2626",
  };
  return colors[grade];
}

// ─── Evaluation Result Types ────────────────────────────────────────
export interface AxisScore {
  axis: EvaluationAxis;
  score: number;        // 1.0–5.0
  justification: string;
}

export interface EvaluationResult {
  overallScore: number;       // Weighted average 1.0–5.0
  axes: AxisScore[];
  summary: string;
  gaps: string[];             // Missing skills
  strengths: string[];        // Strong alignment points
  recommendations: string;    // AI advice for the candidate
}

// ─── Gap Analysis Types ─────────────────────────────────────────────
export interface GapAnalysis {
  criticalGaps: SkillGap[];        // Required skills that are missing
  niceToHaveGaps: SkillGap[];      // Optional skills that are missing
  transferableSkills: string[];     // Skills from other domains that transfer
  learningPath: LearningStep[];     // Suggested steps to close gaps
}

export interface SkillGap {
  skill: string;
  importance: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  suggestion: string;    // How to acquire this skill
}

export interface LearningStep {
  order: number;
  skill: string;
  action: string;
  estimatedTime: string;  // e.g., "2 weeks", "1 month"
}

// ─── Job Archetype Types ────────────────────────────────────────────
export type JobArchetype =
  | "BACKEND"
  | "FRONTEND"
  | "FULLSTACK"
  | "DEVOPS"
  | "DATA"
  | "AI_ML"
  | "MANAGEMENT"
  | "QA"
  | "DESIGN"
  | "OTHER";

export const JOB_ARCHETYPES: Record<JobArchetype, { label: string; labelAr: string }> = {
  BACKEND: { label: "Backend Engineering", labelAr: "هندسة الخوادم" },
  FRONTEND: { label: "Frontend Engineering", labelAr: "هندسة الواجهات" },
  FULLSTACK: { label: "Full-Stack Engineering", labelAr: "هندسة شاملة" },
  DEVOPS: { label: "DevOps / Infrastructure", labelAr: "البنية التحتية" },
  DATA: { label: "Data Engineering / Analytics", labelAr: "هندسة البيانات" },
  AI_ML: { label: "AI / Machine Learning", labelAr: "الذكاء الاصطناعي" },
  MANAGEMENT: { label: "Engineering Management", labelAr: "إدارة هندسية" },
  QA: { label: "Quality Assurance", labelAr: "ضمان الجودة" },
  DESIGN: { label: "UI/UX Design", labelAr: "تصميم الواجهات" },
  OTHER: { label: "Other", labelAr: "أخرى" },
};

// ─── Evaluation Weights ─────────────────────────────────────────────
/** Default weights for each axis in the overall score calculation */
export const DEFAULT_AXIS_WEIGHTS: Record<EvaluationAxis, number> = {
  A: 0.35,  // Profile match is the most important
  B: 0.15,
  C: 0.15,
  D: 0.10,
  E: 0.10,
  F: 0.15,  // Red flags are significant
};

export function calculateOverallScore(axes: AxisScore[]): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const axis of axes) {
    const weight = DEFAULT_AXIS_WEIGHTS[axis.axis] ?? 0;
    weightedSum += axis.score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round((weightedSum / totalWeight) * 10) / 10;
}
