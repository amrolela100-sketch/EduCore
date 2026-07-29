"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
}

const faqData: FAQItem[] = [
  {
    questionAr: "كيف يضمن EduCore نزاهة التقييمات؟",
    questionEn: "How does EduCore ensure assessment integrity?",
    answerAr: "نستخدم بيئات تنفيذ معزولة (Sandboxed Environments) تمنع الغش، مع نظام بصمة رقمية للمرشحين يتحقق من هويتهم أثناء التقييم. كل حركة keystroke يتم تحليلها لضمان أن الشخص نفسه هو من يجري التقييم.",
    answerEn: "We use sandboxed execution environments that prevent cheating, combined with candidate digital fingerprinting that verifies identity during assessment. Every keystroke movement is analyzed to ensure the same person is taking the test throughout.",
  },
  {
    questionAr: "هل يمكنني تخصيص التقييمات حسب احتياجات شركتي؟",
    questionEn: "Can I customize assessments to my company's needs?",
    answerAr: "نعم، EduCore يوفر محرك تخصيص مرن يسمح لك بإنشاء تقييمات مخصصة تقيس المهارات المحددة التي تحتاجها. يمكنك اختيار لغات البرمجة، ومستوى الصعوبة، وأنواع المشكلات، ومعايير النجاح.",
    answerEn: "Yes, EduCore provides a flexible customization engine that lets you create assessments measuring the exact skills you need. You can select programming languages, difficulty levels, problem types, and success criteria.",
  },
  {
    questionAr: "ما الجديد في الذكاء الاصطناعي التفسيري؟",
    questionEn: "What makes your Explainable AI different?",
    answerAr: "تقنياتنا لا تستخدم نماذج سوداء. كل تقييم يُنتج تقريرا تفصيليا يشرح بالضبط لماذا تم تقييم المرشح بهذه الدرجة. يمكنك مراجعة كل معيار، ورؤية الأمثلة، وحتى الاعتراض على أي تقييم.",
    answerEn: "Our technology doesn't use black-box models. Every assessment produces a detailed report explaining exactly why a candidate was rated that way. You can review each criterion, see examples, and even contest any evaluation.",
  },
  {
    questionAr: "كيف يتكامل EduCore مع نظام ATS الحالي؟",
    questionEn: "How does EduCore integrate with my existing ATS?",
    answerAr: "نوفر تكامل API شامل مع معظم أنظمة ATS الرائدة مثل Greenhouse و Lever و Workday. يمكنك استيراد المرشحين مباشرة، ومزامنة النتائج، وارسال التقييمات تلقائيا ضمن سير عملك الحالي.",
    answerEn: "We provide comprehensive API integration with most leading ATS systems like Greenhouse, Lever, and Workday. You can import candidates directly, sync results, and trigger assessments automatically within your existing workflow.",
  },
  {
    questionAr: "ما تكلفة EduCore وهل هناك تجربة مجانية؟",
    questionEn: "What is EduCore's pricing and is there a free trial?",
    answerAr: "نقدم خطط مرنة تناسب الشركات الناشئة والمؤسسات الكبيرة. يمكنك البدء بتجربة مجانية لمدة 14 يوماً تشمل جميع الميزات المتقدمة، أو اختيار الخطة المجانية المحدودة التي تلبي احتياجات الفرق الصغيرة.",
    answerEn: "We offer flexible plans suited for startups and large enterprises. You can start with a 14-day free trial including all advanced features, or choose the limited free plan that meets small team needs.",
  },
  {
    questionAr: "كيف يحمي EduCore بيانات المرشحين؟",
    questionEn: "How does EduCore protect candidate data?",
    answerAr: "EduCore ملتزم بأعلى معايير الخصوصية包括 GDPR و CCPA. البيانات مشفرة اثناء النقل والتخزين، ونحتفظ بسجل تدقيق غير قابل للتغيير لكل عملية. المرشحون يمكنهم طلب حذف بياناتهم في أي وقت.",
    answerEn: "EduCore is committed to the highest privacy standards including GDPR and CCPA. Data is encrypted in transit and at rest, and we maintain an immutable audit trail for every operation. Candidates can request data deletion at any time.",
  },
];

interface FAQSectionProps {
  language: string;
}

function FAQItem({ item, isOpen, onToggle, isArabic }: { item: FAQItem; isOpen: boolean; onToggle: () => void; isArabic: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border-2 border-border bg-paper shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:border-ink transition-all cursor-pointer"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-justify gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-label-caps font-bold text-sm sm:text-base text-ink text-start uppercase">
          {isArabic ? item.questionAr : item.questionEn}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 p-2 border-2 border-transparent hover:border-border transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-coral" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
              <p className="font-body-sm text-sm text-ink/70 leading-relaxed border-t-2 border-dotted border-border pt-4">
                {isArabic ? item.answerAr : item.answerEn}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection({ language }: FAQSectionProps) {
  const isArabic = language === "ar";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: isArabic ? item.questionAr : item.questionEn,
      acceptedAnswer: {
        "@type": "Answer",
        text: isArabic ? item.answerAr : item.answerEn,
      },
    })),
  };

  return (
    <section className="py-16 sm:py-24 bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border mb-4 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] bg-paper">
            <HelpCircle className="w-4 h-4 text-coral" />
            <span className="font-label-caps text-xs font-bold text-ink uppercase tracking-wider">
              {isArabic ? "الأسئلة الشائعة" : "FAQ"}
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            {isArabic ? "أسئلة متكررة" : "Frequently Asked Questions"}
          </h2>
          <p className="font-body-sm text-ink/70 text-base max-w-2xl mx-auto">
            {isArabic
              ? "إجابات على أكثر الأسئلة شيوعاً حول منصة EduCore"
              : "Answers to the most common questions about the EduCore platform"}
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              isArabic={isArabic}
            />
          ))}
        </div>
      </div>
    </section>
  );
}