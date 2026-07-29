import { arTranslations } from "./translations/ar";
import { enTranslations } from "./translations/en";

export type Language = "ar" | "en";
export type Direction = "rtl" | "ltr";

const translations: Record<Language, Record<string, string>> = {
  ar: arTranslations,
  en: enTranslations,
};

export function createT(language: Language) {
  return function t(key: string): string {
    return translations[language]?.[key] ?? translations["en"]?.[key] ?? key;
  };
}
