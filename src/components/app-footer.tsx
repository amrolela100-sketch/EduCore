"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/language-context";
import { Mail, CheckCircle } from "lucide-react";

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

interface AppFooterProps {
  variant?: "dark" | "light";
}

const content = {
  en: {
    newsletter: { title: "Stay ahead in engineering hiring", subtitle: "Weekly insights, no spam", placeholder: "Work email", button: "Subscribe" },
    trust: { engineers: "Engineering Leaders", assessments: "Assessments Run", satisfaction: "Satisfaction Rate", compliance: "SOC2 Compliant" },
    links: { about: "About", careers: "Careers", blog: "Blog", contact: "Contact" },
    social: { linkedin: "LinkedIn", twitter: "Twitter", github: "GitHub" },
    copyright: "All rights reserved. Built on Rigorous Transparency.",
  },
  ar: {
    newsletter: { title: "ابقَ في الصدارة بتوظيف الهندسة", subtitle: "رؤى أسبوعية، بدون إزعاج", placeholder: "بريد إلكتروني", button: "اشترك" },
    trust: { engineers: "قادة هندسة", assessments: "تقييم مُنفذ", satisfaction: "معدل الرضا", compliance: "متوافق مع SOC2" },
    links: { about: "عن EduCore", careers: "الوظائف", blog: "المدونة", contact: "تواصل معنا" },
    social: { linkedin: "LinkedIn", twitter: "Twitter", github: "GitHub" },
    copyright: "جميع الحقوق محفوظة. مبني على الشفافية الصارمة.",
  },
};

export function AppFooter({}: AppFooterProps) {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const year = new Date().getFullYear();
  const isArabic = language === "ar";
  const t = content[isArabic ? "ar" : "en"];

  return (
    <footer className={`w-full mt-auto border-t border-border bg-paper text-ink pb-8 pt-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-display-md tracking-tight">Edu<span className="text-emphasis">Core</span></span>
              </Link>
            </div>
            <p className="font-body-sm leading-relaxed opacity-80 max-w-xs">{isArabic ? "المنصة التحريرية لاكتشاف المواهب الهندسية." : "The editorial platform for discovering engineering talent."}</p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:bg-ink hover:text-paper transition-colors" aria-label={t.social.linkedin}>
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:bg-ink hover:text-paper transition-colors" aria-label={t.social.twitter}>
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full border border-border hover:bg-ink hover:text-paper transition-colors" aria-label={t.social.github}>
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-label-caps mb-6">{isArabic ? "روابط سريعة" : "Quick Links"}</h3>
            <ul className="space-y-3">
              {(["about", "careers", "blog", "contact"] as const).map((link) => (
                <li key={link}>
                  <Link href={`/${link}`} className="font-body-sm hover:text-coral transition-colors underline decoration-border underline-offset-4 hover:decoration-coral">
                    {t.links[link]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-2">
            <div className="p-8 paper-surface rounded-sm h-full flex flex-col justify-center">
              <h3 className="font-editorial text-2xl mb-2">{t.newsletter.title}</h3>
              <p className="font-body-sm opacity-70 mb-6">{t.newsletter.subtitle}</p>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <label htmlFor="footer-newsletter-email" className="sr-only">{t.newsletter.placeholder}</label>
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
                    <input id="footer-newsletter-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.newsletter.placeholder} className="w-full pl-10 pr-4 py-3 rounded-sm font-body-sm border-hairline bg-paper outline-none focus:border-coral transition-colors" required />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-ink text-paper font-body-sm rounded-sm hover:bg-coral transition-colors">{t.newsletter.button}</button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-coral">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-body-sm">{isArabic ? "تم الاشتراك بنجاح!" : "Subscribed successfully!"}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-data-mono opacity-50">© {year} EDUCORE. {t.copyright}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-label-caps hover:text-coral transition-colors">{isArabic ? "الخصوصية" : "Privacy"}</Link>
            <Link href="/terms" className="font-label-caps hover:text-coral transition-colors">{isArabic ? "الشروط" : "Terms"}</Link>
            <Link href="/cookies" className="font-label-caps hover:text-coral transition-colors">{isArabic ? "الكوكيز" : "Cookies"}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}