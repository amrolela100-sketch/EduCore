"use client";

import { CreateJobModal } from "@/components/create-job-modal";
import { useLanguage } from "@/components/language-context";
import { EditorialSection } from "@/components/ui/editorial-section";

export function HrHeaderSection() {
  const { language } = useLanguage();

  const title = language === "ar" ? "سجل التوظيف و" : "HR Audit";
  const emphasisWord = language === "ar" ? "التدقيق" : "Panel";

  const description =
    language === "ar"
      ? "مراجعة وتفتيش تقييمات المرشحين المتقدمين عبر وكلاء الذكاء الاصطناعي، وتسجيل المبررات الإدارية بأعلى معايير الحوكمة والشفافية."
      : "Review and inspect candidate evaluations submitted via AI agents, and record administrative justifications at the highest standards of governance and transparency.";

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
      <div className="flex-1">
        <EditorialSection
          index="01"
          title={title}
          emphasisWord={emphasisWord}
          className="mb-2"
        />
        <p className="font-body-sm text-ink/60 max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <div className="shrink-0">
        <CreateJobModal />
      </div>
    </div>
  );
}