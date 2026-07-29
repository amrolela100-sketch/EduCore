import { cookies } from "next/headers";
import { arTranslations } from "./translations/ar";
import { enTranslations } from "./translations/en";
import type { Language } from "./index";

const translations: Record<Language, Record<string, string>> = {
  ar: arTranslations,
  en: enTranslations,
};

export async function getServerT() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("educore_lang")?.value ?? "ar") as Language;

  return function t(key: string): string {
    return translations[lang]?.[key] ?? translations["en"]?.[key] ?? key;
  };
}
