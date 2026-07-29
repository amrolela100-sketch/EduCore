"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Fingerprint,
  BookOpen,
  Network,
  Lock,
  BrainCircuit,
  Layers,
  GitBranch,
} from "lucide-react";

interface WhyEduCoreProps {
  language: string;
}

interface DifferentiatorCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
  delay: number;
}

function DifferentiatorCard({ icon, title, description, highlight, delay }: DifferentiatorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative bg-paper p-6 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] hover:border-ink transition-all duration-300 group overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-border/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="w-14 h-14 bg-ink border-2 border-border flex items-center justify-center text-paper mb-6 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] group-hover:bg-coral group-hover:text-ink transition-all duration-300">
          {icon}
        </div>
        <div className="inline-flex px-3 py-1 bg-white border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] mb-4">
          <span className="font-label-caps text-[10px] font-bold text-ink uppercase tracking-wider">{highlight}</span>
        </div>
        <h3 className="font-editorial text-xl font-bold text-ink mb-3">{title}</h3>
        <p className="font-body-sm text-sm text-ink/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function ComparisonTable({ language }: WhyEduCoreProps) {
  const isArabic = language === "ar";

  const features = [
    { label: isArabic ? "تقييم تقني معزول" : "Sandboxed Technical Eval", educore: true, traditional: false },
    { label: isArabic ? "سجل تدقيق كامل" : "Full Audit Trail", educore: true, traditional: false },
    { label: isArabic ? "تقييم خالٍ من الانحياز" : "Bias-Free Assessment", educore: true, traditional: false },
    { label: isArabic ? "ذكاء اصطناعي تفسيري" : "Explainable AI", educore: true, traditional: false },
    { label: isArabic ? "توحيد معايير الصناعة" : "Industry Standardization", educore: true, traditional: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-paper border-2 border-border shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] overflow-hidden"
    >
      <div className="p-6 border-b-2 border-border bg-ink">
        <h3 className="font-editorial text-xl font-bold text-paper">{isArabic ? "EduCore vs التوظيف التقليدي" : "EduCore vs Traditional Hiring"}</h3>
      </div>
      <div className="p-6 bg-white">
        <div className="grid grid-cols-3 gap-4 mb-6 pb-4 border-b-2 border-border">
          <div className="font-label-caps text-[10px] font-bold text-ink/50 uppercase tracking-widest">Feature</div>
          <div className="font-label-caps text-[10px] font-bold text-coral uppercase tracking-widest text-center">EduCore</div>
          <div className="font-label-caps text-[10px] font-bold text-ink/50 uppercase tracking-widest text-center">
            {isArabic ? "التقييم التقليدي" : "Traditional"}
          </div>
        </div>
        {features.map((feature, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 py-4 border-b-2 border-dotted border-border last:border-b-0">
            <div className="font-body-sm text-sm font-bold text-ink/80">{feature.label}</div>
            <div className="flex justify-center">
              {feature.educore ? (
                <div className="w-8 h-8 bg-coral border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] flex items-center justify-center">
                  <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 bg-paper border-2 border-border flex items-center justify-center">
                  <svg className="w-4 h-4 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex justify-center">
              {feature.traditional ? (
                <div className="w-8 h-8 bg-coral border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] flex items-center justify-center">
                  <svg className="w-4 h-4 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 bg-paper border-2 border-border flex items-center justify-center">
                  <svg className="w-4 h-4 text-ink/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function WhyEduCore({ language }: WhyEduCoreProps) {
  const isArabic = language === "ar";

  const differentiators = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: isArabic ? "تقييم تقني معزول" : "Sandboxed Execution",
      description: isArabic
        ? "بيئة تشغيل معزولة تمنع الغش وتضمن نزاهة التقييم"
        : "Isolated execution environment prevents cheating and ensures assessment integrity",
      highlight: "100% Secure",
    },
    {
      icon: <Fingerprint className="w-6 h-6" />,
      title: isArabic ? "هوية مرشح فريدة" : "Unique Candidate Fingerprinting",
      description: isArabic
        ? "التحقق من الهوية يضمن أن المتقدم هو من يُجري التقييم فعلاً"
        : "Identity verification ensures the applicant is the one taking the assessment",
      highlight: "Anti-Fraud",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: isArabic ? "سجل تدقيق غير قابل للتغيير" : "Immutable Audit Ledger",
      description: isArabic
        ? "كل قرار توظيف موثق ومtimestamped ومmarshalized"
        : "Every hiring decision is documented, timestamped, and tamper-proof",
      highlight: "Compliant",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: isArabic ? "تحليل خوارزمي شفاف" : "Transparent Algorithmic Analysis",
      description: isArabic
        ? "لا نماذج سوداء - كل تقييم قابل للشرح والمراجعة البشرية"
        : "No black-box models - every evaluation is explainable and human-reviewable",
      highlight: "Explainable",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: isArabic ? "خصوصية البيانات" : "Data Privacy by Design",
      description: isArabic
        ? "تصميم مراعي للخصوصية يضمن الامتثال لـ GDPR و CCPA"
        : "Privacy-first design ensures GDPR and CCPA compliance",
      highlight: "SOC2 Ready",
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: isArabic ? "تحليل مهاري متقدم" : "Advanced Skill Analysis",
      description: isArabic
        ? "تحليل معرفي عميق يحدد القدرات التقنية الفعلية وليس فقط الإجابات الصحيحة"
        : "Deep knowledge analysis identifies actual technical capabilities not just correct answers",
      highlight: "AI-Powered",
    },
  ];

  const techAdvantages = [
    { icon: <Layers className="w-5 h-5" />, label: isArabic ? "قابل للتوسع عالمياً" : "Globally Scalable" },
    { icon: <GitBranch className="w-5 h-5" />, label: isArabic ? "تتكامل مع ATS الرائدة" : "Integrates with Leading ATS" },
    { icon: <BrainCircuit className="w-5 h-5" />, label: isArabic ? "ML مستمر التعلم" : "Continuous ML Learning" },
  ];

  return (
    <section className="py-20 sm:py-32 bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border mb-6 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] bg-white">
            <span className="font-label-caps text-[10px] font-bold text-ink uppercase tracking-wider">
              {isArabic ? "تميزات تنافسية" : "Competitive Differentiators"}
            </span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-ink tracking-tight mb-6">
            {isArabic ? "لماذا EduCore يتفوق" : "Why EduCore Wins"}
          </h2>
          <p className="font-body-sm text-ink/70 max-w-2xl mx-auto text-base">
            {isArabic
              ? "نظامنا مبني على تقنية ثورية تميزنا عن أي حل توظيف آخر في السوق"
              : "Our system is built on revolutionary technology that sets us apart from any other hiring solution on the market"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {differentiators.map((item, index) => (
            <DifferentiatorCard key={index} {...item} delay={index * 0.1} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComparisonTable language={language} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-ink border-2 border-border shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-8 text-paper"
          >
            <h3 className="font-editorial text-2xl font-bold mb-6">{isArabic ? "المميزات التقنية" : "Technical Advantages"}</h3>
            <div className="space-y-4 mb-8">
              {techAdvantages.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-white/5 border-2 border-border/20 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)]">
                  <div className="w-12 h-12 bg-coral border-2 border-border flex items-center justify-center text-ink shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
                    {item.icon}
                  </div>
                  <span className="font-label-caps text-xs font-bold uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="p-6 bg-coral border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
              <p className="font-body-sm text-sm text-ink font-bold leading-relaxed">
                {isArabic
                  ? "مبني على بنية تحتية قابلة للتوسع تدعم ملايين التقييمات شهرياً"
                  : "Built on infrastructure that scales to support millions of assessments per month"}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}