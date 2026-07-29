"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { Terminal, Play, RotateCcw, Send, Loader2 } from "lucide-react";

interface InterviewCodeTerminalProps {
  language: string;
  setLanguage: (lang: string) => void;
  code: string;
  setCode: (code: string) => void;
  outputLog: string[];
  isSubmitting: boolean;
  onRunTest: () => void;
  onReset: () => void;
  onSubmitAssessment: () => void;
}

function InterviewCodeTerminalComponent({
  language,
  setLanguage,
  code,
  setCode,
  outputLog,
  isSubmitting,
  onRunTest,
  onReset,
  onSubmitAssessment,
}: InterviewCodeTerminalProps) {
  return (
    <div className="flex flex-col h-full bg-ink text-paper border-2 border-border overflow-hidden shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] font-mono text-sm">
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-5 py-4 bg-ink border-b-2 border-dotted border-paper/20">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-coral" />
          <span className="font-label-caps font-bold text-paper tracking-wide uppercase">
            المنصة البرمجية Sandboxed Code Runner
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-paper text-ink border-2 border-border font-label-caps px-3 py-2 outline-none focus:border-coral cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
            aria-label="Programming language"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python 3</option>
            <option value="go">Go 1.21</option>
          </select>
          <button
            onClick={onReset}
            className="p-2 border-2 border-transparent hover:border-paper hover:bg-paper/10 text-paper transition-all cursor-pointer"
            title="إعادة التعيين"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Textarea */}
      <div className="relative flex-grow p-5 bg-ink">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          aria-label="Code editor"
          role="textbox"
          spellCheck={false}
          className="w-full h-full bg-transparent text-emerald-400 font-mono text-sm leading-relaxed outline-none resize-none selection:bg-coral selection:text-ink"
        />
      </div>

      {/* Terminal Output Stream */}
      <div className="h-40 bg-ink border-t-2 border-dotted border-paper/20 p-5 overflow-y-auto space-y-2">
        <div className="text-xs text-paper/50 font-label-caps font-bold uppercase tracking-wider mb-2 border-b-2 border-paper/10 pb-2 inline-block">
          سجل التنفيذ وتجارب الأكواد (Execution Telemetry Logs):
        </div>
        {outputLog.length === 0 ? (
          <div className="text-paper/40 italic font-body-sm">
            اضغط "تشغيل واختبار الكود" لعرض نتيجة التنفيذ الفعلي...
          </div>
        ) : (
          outputLog.map((log, i) => (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className="text-paper/80 font-mono"
            >
              {log}
            </motion.div>
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-ink border-t-2 border-paper/20 flex items-center justify-between gap-4">
        <button
          onClick={onRunTest}
          disabled={isSubmitting}
          className="px-6 py-3 bg-paper text-ink font-label-caps font-bold uppercase border-2 border-transparent flex items-center gap-2 transition-all hover:bg-emerald-400 disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
        >
          <Play className="w-4 h-4 text-ink" />
          <span>تشغيل واختبار الكود</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmitAssessment}
          disabled={isSubmitting}
          className="px-6 py-3 bg-coral text-ink font-label-caps font-bold uppercase border-2 border-transparent flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] disabled:opacity-50 cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>إرسال الحل للتقييم AI Evaluation</span>
        </motion.button>
      </div>
    </div>
  );
}

export const InterviewCodeTerminal = memo(InterviewCodeTerminalComponent);
