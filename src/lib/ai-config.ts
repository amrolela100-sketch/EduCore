/**
 * AI Configuration & Eager Validation Module
 * 
 * Provides centralized helper functions to verify Gemini API key presence
 * and fail fast with clear, user-friendly error messages if AI services
 * are requested without valid credentials.
 */

let aiAvailable: boolean | null = null;

export function isAIAvailable(): boolean {
  if (aiAvailable === null) {
    aiAvailable = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!aiAvailable) {
      console.warn(
        "[AI CONFIG WARNING]: GOOGLE_GENERATIVE_AI_API_KEY environment variable is missing. " +
        "AI-powered features (Evaluation, Gap Analysis, CV Tailoring, Interview Grading) will be disabled."
      );
    }
  }
  return aiAvailable;
}

export function requireAI(): void {
  if (!isAIAvailable()) {
    throw new Error(
      "خدمة الذكاء الاصطناعي غير متوفرة حالياً (مفتاح API مفقود في الخادم). يرجى التواصل مع مسؤول النظام."
    );
  }
}
