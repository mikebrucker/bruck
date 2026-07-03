import { create } from "zustand";
import { defaultLocale, isLocale, type Language } from "@/i18n/config";
import { i18n } from "@/i18n/i18n";

type LanguageState = {
  language: Language;
  ready: boolean;
  setLanguage: (lang: Language) => void;
};

const setLang = (setLang?: string): Language => {
  if (!setLang && typeof window === "undefined") return defaultLocale;
  const lang = setLang || navigator.language || navigator.languages?.[0] || defaultLocale;
  const language = lang.split("-")[0];
  return isLocale(language) ? (language as Language) : defaultLocale;
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: setLang(),
  ready: false,
  setLanguage: (lang) => {
    const language = setLang(lang);
    i18n.changeLanguage(language);
    set({ language });
  },
}));
