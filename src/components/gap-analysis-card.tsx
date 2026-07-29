"use client";

/**
 * GapAnalysisCard — Displays detailed skill gap analysis results
 * 
 * Shows critical gaps, nice-to-have gaps, transferable skills,
 * and a suggested learning path with estimated times.
 */

import { type GapAnalysis } from "@/lib/evaluation-rubric";

interface GapAnalysisCardProps {
  analysis: GapAnalysis | null;
}

const IMPORTANCE_COLORS: Record<string, string> = {
  CRITICAL: "bg-coral text-paper",
  HIGH: "bg-ink text-paper",
  MEDIUM: "bg-ink/10 text-ink",
  LOW: "bg-ink/5 text-ink/60",
};

const DOT_COLORS: Record<string, string> = {
  CRITICAL: "bg-coral",
  HIGH: "bg-ink",
  MEDIUM: "bg-ink/50",
  LOW: "bg-ink/20",
};

const IMPORTANCE_LABELS: Record<string, string> = {
  CRITICAL: "حرج",
  HIGH: "مرتفع",
  MEDIUM: "متوسط",
  LOW: "منخفض",
};

export function GapAnalysisCard({ analysis }: GapAnalysisCardProps) {
  if (!analysis) {
    return (
      <div className="p-8 text-center text-ink/60 font-label-caps text-sm bg-paper border-2 border-dotted border-border">
        <p>لم يتم إجراء تحليل الفجوات بعد.</p>
      </div>
    );
  }

  const hasCritical = (analysis.criticalGaps ?? []).length > 0;
  const hasNiceToHave = (analysis.niceToHaveGaps ?? []).length > 0;
  const hasTransferable = (analysis.transferableSkills ?? []).length > 0;
  const hasLearningPath = (analysis.learningPath ?? []).length > 0;

  return (
    <div className="flex flex-col gap-5 p-6 bg-paper border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] font-sans">
      {/* Critical Gaps */}
      {hasCritical && (
        <section>
          <h4 className="flex items-center gap-2 mb-3 font-editorial text-lg text-ink">
            <span className={`w-2 h-2 rounded-full ${DOT_COLORS.CRITICAL}`} />
            فجوات حرجة
          </h4>
          <div className="flex flex-col gap-2">
            {(analysis.criticalGaps ?? []).map((gap, i) => (
              <div key={i} className="p-3 bg-surface-low border-2 border-dotted border-border hover:border-ink transition-colors">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-label-caps font-bold text-sm text-ink">{gap.skill}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${IMPORTANCE_COLORS[gap.importance] || IMPORTANCE_COLORS.LOW}`}>
                    {IMPORTANCE_LABELS[gap.importance] || gap.importance}
                  </span>
                </div>
                {gap.suggestion && (
                  <p className="mt-2 text-sm text-ink/70 leading-relaxed">{gap.suggestion}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nice-to-Have Gaps */}
      {hasNiceToHave && (
        <section>
          <h4 className="flex items-center gap-2 mb-3 font-editorial text-lg text-ink">
            <span className={`w-2 h-2 rounded-full ${DOT_COLORS.MEDIUM}`} />
            فجوات اختيارية
          </h4>
          <div className="flex flex-col gap-2">
            {(analysis.niceToHaveGaps ?? []).map((gap, i) => (
              <div key={i} className="p-3 bg-surface-low border-2 border-dotted border-border hover:border-ink transition-colors">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-label-caps font-bold text-sm text-ink">{gap.skill}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${IMPORTANCE_COLORS[gap.importance] || IMPORTANCE_COLORS.LOW}`}>
                    {IMPORTANCE_LABELS[gap.importance] || gap.importance}
                  </span>
                </div>
                {gap.suggestion && (
                  <p className="mt-2 text-sm text-ink/70 leading-relaxed">{gap.suggestion}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Transferable Skills */}
      {hasTransferable && (
        <section>
          <h4 className="flex items-center gap-2 mb-3 font-editorial text-lg text-ink">
            <span className="w-2 h-2 rounded-full bg-ink" />
            مهارات قابلة للنقل
          </h4>
          <div className="flex flex-wrap gap-2">
            {(analysis.transferableSkills ?? []).map((skill, i) => (
              <span key={i} className="px-3 py-1 font-label-caps text-xs font-bold border-2 border-border text-ink bg-surface-low hover:border-coral transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Learning Path */}
      {hasLearningPath && (
        <section>
          <h4 className="flex items-center gap-2 mb-3 font-editorial text-lg text-ink">
            <span className="w-2 h-2 rounded-full bg-coral" />
            مسار التعلم المقترح
          </h4>
          <div className="flex flex-col gap-3">
            {(analysis.learningPath ?? [])
              .sort((a, b) => a.order - b.order)
              .map((step, i) => (
                <div key={i} className="flex gap-3 items-start p-3 border-2 border-border bg-paper hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all">
                  <div className="w-7 h-7 flex items-center justify-center bg-ink text-paper font-bold font-mono text-xs flex-shrink-0">
                    {step.order}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-caps font-bold text-sm text-ink">{step.skill}</span>
                      <span className="text-xs font-bold px-2 py-0.5 border-2 border-ink text-ink bg-transparent uppercase">
                        {step.estimatedTime}
                      </span>
                    </div>
                    <p className="text-sm text-ink/70 leading-relaxed m-0">{step.action}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {!hasCritical && !hasNiceToHave && !hasTransferable && !hasLearningPath && (
        <div className="p-8 text-center text-ink/60 font-label-caps text-sm bg-paper border-2 border-dotted border-border">
          <p>لم يتم العثور على فجوات — تطابق ممتاز!</p>
        </div>
      )}
    </div>
  );
}
