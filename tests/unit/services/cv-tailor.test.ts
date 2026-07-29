import { describe, it, expect } from "vitest";
import { TailoredResumeSchema } from "@/lib/ai-schemas";

describe("CV Tailor Schema Validation", () => {
  it("should validate tailored resume payload", () => {
    const payload = {
      tailoredContent: "John Doe - Senior Software Engineer with Next.js experience...",
      highlightedSkills: ["TypeScript", "Next.js", "React"],
      matchPercentage: 88,
    };

    const parsed = TailoredResumeSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.matchPercentage).toBe(88);
    }
  });
});
