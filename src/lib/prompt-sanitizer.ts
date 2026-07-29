/**
 * Sanitizes user-controlled input before interpolating into LLM prompts.
 * - Escapes common prompt injection sequences
 * - Wraps user input in XML-like delimiters
 * - Sanitizes label parameters and removes control characters
 */

const INJECTION_PATTERNS = [
  /\b(ignore previous instructions|ignore all prior instructions|override system prompt|you are now|new role)\b/gi,
  /<\/?(?:system|user|assistant|instruction)>/gi,
  /<\|(?:system|user|assistant)\|>/gi,
  /\[INST\]/gi,
  /###\s*(?:System|Assistant|Human):/gi,
  /---\s*(?:system|instruction|prompt)/gi,
  /\{\{[\s\S]*?\}\}/g, // template injection
  /[\x00-\x08\x0B\x0C\x0E-\x1F]/g, // control chars
];

export function sanitizePromptInput(input: string, label?: string): string {
  let sanitized = input;
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[FILTERED]");
  }

  const safeLabel = (label || "user-input").replace(/[^a-zA-Z0-9_-]/g, "_");
  return `<USER_INPUT label="${safeLabel}">\n${sanitized}\n</USER_INPUT>`;
}
