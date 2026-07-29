"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-context";

const messages = {
  ar: {
    title: "الصفحة غير موجودة",
    description: "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    home: "العودة للرئيسية",
    back: "الرجوع للخلف"
  },
  en: {
    title: "Page not found",
    description: "Sorry, the page you are looking for does not exist or has been moved.",
    home: "Go Home",
    back: "Go Back"
  }
};

export default function NotFound() {
  const { language, direction } = useLanguage();
  const msg = messages[language];
  const isRTL = direction === "rtl";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-paper px-6"
    >
      <div className="max-w-md w-full border-2 border-border p-8 text-center bg-paper">
        <h1 className="text-8xl font-editorial text-coral mb-6">404</h1>
        <h2 className="text-2xl font-editorial text-ink mb-3">{msg.title}</h2>
        <p className="font-body-sm text-ink/70 mb-8">{msg.description}</p>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-3 px-6 bg-ink text-paper font-label-caps text-center border-2 border-ink hover:bg-paper hover:text-ink transition-colors duration-200"
          >
            {msg.home}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 px-6 bg-transparent text-ink font-label-caps text-center border-2 border-ink hover:bg-ink/5 transition-colors duration-200"
          >
            {msg.back}
          </button>
        </div>
      </div>
    </div>
  );
}
