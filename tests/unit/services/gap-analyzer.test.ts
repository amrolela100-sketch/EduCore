import { describe, it, expect } from "vitest";
import { GapAnalysisSchema } from "@/lib/ai-schemas";

describe("Gap Analyzer Schemas", () => {
  it("should validate a structured gap analysis output correctly", () => {
    const validData = {
      criticalGaps: [
        { skill: "Docker", importance: "CRITICAL", suggestion: "Learn containers" },
      ],
      niceToHaveGaps: [
        { skill: "GraphQL", importance: "MEDIUM", suggestion: "Basic queries" },
      ],
      transferableSkills: ["Python -> Go"],
      learningPath: [
        { order: 1, skill: "Docker", action: "Complete course", estimatedTime: "1 week" },
      ],
    };

    const result = GapAnalysisSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
