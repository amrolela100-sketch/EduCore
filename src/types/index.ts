// Core types will be populated as we build each feature
// This file serves as the central export for all shared types

export type UserRole = "CANDIDATE" | "HR_ADMIN" | "TECH_ADMIN" | "SYSTEM_ADMIN";

export interface InterviewQuestionData {
  id?: string;
  text: string;
  type: "CODING" | "TECHNICAL" | "BEHAVIORAL";
  codingPrompt?: string;
  testCases?: Array<{ input: string; expectedOutput: string }>;
  points?: number;
}

export interface InterviewTranscript {
  challengeType?: string;
  challengeTitle?: string;
  challengeDescription?: string;
  description?: string;
  questions?: Array<string | InterviewQuestionData>;
  candidateAnswers?: Record<string, string>;
  submittedCode?: string;
  sandboxOutput?: string;
}

export interface AssessmentPayload {
  overallScore: number;
  summary: string;
  scores: Array<{
    dimension: string;
    score: number;
    justification: string;
  }>;
}

// Re-export career-ops integration types for convenience
export type {
  EvaluationAxis,
  EvaluationResult,
  AxisScore,
  GapAnalysis,
  SkillGap,
  LearningStep,
  JobArchetype,
  ScoreGrade,
} from "@/lib/evaluation-rubric";

