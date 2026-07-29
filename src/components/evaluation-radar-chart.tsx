"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  EVALUATION_AXES,
  type EvaluationAxis,
  getScoreColor,
} from "@/lib/evaluation-rubric";

interface EvaluationRadarChartProps {
  scores: {
    profileMatchScore: number;
    growthScore: number;
    compensationScore: number;
    cultureFitScore: number;
    roleClarityScore: number;
    redFlagScore: number;
  };
  overallScore: number;
  summary?: string;
  strengths?: string[];
  gaps?: string[];
}

const AXES_ORDER: EvaluationAxis[] = ["A", "B", "C", "D", "E", "F"];

export function EvaluationRadarChart({
  scores,
  overallScore,
  summary,
}: EvaluationRadarChartProps) {
  const safeScores = useMemo(() => scores ?? {
    profileMatchScore: 0,
    growthScore: 0,
    compensationScore: 0,
    cultureFitScore: 0,
    roleClarityScore: 0,
    redFlagScore: 0,
  }, [scores]);

  const scoreMap: Record<EvaluationAxis, number> = useMemo(() => ({
    A: safeScores.profileMatchScore || 0,
    B: safeScores.growthScore || 0,
    C: safeScores.compensationScore || 0,
    D: safeScores.cultureFitScore || 0,
    E: safeScores.roleClarityScore || 0,
    F: safeScores.redFlagScore || 0,
  }), [safeScores]);

  const radarPoints = useMemo(() => {
    const cx = 150, cy = 150, maxR = 110;
    return AXES_ORDER.map((axis, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const r = (scoreMap[axis] / 5) * maxR;
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");
  }, [scoreMap]);

  const gridCircles = [1, 2, 3, 4, 5];

  return (
    <div className="bg-paper border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] p-6 space-y-6 font-sans">
      {/* Header & Overall Score */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-dotted border-border">
        <div>
          <h3 className="font-editorial text-xl text-ink">مصفوفة التناظر ومستوى المطابقة التقييمية</h3>
          <p className="text-sm text-ink/60 mt-1 font-label-caps">تحليل 6 محاور موضوعية للقدرات الفنية وتوافق الدور</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-low border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
          <span className="font-label-caps text-xs text-ink/60 uppercase">النتيجة:</span>
          <span className="font-mono font-bold text-lg" style={{ color: getScoreColor(overallScore || 0) }}>
            {(overallScore || 0).toFixed(1)} / 5.0
          </span>
        </div>
      </div>

      {/* SVG Motion Radar */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-64 h-64 mx-auto flex-shrink-0">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* Grid Circles */}
            {gridCircles.map((level) => (
              <circle
                key={level}
                cx={150}
                cy={150}
                r={(level / 5) * 110}
                fill="none"
                stroke="rgba(24, 23, 22, 0.15)"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            ))}

            {/* Axis Lines */}
            {AXES_ORDER.map((_, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
              const x2 = 150 + 110 * Math.cos(angle);
              const y2 = 150 + 110 * Math.sin(angle);
              return <line key={i} x1={150} y1={150} x2={x2} y2={y2} stroke="rgba(24, 23, 22, 0.15)" strokeWidth={2} strokeDasharray="2 2" />;
            })}

            {/* Animated Motion Radar Area */}
            <motion.polygon
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.35, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              points={radarPoints}
              fill="#E03E00"
              stroke="#E03E00"
              strokeWidth={3}
            />

            {/* Axis Point Indicators */}
            {AXES_ORDER.map((axis, i) => {
              const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
              const r = (scoreMap[axis] / 5) * 110;
              const cx = 150 + r * Math.cos(angle);
              const cy = 150 + r * Math.sin(angle);

              return (
                <motion.circle
                  key={axis}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  cx={cx}
                  cy={cy}
                  r={5}
                  fill="#E03E00"
                  stroke="#F9F8F6"
                  strokeWidth={2}
                />
              );
            })}
          </svg>
        </div>

        {/* Breakdown Axis List */}
        <div className="grid grid-cols-2 gap-3 w-full text-xs">
          {AXES_ORDER.map((axis) => {
            const info = EVALUATION_AXES[axis];
            const val = scoreMap[axis] || 0;
            return (
              <div key={axis} className="p-3 bg-surface-low border-2 border-border space-y-2 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all">
                <div className="flex items-center justify-between text-ink font-label-caps">
                  <span className="font-bold">{info?.labelAr || axis}</span>
                  <span className="font-mono font-bold text-coral">{val.toFixed(1)}</span>
                </div>
                <div className="w-full bg-ink/10 h-2 border border-ink/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(val / 5) * 100}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-coral h-full border-r border-ink/20"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-4 bg-surface-low border-2 border-dotted border-border text-sm text-ink/80 leading-relaxed font-sans">
          <span className="font-bold font-label-caps text-ink block mb-2">الخلاصة التقييمية للذكاء الاصطناعي:</span>
          {summary}
        </div>
      )}
    </div>
  );
}
