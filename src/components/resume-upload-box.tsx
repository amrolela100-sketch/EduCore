"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Loader2, CheckCircle2, FileText, Cpu, Sparkles, AlertCircle } from "lucide-react";
import { PulseBadge } from "@/components/ui/motion-wrapper";

export default function ResumeUploadBox() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    { title: "قراءة الملف (Extracting Text)", desc: "استخراج نصوص السيرة الذاتية وقراءة البيانات...", icon: FileText },
    { title: "تحليل وكيل الذكاء الاصطناعي (AI Profiler)", desc: "تحليل المهارات والخبرات الهندسية بواسطة Profiler Agent...", icon: Cpu },
    { title: "المطابقة وتحديث البروفايل (Profile Matrix)", desc: "تحديث شجرة المهارات والمطابقة التلقائية مع الوظائف الشاغرة...", icon: Sparkles },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setErrorMessage("");
    setCurrentStep(1);
    setIsSuccess(false);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      setCurrentStep(1);
      const stepTimer1 = setTimeout(() => setCurrentStep(2), 400);
      const stepTimer2 = setTimeout(() => setCurrentStep(3), 800);

      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "حدث خطأ أثناء معالجة السيرة الذاتية.");
      }

      setCurrentStep(3);
      setIsSuccess(true);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      console.error("[UPLOAD RESUME ERROR]:", err);
      setErrorMessage(err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء معالجة السيرة الذاتية.");
      setIsUploading(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="p-6 bg-paper shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] border-2 border-dotted border-border transition-all duration-300 font-sans">
      <div className="flex justify-between items-center mb-4">
        <span className="font-editorial text-xl text-ink tracking-wider flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-coral" />
          <span>تحديث السيرة الذاتية Resume Profile</span>
        </span>
        {isUploading && <PulseBadge text="جاري المعالجة..." variant="info" />}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label htmlFor="resume-file-input" className="sr-only">
          اختر ملف السيرة الذاتية (PDF, DOCX, TXT)
        </label>
        <input
          id="resume-file-input"
          type="file"
          accept=".pdf,.docx,.txt"
          required
          disabled={isUploading}
          onChange={(e) => setFile(e. target.files?.[0] || null)}
          className="font-label-caps text-sm w-full border-2 border-dotted border-border bg-transparent p-4 text-ink outline-none focus:border-solid focus:border-ink focus:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 disabled:opacity-50"
        />

        {/* Step Progress Display */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, height: 0 }}
              className="bg-paper border-2 border-border p-4 flex flex-col gap-3 overflow-hidden shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]"
            >
              {/* Progress Line */}
              <div className="w-full bg-border h-1.5 rounded-none overflow-hidden">
                <motion.div
                  initial={prefersReducedMotion ? false : { width: "10%" }}
                  animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-coral h-full rounded-none"
                />
              </div>

              <div className="space-y-2">
                {steps.map((st, idx) => {
                  const stepNum = idx + 1;
                  const isActive = currentStep === stepNum;
                  const isDone = currentStep > stepNum || isSuccess;
                  const StepIcon = st.icon;

                  return (
                    <div
                      key={st.title}
                      className={`flex items-start gap-3 font-label-caps text-sm transition-colors ${
                        isActive ? "text-coral font-bold" : isDone ? "text-ink/80" : "text-ink/40"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-coral flex-nowrap-0 mt-0.5" />
                      ) : isActive ? (
                        <Loader2 className={`w-4 h-4 text-coral flex-nowrap-0 mt-0.5 ${!prefersReducedMotion ? "animate-spin" : ""}`} />
                      ) : (
                        <StepIcon className="w-4 h-4 text-ink/30 flex-nowrap-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold">{st.title}</div>
                        {isActive && <div className="font-body-sm font-normal text-ink/60 mt-0.5">{st.desc}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {errorMessage && (
          <div className="p-4 bg-coral/5 border-2 border-coral text-coral font-label-caps text-sm font-bold flex items-center gap-2" role="alert">
            <AlertCircle className="w-5 h-5 flex-nowrap-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <motion.button
          whileHover={prefersReducedMotion ? undefined : { scale: 1.01 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
          type="submit"
          disabled={!file || isUploading}
          tabIndex={(!file || isUploading) ? -1 : 0}
          className="w-full py-3.5 bg-ink text-paper font-label-caps font-bold hover:bg-coral border-2 border-transparent hover:border-ink hover:text-ink hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isUploading && <Loader2 className={`w-5 h-5 ${!prefersReducedMotion ? "animate-spin" : ""}`} />}
          <span>رفع وتحليل السيرة الذاتية Parse & Align</span>
        </motion.button>
      </form>
    </div>
  );
}