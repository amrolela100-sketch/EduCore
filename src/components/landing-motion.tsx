"use client";

import React from "react";
import { useLanguage } from "@/components/language-context";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingPipeline } from "@/components/landing/landing-pipeline";
import { LandingJobsGrid, JobPostingItem } from "@/components/landing/landing-jobs-grid";
import { BrandShowcase } from "@/components/landing/brand-voice";
import { TrustBadges } from "@/components/landing/trust-badges";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQSection } from "@/components/landing/faq-section";
import { MetricsTicker } from "@/components/landing/metrics-ticker";
import { TrustConnection } from "@/components/landing/trust-connection";
import { InvestorSection } from "@/components/landing/investor-section";
import { InvestorDashboard } from "@/components/landing/investor-dashboard";
import { EngagementPopup } from "@/components/landing/engagement-popup";
import { ScrollProgressBar, ScrollIndicator } from "@/components/landing/scroll-indicator";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AppFooter } from "@/components/app-footer";

interface LandingMotionProps {
  initialJobPostings: JobPostingItem[];
}

export function LandingMotion({ initialJobPostings = [] }: LandingMotionProps) {
  const { t, language } = useLanguage();

  const pipelineStages = [
    {
      id: "01",
      title: language === "ar" ? "تحليل الملفات والتأكد الهيكلي" : "Profile Parse & Verification",
      subtitle: language === "ar" ? "استخراج البيانات الفنية" : "Structured Extraction",
      desc: language === "ar"
        ? "استخراج قياسات المهارات الصلبة والخبرات القابلة للتحقق من أصل سيرتك الذاتية دون هلوسة أو تزييف."
        : "Extracts hard skill telemetry, verifiable experience, and code metrics from raw candidate profiles with zero hallucinations.",
      img: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80",
      badge: language === "ar" ? "تحليل مباشر OCR & Parsing" : "Real-time OCR & Parsing",
      stat: language === "ar" ? "محتوى موثق 100%" : "100% Parsed Schema",
    },
    {
      id: "02",
      title: language === "ar" ? "المحاذاة التناظرية للمهارات" : "Semantic Skill Alignment",
      subtitle: language === "ar" ? "المطابقة السياقية" : "Contextual Matching",
      desc: language === "ar"
        ? "مطابقة سياقية عميقة تربط المتقدم بمتطلبات الوظيفة بناءً على السجل الحقيقي والإنجاز الفعلي بدلاً من الكلمات الرنانة."
        : "Deep semantic alignment matches candidates to position requirements based on proven track records rather than buzzword density.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      badge: language === "ar" ? "مصفوفة التناظر الموجه" : "Vector Alignment Matrix",
      stat: language === "ar" ? "دقة مطابقة 99.4%" : "99.4% Match Accuracy",
    },
    {
      id: "03",
      title: language === "ar" ? "اختبار برمجي في بيئة معزولة Sandbox" : "Sandboxed Technical Interview",
      subtitle: language === "ar" ? "تقييم موضوعي نقي" : "Objective Assessment",
      desc: language === "ar"
        ? "يكمل المرشحون سيناريوهات برمجة من العالم الحقيقي داخل بيئات معزولة محصنة مع تسجيل كامل لنتائج الأكواد."
        : "Candidates complete real-world problem scenarios in isolated sandboxes with full telemetry recording for HR review.",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
      badge: language === "ar" ? "بيئة تنفيذ محصنة Sandbox" : "Deterministic Code Sandbox",
      stat: language === "ar" ? "تسجيل فوري مباشر" : "Live Telemetry",
    },
    {
      id: "04",
      title: language === "ar" ? "تقييمات جاهزة للتدقيق والتفتيش" : "Audit-Ready Evaluations",
      subtitle: language === "ar" ? "مراجعة بشرية كاملة" : "Human Verifiable",
      desc: language === "ar"
        ? "تولد كل درجة تقييم سجلاً منطقياً مبرراً بخطوات دقيقة يمكن لمدراء التوظيف مراجعتها وتعديلها بسهولة."
        : "Every evaluation score generates a step-by-step mathematical reasoning log that HR managers can inspect, audit, or override.",
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      badge: language === "ar" ? "سجلات تدقيق شفافة" : "Transparent Audit Logs",
      stat: language === "ar" ? "صفر انحياز أو خوارزميات مظلمة" : "Zero Black-Box Bias",
    },
  ];

  return (
    <div className="bg-paper min-h-screen flex flex-col font-sans text-ink">
      <ScrollProgressBar />
      
      <LandingHero language={language} />
      
      <ScrollReveal>
        <MetricsTicker language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <LandingPipeline stages={pipelineStages} language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <BrandShowcase language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <TrustConnection language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <TrustBadges language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <LandingJobsGrid initialJobPostings={initialJobPostings} language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <InvestorSection language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <InvestorDashboard language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials language={language} />
      </ScrollReveal>

      <ScrollReveal>
        <FAQSection language={language} />
      </ScrollReveal>

      <EngagementPopup />
      <ScrollIndicator text={language === "ar" ? "اكتشف المزيد" : "Scroll to explore"} />
      
      <AppFooter variant="dark" />
    </div>
  );
}
