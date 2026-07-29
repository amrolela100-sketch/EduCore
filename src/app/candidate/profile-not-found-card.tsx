"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-context";

export function ProfileNotFoundCard() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center flex-1">
      <div className="max-w-md text-center p-8 editorial-card bg-paper shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] border-2 border-ink">
        <h1 className="font-editorial text-3xl text-ink mb-2 tracking-tight">
          {t("profileNotFound")}
        </h1>
        <p className="font-body-sm text-ink/60 mb-5 leading-relaxed">
          {t("profileNotFoundDesc")}
        </p>
        <Link
          href="/login"
          className="px-6 py-3 bg-ink text-paper font-label-caps uppercase hover:bg-coral border-2 border-transparent hover:border-ink hover:text-ink hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300 inline-block"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </div>
  );
}