export interface SafeResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export function createSafeResult<T>(data: T, message?: string): SafeResult<T> {
  return { success: true, data, message };
}

export function createSafeError(error: unknown, context: string, userMessage?: string): SafeResult<never> {
  console.error(`[CRITICAL ERROR - ${context}]:`, error);
  return {
    success: false,
    error: userMessage || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقاً.",
  };
}
