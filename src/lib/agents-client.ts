/**
 * Agent Client — Real AI agent implementations replacing stubs
 * 
 * Each agent uses Gemini AI with specialized prompts from agent-prompts.ts.
 * Previously, these were no-op stubs. Now they perform actual AI operations
 * and log executions to the AgentExecution table.
 */

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { prisma } from "@/lib/db";
import { buildAgentSystemPrompt } from "@/lib/agent-prompts";

// ─── Types ──────────────────────────────────────────────────────────
interface AgentMessage {
  message: string;
  sessionId?: string;
  turnId?: string;
}

interface AgentResponse {
  text: string;
  tokens?: number;
  durationMs?: number;
}

interface AgentSession {
  send: (payload: AgentMessage) => Promise<AgentResponse>;
}

interface AgentClient {
  session: () => AgentSession;
}

async function withRetry<T>(fn: () => Promise<T>, maxAttempts: number = 3): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < maxAttempts) {
        const delay = attempt * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

// ─── Agent Factory ──────────────────────────────────────────────────
function createAgentClient(agentName: string): AgentClient {
  return {
    session: () => ({
      send: async (payload: AgentMessage): Promise<AgentResponse> => {
        const startTime = Date.now();
        let status: "COMPLETED" | "FAILED" = "COMPLETED";
        let responseText = "";
        let error: string | undefined;
        let tokens: number | undefined;

        try {
          const systemPrompt = buildAgentSystemPrompt(agentName);

          const result = await withRetry(async () => generateText({
            model: google("gemini-1.5-flash"),
            system: systemPrompt,
            prompt: payload.message,
            temperature: 0.3,
          }));

          responseText = result.text;
          tokens = result.usage?.totalTokens;
        } catch (err) {
          status = "FAILED";
          error = err instanceof Error ? err.message : "Unknown error";
          console.error(`[Agent ${agentName} ERROR]:`, err);
        }

        const durationMs = Date.now() - startTime;

        // Log execution to database (fire-and-forget to avoid blocking)
        prisma.agentExecution
          .create({
            data: {
              agentName,
              sessionId: payload.sessionId || `session-${Date.now()}`,
              turnId: payload.turnId,
              prompt: payload.message.substring(0, 10000),
              response: responseText.substring(0, 10000),
              tokens,
              durationMs,
              status,
              error,
            },
          })
          .catch((logErr) => {
            console.error(`[Agent ${agentName} LOG ERROR]:`, logErr);
          });

        return { text: responseText, tokens, durationMs };
      },
    }),
  };
}

// ─── Exported Agent Clients ─────────────────────────────────────────
export const dispatcherClient = createAgentClient("dispatcher");
export const profilerClient = createAgentClient("profiler");
export const jobMatcherClient = createAgentClient("job_matcher");
export const interviewerClient = createAgentClient("interviewer");
export const evaluatorClient = createAgentClient("evaluator");
export const rankerClient = createAgentClient("ranker");
