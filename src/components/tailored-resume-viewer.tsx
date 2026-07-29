"use client";

/**
 * TailoredResumeViewer — Side-by-side comparison of original vs tailored CV
 * 
 * Allows candidates to view their original resume alongside the AI-tailored
 * version that highlights skills and re-orders experience for a specific job.
 */

import { useState } from "react";

interface TailoredResumeViewerProps {
  originalText: string;
  tailoredContent: string;
  highlightedSkills: string[];
  matchPercentage?: number | null;
  jobTitle: string;
}

export function TailoredResumeViewer({
  originalText,
  tailoredContent,
  highlightedSkills,
  matchPercentage,
  jobTitle,
}: TailoredResumeViewerProps) {
  const [activeTab, setActiveTab] = useState<"tailored" | "original" | "split">("split");

  return (
    <div className="flex flex-col gap-5 p-6 bg-paper border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] font-sans">
      {/* Header */}
      <div className="flex justify-between items-start gap-4 border-b-2 border-dotted border-border pb-4">
        <div>
          <h3 className="font-editorial text-2xl text-ink m-0">السيرة الذاتية المُخصصة لوظيفة: {jobTitle}</h3>
          <p className="font-label-caps text-sm text-ink/60 mt-2">
            تم إعادة ترتيب وتسليط الضوء على مهاراتك المطابقة بدون تغيير أي حقائق.
          </p>
        </div>
        {matchPercentage !== undefined && matchPercentage !== null && (
          <div className="flex flex-col items-center p-3 bg-surface-low border-2 border-border">
            <span className="text-2xl font-bold font-mono text-coral">{Math.round(matchPercentage)}%</span>
            <span className="text-[10px] font-label-caps uppercase text-ink/70">نسبة المطابقة</span>
          </div>
        )}
      </div>

      {/* Highlighted Skills Chips */}
      {highlightedSkills.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-label-caps text-sm font-bold text-ink">المهارات المبرزة:</span>
          <div className="flex flex-wrap gap-2">
            {highlightedSkills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-surface-low border-2 border-border text-ink font-label-caps text-xs font-bold uppercase">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View Mode Toggle */}
      <div className="flex flex-wrap gap-2 p-1 bg-surface-low border-2 border-border w-fit">
        <button
          className={`px-4 py-2 font-label-caps text-xs font-bold transition-all border-2 ${
            activeTab === "split" 
              ? "bg-ink text-paper border-ink" 
              : "bg-transparent text-ink/70 border-transparent hover:text-ink hover:border-ink/20"
          }`}
          onClick={() => setActiveTab("split")}
        >
          عرض مقارن
        </button>
        <button
          className={`px-4 py-2 font-label-caps text-xs font-bold transition-all border-2 ${
            activeTab === "tailored" 
              ? "bg-ink text-paper border-ink" 
              : "bg-transparent text-ink/70 border-transparent hover:text-ink hover:border-ink/20"
          }`}
          onClick={() => setActiveTab("tailored")}
        >
          المُخصصة فقط
        </button>
        <button
          className={`px-4 py-2 font-label-caps text-xs font-bold transition-all border-2 ${
            activeTab === "original" 
              ? "bg-ink text-paper border-ink" 
              : "bg-transparent text-ink/70 border-transparent hover:text-ink hover:border-ink/20"
          }`}
          onClick={() => setActiveTab("original")}
        >
          الأصلية فقط
        </button>
      </div>

      {/* Content Panes */}
      <div className={`grid gap-4 ${activeTab === "split" ? "md:grid-cols-2 grid-cols-1" : "grid-cols-1"}`}>
        {(activeTab === "split" || activeTab === "original") && (
          <div className="p-4 bg-surface-low border-2 border-border shadow-sm h-full flex flex-col">
            <h4 className="font-editorial text-lg text-ink mb-3 pb-2 border-b-2 border-dotted border-border">السيرة الذاتية الأصلية</h4>
            <div className="flex-1 overflow-y-auto max-h-[500px]">
              <pre className="font-mono text-sm leading-relaxed text-ink/80 whitespace-pre-wrap m-0 font-medium">
                {originalText}
              </pre>
            </div>
          </div>
        )}

        {(activeTab === "split" || activeTab === "tailored") && (
          <div className="p-4 bg-surface-low border-2 border-coral/50 shadow-sm h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-coral"></div>
            <h4 className="font-editorial text-lg text-coral mb-3 pb-2 border-b-2 border-dotted border-coral/30">السيرة الذاتية المُخصصة ✨</h4>
            <div className="flex-1 overflow-y-auto max-h-[500px] pr-2">
              <pre className="font-mono text-sm leading-relaxed text-ink whitespace-pre-wrap m-0 font-medium">
                {tailoredContent}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
