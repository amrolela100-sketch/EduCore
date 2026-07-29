"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck,
  TrendingUp,
  Check,
} from "lucide-react";

import Image from "next/image";

interface PipelineStage {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  img: string;
  badge: string;
  stat: string;
}

interface LandingPipelineProps {
  stages: PipelineStage[];
  language: string;
}

const stageIcons: Record<string, React.ReactNode> = {
  "01": <ShieldCheck className="w-4 h-4" />,
  "02": <Cpu className="w-4 h-4" />,
  "03": <Layers className="w-4 h-4" />,
  "04": <FileCheck className="w-4 h-4" />,
  "05": <TrendingUp className="w-4 h-4" />,
};

export function LandingPipeline({ stages, language }: LandingPipelineProps) {
  const [activeStage, setActiveStage] = useState(0);
  const [completedStages, setCompletedStages] = useState<Set<number>>(
    new Set()
  );
  const [showConnector, setShowConnector] = useState(false);
  const current = stages[activeStage] || stages[0];

  useEffect(() => {
    if (activeStage > 0 && !completedStages.has(activeStage - 1)) {
      setCompletedStages((prev) => new Set([...prev, activeStage - 1]));
    }
  }, [activeStage, completedStages]);

  useEffect(() => {
    setShowConnector(false);
    const timer = setTimeout(() => setShowConnector(true), 100);
    return () => clearTimeout(timer);
  }, [activeStage]);

  const handleStageClick = (idx: number) => {
    if (idx <= activeStage + 1) {
      setActiveStage(idx);
    }
  };

  const isArabic = language === "ar";

  return (
    <section
      data-od-id="landing-pipeline"
      className="relative py-16 sm:py-24 overflow-hidden"
    >
      {/* ── Paper surface background ── */}
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0 pattern-dots opacity-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* ── Section header ── */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 font-label-caps text-paper border border-paper/20">
            {isArabic ? "الخطوات" : "Pipeline"}
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl text-paper max-w-3xl mx-auto">
            {isArabic
              ? "خطوات خط التوظيف الذكي Auditable Pipeline"
              : "Auditable Autonomous Hiring Pipeline"}
          </h2>
          <p className="font-body-lg text-paper/70 max-w-xl mx-auto mt-4">
            {isArabic
              ? "رحلة المرشح من القراءة الهيكلية حتى الترتيب والتدقيق البشري"
              : "Candidate journey from structured parsing to audit-ready placement"}
          </p>
        </div>

        {/* ── Stage tabs / connectors ── */}
        <div className="relative">
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-3 text-xs scrollbar-thin scrollbar-thumb-verified scrollbar-track-transparent">
            {stages.map((st, idx) => {
              const isCompleted = completedStages.has(idx);
              const isActive = activeStage === idx;
              const isAccessible = idx <= activeStage + 1;

              return (
                <React.Fragment key={st.id}>
                  <button
                    onClick={() => handleStageClick(idx)}
                    disabled={!isAccessible}
                    className={`relative px-5 py-3 font-label-caps transition-all duration-300 border-2 shrink-0 ${
                      isActive
                        ? "bg-coral text-paper border-coral"
                        : isCompleted
                        ? "bg-coral/10 text-coral border-coral/30"
                        : isAccessible
                        ? "bg-transparent text-paper/60 border-paper/20 hover:border-paper hover:text-paper cursor-pointer"
                        : "bg-transparent text-paper/20 border-paper/10 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <span className="opacity-60 mr-1">{st.id}</span>
                      )}
                      <span>{st.subtitle}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeStageIndicator"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-paper"
                      />
                    )}
                  </button>

                  {idx < stages.length - 1 && (
                    <div
                      className={`relative w-6 md:w-8 h-px shrink-0 transition-all duration-500 ${
                        showConnector && idx < activeStage
                          ? "bg-coral"
                          : "bg-paper/20"
                      }`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-coral"
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{
                          scaleX:
                            showConnector && idx < activeStage ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      />
                      {showConnector && idx < activeStage && (
                        <motion.div
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-coral"
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Active stage card (Editorial Dark) ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="border-2 border-paper/20 bg-ink p-8 grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            {/* Text column */}
            <div className="md:col-span-7 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 font-label-caps bg-coral text-paper border border-coral"
                >
                  {stageIcons[current.id]} {current.badge}
                </motion.span>
                <h3 className="font-editorial text-3xl sm:text-4xl text-paper">
                  {current.title}
                </h3>
                <p className="font-body-lg text-paper/70 max-w-prose">
                  {current.desc}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between p-4 border-2 border-paper/20 font-label-caps text-coral"
              >
                <span className="text-white/40">
                  {language === "ar"
                    ? "المؤشر المباشر:"
                    : "Live Indicator:"}
                </span>
                <span>{current.stat}</span>
              </motion.div>
            </div>

            {/* Image column */}
            <motion.div
              className="md:col-span-5 relative border-2 border-paper/20 group overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <Image
                src={current.img}
                alt={current.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-ink/30 transition-all duration-700 group-hover:bg-ink/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 font-label-caps bg-paper text-ink">
                  {stageIcons[current.id]}
                  <span>Stage {current.id}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── Dot pagination ── */}
        <div className="flex justify-center gap-2 pt-2">
          {stages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`h-1.5 rounded-none transition-all duration-300 ${
                activeStage === idx
                  ? "w-8 bg-coral"
                  : completedStages.has(idx)
                  ? "w-3 bg-coral/50"
                  : "w-3 bg-paper/20 hover:bg-paper/40"
              }`}
              aria-label={`Go to stage ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
