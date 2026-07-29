"use client";

import React from "react";
import { MotionModal } from "@/components/ui/motion-modal";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export interface ApplicationData {
  id: string;
  status: string;
  matchScore: number | null;
  rankingReason: string;
  createdAt: Date;
  candidateProfile: {
    id: string;
    skills: string[];
    user: {
      name: string | null;
      email: string;
    };
  };
  jobPosting: {
    id: string;
    title: string;
  };
}

interface HrOverrideModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApp: ApplicationData | null;
  decision: "ACCEPTED" | "REJECTED";
  setDecision: (val: "ACCEPTED" | "REJECTED") => void;
  justification: string;
  setJustification: (val: string) => void;
  loading: boolean;
  message: string;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function HrOverrideModalDialog({
  isOpen,
  onClose,
  selectedApp,
  decision,
  setDecision,
  justification,
  setJustification,
  loading,
  message,
  error,
  onSubmit,
}: HrOverrideModalDialogProps) {
  if (!selectedApp) return null;

  const candidateName = selectedApp?.candidateProfile?.user?.name || selectedApp?.candidateProfile?.user?.email || "المرشح";

  return (
    <MotionModal
      isOpen={isOpen}
      onClose={onClose}
      title="قرار التعديل والتجاوز البشري HR Compliance Override"
      subtitle={`تسجيل مبررات تعديل تقييم الذكاء الاصطناعي للمرشح: ${candidateName}`}
    >
      <form onSubmit={onSubmit} className="space-y-4 font-sans text-sm font-label-caps">
        {/* Candidate Info Summary */}
        <div className="p-4 bg-paper border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] flex items-center justify-between">
          <div>
            <span className="font-editorial text-xl text-ink tracking-tight block">{selectedApp?.jobPosting?.title || "الوظيفة"}</span>
            <span className="text-ink/60 mt-1 block">{selectedApp?.candidateProfile?.user?.email}</span>
          </div>
          <div className="text-right">
            <span className="text-ink/50 block mb-1">مطابقة AI</span>
            <span className="font-bold text-coral">
              {selectedApp?.matchScore !== null ? `${selectedApp?.matchScore}%` : "قيد المعالجة"}
            </span>
          </div>
        </div>

        {/* Decision Toggle */}
        <div className="space-y-2">
          <label className="font-bold text-ink block">القرار النهائي لمدير التوظيف:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDecision("ACCEPTED")}
              className={`p-3 border-2 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                decision === "ACCEPTED"
                  ? "bg-coral/5 border-coral text-coral shadow-[2px_2px_0px_0px_rgba(224,62,0,1)]"
                  : "bg-paper border-border text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>قبول المرشح ACCEPT</span>
            </button>

            <button
              type="button"
              onClick={() => setDecision("REJECTED")}
              className={`p-3 border-2 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                decision === "REJECTED"
                  ? "bg-ink border-ink text-paper shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]"
                  : "bg-paper border-border text-ink/60 hover:border-ink hover:text-ink"
              }`}
            >
              <XCircle className="w-5 h-5" />
              <span>رفض الطلب REJECT</span>
            </button>
          </div>
        </div>

        {/* Justification Input */}
        <div className="space-y-2">
          <label className="font-bold text-ink block">
            المبرر المنطقي والإداري (مطلوب لأغراض التدقيق والحوكمة):
          </label>
          <textarea
            required
            rows={4}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="ادخل الأسباب والمبررات الفنية أو التنظيمية لهذا التعديل..."
            className="w-full p-4 bg-paper border-2 border-border focus:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] focus:border-ink outline-none text-ink font-body-sm transition-all"
          />
        </div>

        {/* Messages */}
        {error && (
          <div className="p-4 bg-coral/5 border-2 border-coral text-coral font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-4 bg-ink/5 border-2 border-ink text-ink font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-dotted border-border mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-transparent text-ink font-bold border-2 border-border hover:border-ink transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading || !justification.trim()}
            className="px-6 py-3 bg-ink text-paper font-bold border-2 border-transparent hover:border-ink hover:text-ink hover:bg-paper hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin text-coral" />}
            <span>حفظ القرار وسجل التدقيق</span>
          </button>
        </div>
      </form>
    </MotionModal>
  );
}
