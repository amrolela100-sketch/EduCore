"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Sparkles, CheckCircle2 } from "lucide-react";
import { PulseBadge } from "@/components/ui/motion-wrapper";

interface EvaluationResult {
  overallScore: number;
  qualityScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  justification: string;
}

interface InterviewTelemetryPanelProps {
  evaluation: EvaluationResult | null;
  isEvaluating: boolean;
  challengeTitle: string;
  challengeDescription: string;
  questions: string[];
}

export function InterviewTelemetryPanel({
  evaluation,
  isEvaluating,
  challengeTitle,
  challengeDescription,
  questions = [],
}: InterviewTelemetryPanelProps) {
  return (
    <div className="bg-paper border-2 border-border p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] space-y-6 font-sans h-full overflow-y-auto">
      {/* Challenge Title & Badge */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-dotted border-border">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-ink mb-1">{challengeTitle}</h2>
          <p className="font-label-caps text-xs text-ink/60 uppercase">التحدي البرمجي المعزول Sandboxed Assessment</p>
        </div>
        <PulseBadge text="Live Telemetry" variant="info" />
      </div>

      {/* Description */}
      <div className="p-5 bg-paper border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] text-sm text-ink/80 leading-relaxed space-y-3">
        <span className="font-label-caps font-bold text-ink block border-b-2 border-border pb-2 inline-block">الوصف الفني للتحدي:</span>
        <p className="font-body-sm">{challengeDescription}</p>
      </div>

      {/* Required Questions */}
      {questions.length > 0 && (
        <div className="space-y-3 text-sm">
          <span className="font-label-caps font-bold text-ink block border-b-2 border-border pb-2 inline-block">الأسئلة التقنية المطلوبة:</span>
          <div className="space-y-3">
            {(questions ?? []).map((q, idx) => (
              <div key={idx} className="p-4 bg-paper border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                <span className="font-body-sm text-ink/80 leading-relaxed">{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Evaluation State */}
      {isEvaluating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-paper border-2 border-ink flex items-center gap-4 text-sm text-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
        >
          <Cpu className="w-6 h-6 text-coral animate-spin flex-shrink-0" />
          <div>
            <div className="font-label-caps font-bold uppercase mb-1">جاري تحليل وتقييم الكود عبر وكيل Gemini AI...</div>
            <div className="font-body-sm text-xs text-ink/70">قياس التعقيد، جودة البنية، وسلامة المخرجات.</div>
          </div>
        </motion.div>
      )}

      {/* Evaluation Results Card */}
      {evaluation && !isEvaluating && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-paper border-2 border-ink space-y-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
        >
          <div className="flex items-center justify-between border-b-2 border-dotted border-border pb-4">
            <span className="font-label-caps font-bold text-sm text-ink flex items-center gap-2 uppercase">
              <Sparkles className="w-5 h-5 text-coral" />
              نتائج التقييم النهائي AI Assessment Score
            </span>
            <span className="font-editorial font-bold text-3xl text-coral">{evaluation.overallScore}%</span>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-paper border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
              <span className="font-label-caps text-[10px] text-ink/60 uppercase block mb-1">جودة الكود</span>
              <span className="font-mono font-bold text-lg text-ink">{evaluation.qualityScore}%</span>
            </div>
            <div className="p-3 bg-paper border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
              <span className="font-label-caps text-[10px] text-ink/60 uppercase block mb-1">حل المشكلات</span>
              <span className="font-mono font-bold text-lg text-ink">{evaluation.problemSolvingScore}%</span>
            </div>
            <div className="p-3 bg-paper border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
              <span className="font-label-caps text-[10px] text-ink/60 uppercase block mb-1">التواصل المعماري</span>
              <span className="font-mono font-bold text-lg text-ink">{evaluation.communicationScore}%</span>
            </div>
          </div>

          <div className="p-5 bg-paper border-2 border-border text-sm text-ink/80 leading-relaxed font-sans shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
            <span className="font-label-caps font-bold text-ink block mb-3 border-b-2 border-border pb-2 inline-block">تقرير التدقيق الشفاف (Audit Trail):</span>
            <div className="font-body-sm">{evaluation.justification}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
