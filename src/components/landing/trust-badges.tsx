"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Lock, Award, CheckCircle, FileBadge } from "lucide-react";

interface TrustBadge {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
}

const trustBadges: TrustBadge[] = [
  { icon: <ShieldCheck className="w-6 h-6" />, label: "SOC 2 Type II", sublabel: "Certified" },
  { icon: <Lock className="w-6 h-6" />, label: "GDPR", sublabel: "Compliant" },
  { icon: <Award className="w-6 h-6" />, label: "ISO 27001", sublabel: "Certified" },
  { icon: <FileBadge className="w-6 h-6" />, label: "HIPAA", sublabel: "Ready" },
];

const companyLogos = [
  { name: "TechCorp", abbr: "TC" },
  { name: "InnovateTech", abbr: "IT" },
  { name: "DataFlow", abbr: "DF" },
  { name: "CloudBase", abbr: "CB" },
  { name: "NextGen", abbr: "NG" },
];

interface TrustBadgesProps {
  language: string;
}

export function TrustBadges({ language }: TrustBadgesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isArabic = language === "ar";

  return (
    <section ref={ref} className="py-16 bg-paper border-t-2 border-border font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-ink">
            {isArabic ? "ثقة وأمان على مستوى المؤسسات" : "Enterprise-Grade Security & Trust"}
          </h3>
          <p className="font-body-sm text-sm text-ink/70">
            {isArabic
              ? "نلتزم بأعلى معايير الأمان والخصوصية العالمية"
              : "Trusted by leading companies worldwide with top compliance standards"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {trustBadges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
              className="group flex flex-col items-center gap-3 p-6 bg-paper border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:border-ink transition-all duration-300"
            >
              <div className="p-4 bg-paper border-2 border-ink text-ink group-hover:bg-ink group-hover:text-paper transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
                {badge.icon}
              </div>
              <div className="text-center">
                <span className="block font-label-caps font-bold text-sm text-ink">{badge.label}</span>
                {badge.sublabel && (
                  <span className="block text-[10px] text-ink/60 font-mono uppercase mt-1 border-t-2 border-dotted border-border pt-1">{badge.sublabel}</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <p className="text-center font-label-caps text-xs text-ink/60 uppercase">
            {isArabic ? "موثوق من قبل فرق الهندسة في" : "Trusted by engineering teams at"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {companyLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.8 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors"
              >
                <span className="flex items-center justify-center w-10 h-10 border-2 border-border font-editorial font-bold text-lg bg-paper shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
                  {logo.abbr}
                </span>
                <span className="text-sm font-label-caps font-bold hidden sm:block">{logo.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t-2 border-dotted border-border"
        >
          <div className="flex items-center gap-2 text-xs font-label-caps text-ink/70">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "تشفير 256-bit" : "256-bit Encryption"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-label-caps text-ink/70">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "سجلات تدقيق كاملة" : "Full Audit Logs"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-label-caps text-ink/70">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "النسخ الاحتياطي اليومي" : "Daily Backups"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-label-caps text-ink/70">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>{isArabic ? "99.9% وقت التشغيل" : "99.9% Uptime SLA"}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}