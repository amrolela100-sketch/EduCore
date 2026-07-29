/**
 * Archetype Detector — Auto-classify job postings
 * 
 * Analyzes job title and description to assign a job archetype
 * (BACKEND, FRONTEND, AI_ML, etc.) without AI calls — uses keyword matching.
 */

import { type JobArchetype } from "@/lib/evaluation-rubric";

// ─── Keyword Patterns ───────────────────────────────────────────────
const ARCHETYPE_KEYWORDS: Record<JobArchetype, string[]> = {
  AI_ML: [
    "machine learning", "deep learning", "nlp", "natural language",
    "computer vision", "tensorflow", "pytorch", "llm", "genai",
    "generative ai", "data science", "ml engineer", "ai engineer",
    "artificial intelligence", "neural network", "model training",
    "rag", "langchain", "llmops", "mlops", "ذكاء اصطناعي",
  ],
  DATA: [
    "data engineer", "data pipeline", "etl", "data warehouse",
    "spark", "airflow", "dbt", "bigquery", "snowflake",
    "data analyst", "analytics", "bi developer", "tableau",
    "power bi", "sql developer", "هندسة بيانات",
  ],
  DEVOPS: [
    "devops", "sre", "site reliability", "infrastructure",
    "kubernetes", "k8s", "docker", "terraform", "aws",
    "gcp", "azure", "cicd", "ci/cd", "platform engineer",
    "cloud engineer", "بنية تحتية",
  ],
  FRONTEND: [
    "frontend", "front-end", "front end", "react", "vue",
    "angular", "next.js", "nextjs", "ui developer",
    "ui engineer", "css", "tailwind", "واجهات أمامية",
  ],
  BACKEND: [
    "backend", "back-end", "back end", "api developer",
    "node.js", "nodejs", "python developer", "java developer",
    "go developer", "rust developer", "server-side", "خوادم",
  ],
  FULLSTACK: [
    "fullstack", "full-stack", "full stack", "مطور شامل",
  ],
  MANAGEMENT: [
    "engineering manager", "tech lead", "vp of engineering",
    "director of engineering", "cto", "head of engineering",
    "team lead", "مدير هندسي", "قائد فريق",
  ],
  QA: [
    "qa engineer", "quality assurance", "test engineer",
    "sdet", "automation test", "ضمان الجودة",
  ],
  DESIGN: [
    "ui/ux", "ux designer", "ui designer", "product designer",
    "design system", "figma", "تصميم واجهات",
  ],
  OTHER: [],
};

// ─── Detection Logic ────────────────────────────────────────────────
/**
 * Detects the archetype of a job posting from its title and description.
 * Uses keyword frequency matching — no AI call needed.
 * 
 * @returns The detected archetype, or "OTHER" if no clear match.
 */
export function detectArchetype(title: string, description: string): JobArchetype {
  const text = `${title} ${description}`.toLowerCase();

  const scores: Partial<Record<JobArchetype, number>> = {};

  for (const [archetype, keywords] of Object.entries(ARCHETYPE_KEYWORDS)) {
    if (archetype === "OTHER") continue;

    let score = 0;
    for (const keyword of keywords) {
      // Title matches are worth 3x — they're more signal-dense
      if (title.toLowerCase().includes(keyword)) {
        score += 3;
      }
      // Count occurrences in description
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    if (score > 0) {
      scores[archetype as JobArchetype] = score;
    }
  }

  // Find the archetype with the highest score
  let bestArchetype: JobArchetype = "OTHER";
  let bestScore = 0;

  for (const [archetype, score] of Object.entries(scores)) {
    if ((score ?? 0) > bestScore) {
      bestScore = score ?? 0;
      bestArchetype = archetype as JobArchetype;
    }
  }

  // Special case: if both FRONTEND and BACKEND score high, it's FULLSTACK
  const frontendScore = scores.FRONTEND ?? 0;
  const backendScore = scores.BACKEND ?? 0;
  if (frontendScore > 2 && backendScore > 2 && bestArchetype !== "FULLSTACK") {
    bestArchetype = "FULLSTACK";
  }

  return bestArchetype;
}
