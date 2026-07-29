"use client";

import React from "react";
import { useLanguage } from "./language-context";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1.5 p-1 bg-paper border border-ledger rounded-xs font-mono text-xs shadow-xs">
      <Globe className="w-3.5 h-3.5 text-verified ml-1 shrink-0" />
      <button
        onClick={() => setLanguage("ar")}
        className={`relative px-2.5 py-1 transition-all duration-200 cursor-pointer font-bold ${
          language === "ar" ? "text-white" : "text-ink/70 hover:text-ink"
        }`}
      >
        {language === "ar" && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-verified shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">العربية</span>
      </button>

      <span className="text-ledger">|</span>

      <button
        onClick={() => setLanguage("en")}
        className={`relative px-2.5 py-1 transition-all duration-200 cursor-pointer font-bold ${
          language === "en" ? "text-white" : "text-ink/70 hover:text-ink"
        }`}
      >
        {language === "en" && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-verified shadow-xs"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">EN</span>
      </button>
    </div>
  );
}
