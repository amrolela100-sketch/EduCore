"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

import { translations } from "@/lib/i18n/translations";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");
  const [direction, setDirection] = useState<Direction>("rtl");

  useEffect(() => {
    // Read saved language preference from localStorage if available
    const saved = localStorage.getItem("educore_lang") as Language;
    if (saved === "en" || saved === "ar") {
      setLanguageState(saved);
      setDirection(saved === "ar" ? "rtl" : "ltr");
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    } else {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const dir = lang === "ar" ? "rtl" : "ltr";
    setDirection(dir);
    localStorage.setItem("educore_lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.cookie = `educore_lang=${lang};path=/;max-age=${60 * 60 * 24 * 365}`;
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
