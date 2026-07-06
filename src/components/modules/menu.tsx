"use client";

import {
  Alien01Icon,
  Close,
  HtmlFile02Icon,
  Moon02Icon,
  Pdf02Icon,
  Sun02Icon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { type Language, locales } from "@/i18n/config";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useThemeStore } from "@/stores/useThemeStore";

interface MenuProps {
  open: boolean;
  onClose: () => void;
  useTheme?: boolean;
  side?: "left" | "right";
}

const languageLabels: Record<Language, string> = {
  de: "Deutsch",
  en: "English",
};

const flagMap: Record<Language, string> = {
  de: "at",
  en: "us",
};

function Menu({ open, onClose, useTheme, side = "right" }: MenuProps) {
  const { t } = useTranslation();
  // use in links
  const { language, setLanguage } = useLanguageStore();
  const changeLanguageUrl = useChangeLanguageUrl();

  const { theme, toggle } = useThemeStore();

  return (
    <Drawer
      classNames={`flex flex-col ${side === "right" ? "border-l border-r-2" : "border-r border-l-2"}`}
      open={open}
      onClose={onClose}
      side={side}
      useTheme={useTheme}
    >
      <div className="flex justify-end p-3">
        <Button variant="keyboard" size="icon" onClick={onClose} aria-label="close menu">
          <HugeiconsIcon icon={Close} className="size-6" />
        </Button>
      </div>
      <nav className="flex flex-col px-3 gap-3">
        <Button
          asChild
          variant="keyboard"
          className="justify-start h-13"
          onClick={onClose}
          aria-label="open about page"
        >
          <Link href={`/${language}/albums/`}>
            <HugeiconsIcon icon={Vynil02Icon} className="size-6" />
            {t(($) => $.menu.albums)}
          </Link>
        </Button>
        <Button
          asChild
          variant="keyboard"
          className="justify-start h-13"
          onClick={onClose}
          aria-label="open about page"
        >
          <Link href={`/${language}/about/`}>
            <HugeiconsIcon icon={Alien01Icon} className="size-6" />
            {t(($) => $.menu.about)}
          </Link>
        </Button>
        <Button
          asChild
          variant="keyboard"
          className="justify-start h-13"
          onClick={onClose}
          aria-label="open html cv"
        >
          <Link href="/mike-brucker-cv.html" target="_blank" rel="noopener noreferrer">
            <HugeiconsIcon icon={HtmlFile02Icon} className="size-6" />
            {t(($) => $.menu.cv)} - HTML
          </Link>
        </Button>
        <Button
          asChild
          variant="keyboard"
          className="justify-start h-13"
          onClick={onClose}
          aria-label="open pdf cv"
        >
          <Link href="/mike-brucker-cv.pdf" target="_blank" rel="noopener noreferrer">
            <HugeiconsIcon icon={Pdf02Icon} className="size-6" />
            {t(($) => $.menu.cv)} - PDF
          </Link>
        </Button>
      </nav>
      <div className="mt-auto p-3 gap-0.5 flex flex-wrap-reverse justify-end">
        <Button
          variant="keyboard"
          onClick={toggle}
          className="justify-start h-13"
          aria-label="toggle theme"
        >
          <HugeiconsIcon icon={theme === "dark" ? Moon02Icon : Sun02Icon} className="size-6" />
          {theme === "dark" ? t(($) => $.menu.dark) : t(($) => $.menu.light)}
        </Button>
        {locales.map((locale) => (
          <Button
            key={locale}
            variant="keyboard"
            size="icon"
            className={`h-13 w-13 ${locale === language ? "bg-theme-300 border-theme-300" : ""}`}
            aria-label={`language ${languageLabels[locale]}`}
            onClick={() => {
              setLanguage(locale);
              changeLanguageUrl(locale);
            }}
          >
            <span className={`fi fi-${flagMap[locale]} text-lg`} />
          </Button>
        ))}
      </div>
    </Drawer>
  );
}

export { Menu };
