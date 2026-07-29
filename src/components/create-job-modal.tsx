"use client";

import React, { useState, useActionState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createJobPostingAction } from "@/app/admin/hr/actions";
import {
  PlusCircle,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
} from "lucide-react";

export function CreateJobModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createJobPostingAction, null);

  // Auto-close modal after successful creation
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="font-label-caps uppercase font-bold px-5 py-3 bg-verified text-white hover:bg-[#0066cc] transition-all shadow-premium hover:shadow-glow-emerald flex items-center gap-2 cursor-pointer rounded-xl"
      >
        <PlusCircle className="w-4 h-4" />
        <span>إضافة وظيفة جديدة</span>
      </motion.button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPending && setIsOpen(false)}
              className="fixed inset-0 bg-ink/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-2xl bg-white border border-ledger shadow-premium z-10 overflow-hidden text-ink font-sans rounded-2xl"
            >
              {/* Header */}
              <div className="bg-ink text-white p-6 flex justify-between items-center border-b border-verified/30 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-verified text-white flex items-center justify-center font-mono font-bold text-sm rounded-lg">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight uppercase tracking-tight flex items-center gap-2">
                      <span>إضافة وظيفة جديدة للمنصة</span>
                      <Sparkles className="w-4 h-4 text-verified" />
                    </h2>
                    <p className="text-xs text-white/70 font-data-mono">
                      سيتم نشر الوظيفة فوراً على الصفحة الرئيسية وتفعيل التوظيف الذكي بها
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => !isPending && setIsOpen(false)}
                  disabled={isPending}
                  className="text-white/70 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form action={formAction} className="p-6 space-y-5">
                {/* Feedback Alerts */}
                {state?.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-data-mono flex items-center gap-2 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{state.error}</span>
                  </motion.div>
                )}

                {state?.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-[#f0fff4] border border-[#34c759]/20 text-[#248a3d] text-xs font-data-mono flex items-center gap-2 font-bold rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#34c759]" />
                    <span>{state.message}</span>
                  </motion.div>
                )}

                {/* Job Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-data-mono font-bold uppercase text-ink">
                    مسمى الوظيفة (Job Title) <span className="text-flag">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="مثال: Senior Full-Stack Engineer"
                    className="w-full px-4 py-2.5 bg-surface border border-ledger text-sm text-ink focus:outline-none focus:border-verified focus:ring-2 focus:ring-verified/10 transition-all rounded-xl"
                  />
                </div>

                {/* Grid 2 Columns: Company & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-data-mono font-bold uppercase text-ink flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-verified" />
                      <span>اسم الشركة / القسم</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="Apex Global Technologies"
                      className="w-full px-4 py-2.5 bg-surface border border-ledger text-sm text-ink focus:outline-none focus:border-verified focus:ring-2 focus:ring-verified/10 transition-all rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-data-mono font-bold uppercase text-ink flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-verified" />
                      <span>الموقع / طبيعة العمل</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      placeholder="مثال: Riyadh / Remote"
                      className="w-full px-4 py-2.5 bg-surface border border-ledger text-sm text-ink focus:outline-none focus:border-verified focus:ring-2 focus:ring-verified/10 transition-all rounded-xl"
                    />
                  </div>
                </div>

                {/* Salary Range & Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-data-mono font-bold uppercase text-ink flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-verified" />
                      <span>المدى الراتبي (Salary Range)</span>
                    </label>
                    <input
                      type="text"
                      name="salaryRange"
                      placeholder="مثال: $90,000 - $120,000"
                      className="w-full px-4 py-2.5 bg-surface border border-ledger text-sm text-ink focus:outline-none focus:border-verified focus:ring-2 focus:ring-verified/10 transition-all rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-data-mono font-bold uppercase text-ink flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-verified" />
                      <span>المهارات المطلوبة (مفصولة بفاصلة) <span className="text-flag">*</span></span>
                    </label>
                    <input
                      type="text"
                      name="requirements"
                      required
                      placeholder="TypeScript, React, Next.js, Node.js"
                      className="w-full px-4 py-2.5 bg-surface border border-ledger text-sm text-ink focus:outline-none focus:border-verified focus:ring-2 focus:ring-verified/10 transition-all rounded-xl"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-data-mono font-bold uppercase text-ink">
                    وصف الوظيفة (Job Description) <span className="text-flag">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    required
                    placeholder="اكتب وصفاً مفصلاً لمتطلبات الوظيفة والمهام الموكلة للمرشح..."
                    className="w-full px-4 py-2.5 bg-surface border border-ledger text-sm text-ink focus:outline-none focus:border-verified focus:ring-2 focus:ring-verified/10 transition-all resize-none rounded-xl"
                  ></textarea>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-ledger flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={isPending}
                    className="px-5 py-2.5 border border-ledger text-xs font-data-mono font-bold uppercase hover:bg-surface transition-colors rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 bg-verified text-white text-xs font-data-mono font-bold uppercase hover:bg-[#0066cc] transition-all disabled:opacity-50 flex items-center gap-2 shadow-premium rounded-xl cursor-pointer"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري الحفظ والأنشطة...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>نشر الوظيفة فوراً</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
