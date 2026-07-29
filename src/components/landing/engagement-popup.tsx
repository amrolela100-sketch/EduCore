"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";
import { X, Mail, CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/language-context";

interface EngagementPopupProps {
  delay?: number;
  exitIntentEnabled?: boolean;
  onEmailSubmit?: (email: string) => void;
}

const content = {
  en: {
    title: "Before you go!",
    subtitle: "Get exclusive engineering hiring insights delivered to your inbox",
    placeholder: "Enter your work email",
    button: "Get Free Insights",
    success: "You're in! Check your inbox for exclusive content.",
    trustText: "Join 2,500+ engineering leaders",
  },
  ar: {
    title: "قبل أن تذهب!",
    subtitle: "احصل على رؤى حصرية حول توظيف المهندسين مباشرة في بريدك",
    placeholder: "أدخل بريدك الإلكتروني",
    button: "احصل على الرؤى مجانًا",
    success: "تم! تحقق من بريدك للحصول على محتوى حصري.",
    trustText: "انضم إلى 2,500+ من قادة الهندسة",
  },
};

export function EngagementPopup({
  delay = 30000,
  exitIntentEnabled = true,
  onEmailSubmit,
}: EngagementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [hasTriggered, setHasTriggered] = useState(false);
  const prefersReducedMotion = useSafeReducedMotion();
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = content[isArabic ? "ar" : "en"];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const timer = setTimeout(() => {
      if (!hasTriggered && !isSubmitted) {
        setIsVisible(true);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, prefersReducedMotion, hasTriggered, isSubmitted]);

  useEffect(() => {
    if (!exitIntentEnabled || prefersReducedMotion) return;

    let lastY = 0;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasTriggered && !isSubmitted) {
        setHasTriggered(true);
        setIsVisible(true);
      }
    };

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < lastY && scrollY < 50 && !hasTriggered && !isSubmitted) {
        setHasTriggered(true);
        setIsVisible(true);
      }
      lastY = scrollY;
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [exitIntentEnabled, prefersReducedMotion, hasTriggered, isSubmitted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubmitted(true);
      onEmailSubmit?.(email);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setHasTriggered(true);
  };

  if (prefersReducedMotion) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-paper border-2 border-border shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] max-w-md w-full p-8"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 border-2 border-transparent hover:border-border transition-colors text-ink/50 hover:text-ink cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="flex items-center justify-center w-14 h-14 border-2 border-border bg-ink mb-6 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] mx-auto">
                  <Mail className="w-6 h-6 text-paper" />
                </div>

                <h3 className="font-editorial text-2xl font-bold text-ink text-center mb-2">
                  {t.title}
                </h3>

                <p className="font-body-sm text-sm text-ink/70 text-center mb-8 border-b-2 border-dotted border-border pb-6">
                  {t.subtitle}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full px-4 py-3 bg-paper border-2 border-border focus:border-coral focus:outline-none font-body-sm text-ink placeholder:text-ink/40 transition-all shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.05)]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-coral text-ink font-label-caps font-bold uppercase border-2 border-transparent hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] cursor-pointer"
                  >
                    {t.button}
                  </button>
                </form>

                <p className="font-label-caps text-[10px] text-ink/50 text-center mt-6 flex items-center justify-center gap-1.5 uppercase font-bold tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {t.trustText}
                </p>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="flex items-center justify-center w-16 h-16 border-2 border-emerald-500 bg-emerald-50 mb-6 mx-auto shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-ink mb-2">
                  {isArabic ? "تم بنجاح!" : "You're in!"}
                </h3>
                <p className="font-body-sm text-ink/70">{t.success}</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}