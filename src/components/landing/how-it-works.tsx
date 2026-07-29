"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, FileCode, BrainCircuit, Users, CheckCircle, ArrowRight } from "lucide-react";

interface Step {
  number: string;
  icon: React.ReactNode;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: <Search className="w-7 h-7" />,
    titleAr: "إنشاء الوظيفة والمعايير",
    titleEn: "Create Job & Criteria",
    descriptionAr: "حدد متطلبات الوظيفة والمهارات التقنية المطلوبة ونظام التقييم المناسب",
    descriptionEn: "Define job requirements, technical skills needed, and the appropriate evaluation system",
  },
  {
    number: "02",
    icon: <FileCode className="w-7 h-7" />,
    titleAr: "إرسال دعوة التقييم",
    titleEn: "Send Assessment Invite",
    descriptionAr: "يتم إرسال رابط التقييم الآمن للمرشحين مع تعليمات واضحة ومهلة زمنية",
    descriptionEn: "A secure assessment link is sent to candidates with clear instructions and time limit",
  },
  {
    number: "03",
    icon: <BrainCircuit className="w-7 h-7" />,
    titleAr: "تنفيذ التقييم المعزول",
    titleEn: "Isolated Assessment Execution",
    descriptionAr: "المرشحون يؤدون التقييم في بيئة معزولة تمنع الغش وتضمن نزاهة النتائج",
    descriptionEn: "Candidates perform the assessment in an isolated environment that prevents cheating and ensures result integrity",
  },
  {
    number: "04",
    icon: <Users className="w-7 h-7" />,
    titleAr: "مراجعة النتائج والتوصيات",
    titleEn: "Review Results & Recommendations",
    descriptionAr: "احصل على تقرير شامل مع توصيات مدعومة بالذكاء الاصطناعي وتفسير كل نتيجة",
    descriptionEn: "Get a comprehensive report with AI-powered recommendations and explanations for each result",
  },
];

interface HowItWorksProps {
  language: string;
}

function StepCard({ step, index, isArabic }: { step: Step; index: number; isArabic: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative flex flex-1"
    >
      <div className="flex flex-col items-center text-center group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative z-10 w-24 h-24 bg-paper border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper group-hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
        >
          {step.icon}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-coral border-2 border-border flex items-center justify-center font-label-caps text-[10px] font-bold text-ink shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
            {step.number}
          </div>
        </motion.div>
        <h3 className="mt-8 font-editorial text-xl sm:text-2xl font-bold text-ink tracking-tight">
          {isArabic ? step.titleAr : step.titleEn}
        </h3>
        <p className="mt-3 font-body-sm text-sm text-ink/70 max-w-[200px] leading-relaxed">
          {isArabic ? step.descriptionAr : step.descriptionEn}
        </p>
      </div>
      {index < steps.length - 1 && (
        <div className="absolute top-12 left-[50%] w-[calc(100%-3rem)] h-[2px] bg-border hidden lg:block">
          <motion.div
            className="absolute inset-y-0 left-0 bg-coral h-[2px]"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function HowItWorks({ language }: HowItWorksProps) {
  const isArabic = language === "ar";

  return (
    <section className="py-20 sm:py-32 bg-paper border-y-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border mb-6 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] bg-white">
            <span className="font-label-caps text-[10px] font-bold text-ink uppercase tracking-wider">
              {isArabic ? "العملية" : "The Process"}
            </span>
          </div>
          <h2 className="font-editorial text-4xl sm:text-5xl font-bold text-ink tracking-tight mb-6">
            {isArabic ? "كيف يعمل EduCore" : "How EduCore Works"}
          </h2>
          <p className="font-body-sm text-ink/70 text-base max-w-2xl mx-auto">
            {isArabic
              ? "أربع خطوات بسيطة من إنشاء التقييم إلى اتخاذ قرار التوظيف النهائي"
              : "Four simple steps from creating an assessment to making the final hiring decision"}
          </p>
        </motion.div>

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-4">
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} index={index} isArabic={isArabic} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center gap-3 px-6 py-4 bg-ink border-2 border-border text-paper shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
            <CheckCircle className="w-5 h-5 text-coral" />
            <span className="font-label-caps text-xs font-bold uppercase tracking-wider">
              {isArabic ? "نتائج موثوقة في أقل من 48 ساعة" : "Trusted results in under 48 hours"}
            </span>
          </div>
          <button className="group flex items-center gap-2 px-6 py-4 bg-coral border-2 border-border shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(20,20,20,1)] hover:bg-coral-dark transition-all duration-300">
            <span className="font-label-caps text-xs font-bold text-ink uppercase tracking-wider">
              {isArabic ? "ابدأ مجاناً" : "Start Free"}
            </span>
            <motion.span
              className="text-ink"
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}