"use client";

import { useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";

interface CodeTelemetryViewerProps {
  code: string;
  language?: string;
  candidateName?: string;
  metrics?: {
    executionTimeMs?: number;
    memoryUsageKb?: number;
    cyclomaticComplexity?: number;
    testPassRate?: number;
    aiReview?: Record<string, unknown>;
  };
}

export function CodeTelemetryViewer({ code, language = "typescript", candidateName }: CodeTelemetryViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const lines = code.split("\n");

  return (
    <div dir="ltr" className="bg-ink text-paper border-2 border-border flex flex-col font-data-mono text-xs overflow-hidden shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] text-left">
      {/* Code Header Bar */}
      <div className="bg-ink/80 px-4 py-2.5 flex justify-between items-center border-b border-ink/60 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-coral" />
          <span className="font-bold text-xs uppercase text-paper tracking-wider">
            {language} • Candidate Submission {candidateName ? `(${candidateName})` : ""}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-4 py-2 bg-paper text-ink font-label-caps hover:bg-coral hover:text-paper transition-all duration-200 cursor-pointer border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-300" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="p-4 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed select-text font-data-mono">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors">
                <td className="text-gray-500 text-right pr-4 py-0.5 select-none w-8 font-mono text-xs opacity-60">
                  {idx + 1}
                </td>
                <td className="pl-2 py-0.5 whitespace-pre font-mono text-xs text-paper/80">
                  {line}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
