import { describe, it, expect } from "vitest";
import { detectArchetype } from "@/services/archetype-detector";

describe("detectArchetype Service", () => {
  it("should classify backend role from title and description", () => {
    const result = detectArchetype(
      "Senior Backend Engineer",
      "We are looking for a Node.js and Python developer to build REST APIs and microservices."
    );
    expect(result).toBe("BACKEND");
  });

  it("should classify frontend role from title and description", () => {
    const result = detectArchetype(
      "Frontend Developer",
      "Building user interfaces with React, Next.js, and Tailwind CSS."
    );
    expect(result).toBe("FRONTEND");
  });

  it("should classify fullstack role when both frontend and backend score high", () => {
    const result = detectArchetype(
      "Fullstack Developer",
      "Working on React frontend and Node.js backend server API."
    );
    expect(result).toBe("FULLSTACK");
  });

  it("should classify AI/ML role from keywords", () => {
    const result = detectArchetype(
      "Machine Learning Specialist",
      "Experience with PyTorch, LLMs, GenAI, RAG, and fine-tuning models."
    );
    expect(result).toBe("AI_ML");
  });

  it("should classify DevOps role from infrastructure keywords", () => {
    const result = detectArchetype(
      "DevOps / SRE Engineer",
      "Managing Kubernetes clusters, Terraform scripts, and AWS CI/CD pipelines."
    );
    expect(result).toBe("DEVOPS");
  });

  it("should fallback to OTHER when no keywords match", () => {
    const result = detectArchetype(
      "General Operations Specialist",
      "Handling office management, scheduling, and logistics."
    );
    expect(result).toBe("OTHER");
  });
});
