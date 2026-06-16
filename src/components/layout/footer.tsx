"use client";

import type * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { type Language, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/useLanguageStore";

const languageLabels: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
};

const flagMap: Record<Language, string> = {
  de: "at",
  en: "us",
};

interface FooterProps extends React.ComponentProps<"footer"> {
  sticky?: boolean;
}

function Footer({ className, sticky = false, ...props }: FooterProps) {
  const { language, setLanguage } = useLanguageStore();
  const changeLanguageUrl = useChangeLanguageUrl();

  return (
    <footer
      data-slot="footer"
      className={cn("flex w-full items-center justify-end bg-card border-t px-4 py-4", sticky && "sticky bottom-0 z-10", className)}
      {...props}
    >
      <Select
        value={language}
        onValueChange={(value) => {
          const nextLanguage = value as Language;
          setLanguage(nextLanguage);
          changeLanguageUrl(nextLanguage);
        }}
      >
        <SelectTrigger className="cursor-pointer min-w-32">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent align="end">
          {locales.map((locale) => (
            <SelectItem className="cursor-pointer" key={locale} value={locale}>
              <span className="flex items-center gap-2">
                <span className={`fi fi-${flagMap[locale]}`}></span>
                <span>{languageLabels[locale]}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </footer>
  );
}

export { Footer };
