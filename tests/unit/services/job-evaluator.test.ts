import { describe, it, expect, vi } from "vitest";
import { calculateOverallScore } from "@/lib/evaluation-rubric";

describe("Job Evaluator Logic & Rubric", () => {
  it("should correctly compute weighted overall score for A-F rubric", () => {
    const axes = [
      { axis: "A" as const, score: 5.0, justification: "Great match" },
      { axis: "B" as const, score: 4.0, justification: "Good growth" },
      { axis: "C" as const, score: 3.0, justification: "Neutral comp" },
      { axis: "D" as const, score: 4.0, justification: "Good fit" },
      { axis: "E" as const, score: 5.0, justification: "Clear role" },
      { axis: "F" as const, score: 5.0, justification: "No red flags" },
    ];

    const overall = calculateOverallScore(axes);
    expect(overall).toBeGreaterThanOrEqual(1.0);
    expect(overall).toBeLessThanOrEqual(5.0);
    expect(overall).toBeCloseTo(4.4, 1);
  });
});
