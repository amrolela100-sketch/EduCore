import vm from "vm";

const FORBIDDEN_KEYWORDS = [
  "process",
  "require",
  "import",
  "globalThis",
  "global",
  "__dirname",
  "__filename",
  "module",
  "exports",
  "child_process",
  "constructor",
  "__proto__",
  "prototype",
  "Function",
  "eval",
  "Reflect",
  "Proxy",
  "getPrototypeOf",
  "setPrototypeOf",
  "getOwnPropertyDescriptor",
  "defineProperty",
];

export interface ExecutionResult {
  success: boolean;
  logs: string[];
  result: string | null;
  executionTimeMs: number;
  error?: string;
}

export async function executeSandboxedCode(
  code: string,
  language: string = "typescript",
  timeoutMs: number = 3000
): Promise<ExecutionResult> {
  const startTime = Date.now();
  const logs: string[] = [];

  // 1. Basic Static Security Inspection
  for (const forbidden of FORBIDDEN_KEYWORDS) {
    const regex = new RegExp(`\\b${forbidden}\\b`, "i");
    if (regex.test(code)) {
      return {
        success: false,
        logs: [`[SECURITY ERROR]: Forbidden keyword detected: "${forbidden}"`],
        result: null,
        executionTimeMs: Date.now() - startTime,
        error: `استخدام العبارات المحظورة (${forbidden}) غير مسموح به في بيئة المقابلة.`,
      };
    }
  }

  // 2. Strip TypeScript annotations
  let executableCode = code;
  if (language === "typescript") {
    executableCode = code
      .replace(/interface\s+\w+[\s\S]*?\{[\s\S]*?\}/g, "")
      .replace(/type\s+\w+\s*=[\s\S]*?;/g, "")
      .replace(/enum\s+\w+[\s\S]*?\{[\s\S]*?\}/g, "")
      .replace(/:\s*([A-Za-z0-9_<>|[\]\s&]+)(?=[=,);\n{])/g, "")
      .replace(/as\s+[A-Za-z0-9_<>|[\]]+/g, "")
      .replace(/export\s+/g, "")
      .replace(/import\s+.*?;/g, "");
  }

  // 3. Custom console logger
  const customConsole = {
    log: (...args: unknown[]) => {
      logs.push(args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" "));
    },
    error: (...args: unknown[]) => {
      logs.push(`[ERROR] ${args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ")}`);
    },
    warn: (...args: unknown[]) => {
      logs.push(`[WARN] ${args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ")}`);
    },
    info: (...args: unknown[]) => {
      logs.push(`[INFO] ${args.map(arg => typeof arg === "object" ? JSON.stringify(arg) : String(arg)).join(" ")}`);
    },
  };

  // 4. Create isolated context without access to process or outer globals
  const sandbox = Object.create(null);
  sandbox.console = customConsole;
  sandbox.Math = Math;
  sandbox.JSON = JSON;
  sandbox.Date = Date;
  sandbox.Array = Array;
  sandbox.String = String;
  sandbox.Number = Number;
  sandbox.Boolean = Boolean;
  sandbox.RegExp = RegExp;
  sandbox.Set = Set;
  sandbox.Map = Map;

  try {
    const context = vm.createContext(sandbox);
    const script = new vm.Script(executableCode);
    const rawResult = script.runInContext(context, { timeout: timeoutMs });
    const executionTimeMs = Date.now() - startTime;

    return {
      success: true,
      logs,
      result: rawResult !== undefined ? (typeof rawResult === "object" ? JSON.stringify(rawResult) : String(rawResult)) : null,
      executionTimeMs,
    };
  } catch (err: unknown) {
    const executionTimeMs = Date.now() - startTime;
    const errorMessage = err instanceof Error ? err.message : "خطأ أثناء تنفيذ الكود";
    return {
      success: false,
      logs: [...logs, `[RUNTIME ERROR]: ${errorMessage}`],
      result: null,
      executionTimeMs,
      error: errorMessage,
    };
  }
}
