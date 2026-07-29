"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Zap,
  ChevronUp,
} from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

export interface JobPostingItem {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salaryRange: string | null;
  location: string | null;
  status: string;
  createdAt: Date;
  company: { id: string; name: string };
}

interface LandingJobsGridProps {
  initialJobPostings: JobPostingItem[];
  language: string;
}

export function LandingJobsGrid({
  initialJobPostings = [],
  language,
}: LandingJobsGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showStickyButton, setShowStickyButton] = useState(false);
  const isArabic = language === "ar";

  const jobs = initialJobPostings ?? [];

  const filteredJobs = jobs.filter((job) => {
    const titleMatch = (job?.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const companyMatch = (job?.company?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || companyMatch;
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section data-od-id="landing-jobs" className="relative py-14 sm:py-20">
      {/* Subtle surface texture */}
      <div className="absolute inset-0 bg-paper" />
      <div className="absolute inset-0 pattern-dots opacity-[0.03] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* ── Header + search ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="relative">
            <span className="inline-flex items-center gap-2 px-3 py-1 font-label-caps border border-border text-ink/40 uppercase mb-3">
              {isArabic ? "الفرص المتاحة" : "Open Positions"}
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-ink">
              {isArabic
                ? "الوظائف الشاغرة المتاحة"
                : "Active Verified Job Openings"}
            </h2>
            <p className="font-body-sm text-ink/60 mt-2">
              {isArabic
                ? "تصفح الفرص المتاحة والتحق بالاختبار الفني المعزول"
                : "Explore positions with automated candidate-job skill matching"}
            </p>
            <div className="absolute -top-2 -right-4 sm:-right-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-coral text-paper font-label-caps border border-coral">
                <Briefcase className="w-3 h-3" />
                <AnimatedCounter target={filteredJobs.length} />
                <span className="sr-only">
                  {isArabic ? "وظيفة متاحة" : "jobs available"}
                </span>
              </span>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1d1d1f]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? "بحث عن مسمى وظيفي أو شركة..."
                  : "Search positions..."
              }
              className="w-full pl-10 pr-4 py-3 bg-paper border-2 border-border text-ink outline-none focus:border-ink transition-all placeholder:text-ink/35 font-body-sm"
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>
        </div>

        {/* ── Jobs grid ── */}
        {filteredJobs.length === 0 ? (
          <div className="p-10 text-center editorial-card text-ink/50 font-body-sm">
            {isArabic
              ? "لا توجد وظائف مطابقة لعملية البحث الحالية."
              : "No position matches your search query."}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredJobs.map((job) => (
              <StaggerItem key={job.id}>
                <JobCard job={job} isArabic={isArabic} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>

      {/* ── Mobile sticky CTA ── */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: showStickyButton ? 0 : 100,
          opacity: showStickyButton ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[calc(100%-3rem)] max-w-sm"
      >
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 px-6 py-4 bg-ink text-paper font-label-caps border-2 border-ink shadow-[4px_4px_0px_0px_rgba(224,62,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(224,62,0,1)] transition-all group"
        >
          <Zap className="w-5 h-5 text-coral" />
          <span>
            {isArabic ? "تقدم الآن - سريع" : "Apply Now - Quick Apply"}
          </span>
          <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}

function JobCard({
  job,
  isArabic,
}: {
  job: JobPostingItem;
  isArabic: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      data-od-id={`job-card-${job.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between h-full p-6 editorial-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
    >
      {/* Hover sheen */}
      <motion.div
        className="absolute inset-0 bg-ink/5 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <div className="relative space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-editorial text-2xl text-ink leading-snug tracking-tight">
            {job.title}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-coral/10 text-coral font-label-caps border border-coral/20">
            <span className="w-1.5 h-1.5 bg-coral rounded-none animate-pulse" />
            OPEN
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-label-caps text-ink/60">
          <span className="inline-flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            {job?.company?.name || "EduCore"}
          </span>
          {job.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
          )}
        </div>

        <p className="font-body-sm text-ink/70 line-clamp-2 leading-relaxed">
          {job.description}
        </p>
      </div>

      <div className="relative pt-6 mt-6 border-t border-dotted border-border flex items-center justify-between">
        <span className="font-label-caps text-ink/50">
          {job.salaryRange || (isArabic ? "راتب تنافسي" : "Competitive")}
        </span>
        <Link
          href="/login"
          data-od-id="job-card-apply-btn"
          className="group/btn relative overflow-hidden inline-flex items-center gap-1.5 px-4 py-2 bg-ink text-paper font-label-caps hover:bg-coral transition-colors"
        >
          <motion.span
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.45 }}
          />
          <span className="relative">
            {isArabic ? "تقدم الآن" : "Apply"}
          </span>
          {isArabic ? (
            <ArrowLeft className="w-3.5 h-3.5 relative" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5 relative" />
          )}
        </Link>
      </div>
    </motion.div>
  );
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}
