"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { UserCheck, Cpu, Clock, FileText } from "lucide-react";
import { PulseBadge, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

export interface AuditTimelineEvent {
  id: string;
  timestamp: string;
  type: "AI_EVALUATION" | "HR_OVERRIDE" | "APPLICATION_SUBMITTED" | "TECHNICAL_SANDBOX";
  actor: string;
  title: string;
  description: string;
  status: "ACCEPTED" | "REJECTED" | "PENDING" | "REVIEWED";
  score?: number;
  reasoning?: string;
}

interface HRAuditTimelineProps {
  events: AuditTimelineEvent[];
  candidateName?: string;
  jobTitle?: string;
}

export function HRAuditTimeline({ events = [], candidateName = "Candidate", jobTitle = "Position" }: HRAuditTimelineProps) {
  const [filter, setFilter] = useState<"ALL" | "AI_EVALUATION" | "HR_OVERRIDE">("ALL");

  const filteredEvents = (events ?? []).filter((evt) => {
    if (filter === "ALL") return true;
    return evt.type === filter;
  });

  const getEventIcon = (type: AuditTimelineEvent["type"]) => {
    switch (type) {
      case "HR_OVERRIDE":
        return <UserCheck className="w-4 h-4 text-[#0071e3]" />;
      case "AI_EVALUATION":
        return <Cpu className="w-4 h-4 text-[#2997ff]" />;
      case "TECHNICAL_SANDBOX":
        return <UserCheck className="w-4 h-4 text-[#0071e3]" />;
      default:
        return <FileText className="w-4 h-4 text-[#6e6e73]" />;
    }
  };

  return (
    <div className="bg-paper border-2 border-border p-8 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] font-sans space-y-8">
      {/* Timeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-editorial text-2xl text-ink">سجل التدقيق والحوكمة الشفافة</h3>
            <PulseBadge text="Live Audit Trace" variant="info" />
          </div>
          <p className="font-body-sm text-ink/60">
            تتبع أثر القرارات بين الذكاء الاصطناعي والمراجعة البشرية للمرشح: <span className="font-bold text-ink">{candidateName}</span> ({jobTitle})
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-label-caps text-sm">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 border-2 transition-all cursor-pointer ${
              filter === "ALL" ? "bg-ink text-paper border-ink shadow-[2px_2px_0px_0px_rgba(224,62,0,1)]" : "bg-transparent text-ink border-border hover:border-ink"
            }`}
          >
            جميع الأحداث ({events?.length || 0})
          </button>
          <button
            onClick={() => setFilter("HR_OVERRIDE")}
            className={`px-4 py-2 border-2 transition-all cursor-pointer ${
              filter === "HR_OVERRIDE" ? "bg-ink text-paper border-ink shadow-[2px_2px_0px_0px_rgba(224,62,0,1)]" : "bg-transparent text-ink border-border hover:border-ink"
            }`}
          >
            تعديلات HR
          </button>
          <button
            onClick={() => setFilter("AI_EVALUATION")}
            className={`px-4 py-2 border-2 transition-all cursor-pointer ${
              filter === "AI_EVALUATION" ? "bg-ink text-paper border-ink shadow-[2px_2px_0px_0px_rgba(224,62,0,1)]" : "bg-transparent text-ink border-border hover:border-ink"
            }`}
          >
            تقييمات AI
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="py-8 text-center font-label-caps text-sm text-ink/50 border-2 border-dotted border-border bg-paper">
          لا توجد أحداث مطابقة للفلتر المحدد.
        </div>
      ) : (
        <StaggerContainer className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-ink">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((evt) => (
              <StaggerItem key={evt.id} className="relative">
                {/* Timeline Dot Icon */}
                <div className="absolute -left-6 sm:-left-8 top-0.5 w-7 h-7 bg-paper border-2 border-ink flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] z-10">
                  {getEventIcon(evt.type)}
                </div>

                {/* Event Card */}
                <div className="bg-paper border-2 border-border p-5 transition-all hover:border-ink hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] ml-2">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-editorial text-xl text-ink tracking-tight">{evt.title}</span>
                      <span className="font-label-caps text-sm px-2 py-1 bg-ink text-paper">
                        {evt.actor}
                      </span>
                    </div>
                    <span className="font-label-caps text-sm text-ink/50 flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {evt.timestamp}
                    </span>
                  </div>

                  <p className="font-body-sm text-ink/70 leading-relaxed mb-3">{evt.description}</p>

                  {evt.reasoning && (
                    <div className="p-3 bg-paper border-2 border-border text-sm font-label-caps text-coral mb-3">
                      <span className="font-bold text-ink mr-2">مبرر القرار: </span>
                      {evt.reasoning}
                    </div>
                  )}

                  {typeof evt.score === "number" && (
                    <div className="flex items-center gap-3 pt-3 border-t-2 border-dotted border-border text-sm font-label-caps">
                      <span className="text-ink/60">درجة التقييم الفني:</span>
                      <span className="font-bold text-coral">{evt.score}%</span>
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </AnimatePresence>
        </StaggerContainer>
      )}
    </div>
  );
}
