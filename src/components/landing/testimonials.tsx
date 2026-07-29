"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  contentAr: string;
  contentEn: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "أحمد المحمد",
    role: "مدير التوظيف",
    company: "تك فيوتشر",
    avatar: "AM",
    rating: 5,
    contentAr: " EduCore غيّر طريقة توظيفنا للمهندسين بالكامل. التقييمات المعزولة كشفت مهارات حقيقية لم تظهر في المقابلات التقليدية.",
    contentEn: "EduCore completely transformed how we hire engineers. The sandboxed assessments revealed real skills that never surfaced in traditional interviews.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "VP of Engineering",
    company: "DataFlow Inc",
    avatar: "SC",
    rating: 5,
    contentAr: "الشفافية في خوارزميات التقييم أعطتنا ثقة كاملة في قرارات التوظيف. الآن نستطيع شرح كل اختيار للدارة بوضوح.",
    contentEn: "The transparency in evaluation algorithms gave us complete confidence in hiring decisions. Now we can clearly explain every choice to the board.",
  },
  {
    id: 3,
    name: "خالد السعودية",
    role: "مؤسس ومدير تقني",
    company: "سولو تاتش",
    avatar: "KS",
    rating: 5,
    contentAr: "منصة واحدة غطت كل احتياجتنا - من التقييم الأولي إلى التوظيف النهائي. وفرنا 60% من وقت التوظيف.",
    contentEn: "One platform covered our entire need - from initial screening to final hire. We saved 60% of our hiring time.",
  },
  {
    id: 4,
    name: "Maria Santos",
    role: "HR Director",
    company: "CloudBase",
    avatar: "MS",
    rating: 5,
    contentAr: "سجل التدقيق الغير قابل للتغيير حمينا من نزاعات التوظيف. كل شيء موثق ومحمي قانونياً.",
    contentEn: "The immutable audit trail protected us from hiring disputes. Everything is documented and legally protected.",
  },
  {
    id: 5,
    name: "عمر حسين",
    role: "كبير المهندسين",
    company: "نيكست جن",
    avatar: "OH",
    rating: 5,
    contentAr: "كمهندس، أقدر الشفافية. كنت أعرف بالضبط كيف تم تقييمي وماذا أحتاج لتحسينه.",
    contentEn: "As an engineer, I appreciate the transparency. I knew exactly how I was evaluated and what I needed to improve.",
  },
];

interface TestimonialsProps {
  language: string;
}

export function Testimonials({ language }: TestimonialsProps) {
  const isArabic = language === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 sm:py-24 bg-paper overflow-hidden border-t-2 border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-border mb-4 shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] bg-paper">
            <span className="font-label-caps text-xs font-bold text-ink uppercase tracking-wider">
              {isArabic ? "شهادات العملاء" : "Client Testimonials"}
            </span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-ink tracking-tight mb-4">
            {isArabic ? "ماذا يقول عملاؤنا" : "What Our Clients Say"}
          </h2>
          <p className="font-body-sm text-ink/70 max-w-2xl mx-auto text-base">
            {isArabic
              ? "انضم إلى مئات الشركات التي تثق بـ EduCore لتوظيف أفضل المواهب التقنية"
              : "Join hundreds of companies that trust EduCore to hire the best technical talent"}
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-paper border-2 border-border p-8 sm:p-12 min-h-[320px] flex items-center shadow-[6px_6px_0px_0px_rgba(20,20,20,1)]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="flex flex-col items-center text-center">
                  <Quote className="w-12 h-12 text-coral mb-6" />
                  <p className="font-editorial text-2xl sm:text-3xl text-ink leading-relaxed mb-8 max-w-2xl">
                    "{isArabic ? testimonials[currentIndex].contentAr : testimonials[currentIndex].contentEn}"
                  </p>
                  <div className="flex items-center gap-2 mb-6 border-b-2 border-border pb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? "text-coral fill-coral" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-ink flex items-center justify-center text-paper font-editorial font-bold text-xl border-2 border-border shadow-[2px_2px_0px_0px_rgba(20,20,20,1)]">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div className="text-right">
                      <h4 className="font-label-caps text-ink font-bold text-lg uppercase">{testimonials[currentIndex].name}</h4>
                      <p className="font-body-sm text-ink/70 text-sm">
                        {testimonials[currentIndex].role} @ {testimonials[currentIndex].company}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              className="p-4 bg-paper border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
              aria-label={isArabic ? "السابق" : "Previous"}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-3 transition-all duration-300 border-2 border-ink cursor-pointer ${
                    index === currentIndex ? "w-10 bg-coral" : "w-3 bg-transparent hover:bg-border"
                  }`}
                  aria-label={`${isArabic ? "انتقل إلى" : "Go to"} ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-4 bg-paper border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
              aria-label={isArabic ? "التالي" : "Next"}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}