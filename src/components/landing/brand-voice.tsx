"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface BrandFeature {
  icon: React.ReactNode;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  color: string;
}

interface BrandShowcaseProps {
  language: "en" | "ar";
}

const brandFeatures: BrandFeature[] = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M16 2v28M4 8l12 6 12-6M4 24l12-6 12 6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Progressive Trust",
    titleAr: "الثقة المتدرجة",
    description: "Credentials grow with verification depth. Early trust is earned through identity checks, not assumed.",
    descriptionAr: "تنمو الاعتمادات مع عمق التحقق. الثقة المبكرة تُكتسب من خلال التحقق من الهوية، وليست مفترضة.",
    color: "emaerald",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M4 12h24M8 6v6M24 6v6" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="20" r="3" stroke="currentColor" strokeWidth="2" />
        <path d="M16 17v-2M16 23v2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Human-in-the-Loop",
    titleAr: "الإنسان في الحلقة",
    description: "Every AI decision traces back to human oversight. Final rankings require auditor sign-off.",
    descriptionAr: "كل قرار ذكاء اصطناعي يتتبع إلى إشراف بشري. الترتيبات النهائية تتطلب توقيع المدقق.",
    color: "amber",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <path d="M6 26l4-8 6 4 4-10 6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="18" r="2" fill="currentColor" />
        <circle cx="16" cy="22" r="2" fill="currentColor" />
        <circle cx="20" cy="12" r="2" fill="currentColor" />
        <circle cx="26" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Ranked Placement",
    titleAr: "الترتيب الوظيفي",
    description: "Candidates are scored on verified competencies, not keyword matching. Rankings are auditable and explainable.",
    descriptionAr: "يُقيّم المرشحون على أساس الكفاءات المحققة، وليس مطابقة الكلمات المفتاحية. الترتيبات قابلة للتدقيق والشرح.",
    color: "violet",
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
        <path d="M16 8v8l5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Time-Bound Process",
    titleAr: "عملية محددة الوقت",
    description: "Every stage has SLA deadlines. Delays trigger escalation. Results are time-stamped and immutable.",
    descriptionAr: "كل مرحلة لها مواعيد نهائية. التأخيرات تؤدي إلى التصعيد. النتائج مؤقتة وغير قابلة للتغيير.",
    color: "sky",
  },
];



const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1, 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] 
    },
  }),
};

export function BrandShowcase({ language }: BrandShowcaseProps) {

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden bg-paper border-t-2 border-border">
      <div className="absolute inset-0 animated-gradient-mesh opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border mb-4 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] bg-paper"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 bg-coral border border-ink" />
            <span className="font-label-caps text-xs font-bold text-ink uppercase tracking-wider">
               {language === "en" ? "Brand Identity" : "الهوية التجارية"}
            </span>
          </motion.div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            {language === "en" ? "Why EduCore?" : "لماذا EduCore؟"}
          </h2>
          <p className="font-body-sm text-ink/70 max-w-2xl mx-auto text-base">
            {language === "en" 
              ? "A hiring pipeline built on verifiable trust, transparent rankings, and accountable automation."
              : "خط توظيف مبني على الثقة القابلة للتحقق، الترتيبات الشفافة، والأتمتة المسؤولة."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brandFeatures.map((feature, idx) => {
            return (
              <motion.div
                key={feature.title}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`relative p-8 bg-paper border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:border-ink cursor-pointer`}
              >
                <motion.div 
                  className={`w-16 h-16 bg-ink border-2 border-border flex items-center justify-center mb-6 text-paper shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-transform group-hover:-translate-y-1`}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="font-editorial text-2xl font-bold text-ink tracking-tight mb-3">
                  {language === "en" ? feature.title : feature.titleAr}
                </h3>
                <p className="font-body-sm text-ink/70 leading-relaxed border-t-2 border-dotted border-border pt-4">
                  {language === "en" ? feature.description : feature.descriptionAr}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-4 p-4 border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] bg-paper">
            <span className="font-label-caps font-bold text-sm text-ink uppercase tracking-wider">
              {language === "en" ? "Trusted by leading educational institutions" : "موثوق من المؤسسات التعليمية الرائدة"}
            </span>
            <div className="flex -space-x-3 ml-2 border-l-2 border-border pl-4">
              {["A", "B", "C"].map((letter, i) => (
                <div 
                  key={i} 
                  className="w-10 h-10 bg-ink border-2 border-border flex items-center justify-center text-paper font-editorial font-bold text-lg shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] z-10"
                  style={{ zIndex: 3 - i }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}