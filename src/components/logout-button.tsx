"use client";

import { signOut } from "next-auth/react";
import { useLanguage } from "@/components/language-context";

export function LogoutButton() {
  const { t } = useLanguage();

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="font-label-caps text-sm px-4 py-2 border-2 border-border text-ink bg-paper hover:bg-ink hover:text-paper transition-all uppercase rounded-none cursor-pointer shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(20,20,20,1)]"
    >
      {t("logout")}
    </button>
  );
}
