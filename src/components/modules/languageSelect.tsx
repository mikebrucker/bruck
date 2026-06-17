"use client";

import { Select } from "@/components/ui/select";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { type Language, locales } from "@/i18n/config";
import { convexButtonGradient8 } from "@/lib/styles";
import { useLanguageStore } from "@/stores/useLanguageStore";

const languageLabels: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
};

const flagMap: Record<Language, string> = {
  de: "at",
  en: "us",
};

const options = locales.map((locale) => ({
  value: locale,
  label: languageLabels[locale],
  icon: <span className={`fi fi-${flagMap[locale]}`} />,
}));

function LanguageSelect() {
  const { language, setLanguage } = useLanguageStore();
  const changeLanguageUrl = useChangeLanguageUrl();

  return (
    // {locales.map((locale) => (
    // <span className={`fi fi-${flagMap[locale]}`}></span>
    <Select
      variant="outline"
      className={`bg-theme-100 ${convexButtonGradient8}`}
      value={language}
      options={options}
      onValueChange={(val) => {
        setLanguage(val as Language);
        changeLanguageUrl(val as Language);
      }}
    />
  );
}

export { LanguageSelect };
