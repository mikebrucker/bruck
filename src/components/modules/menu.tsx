"use client";

import {
  Close,
  FileBadgeIcon,
  HtmlFile02Icon,
  LaptopProgrammingIcon,
  Moon02Icon,
  Pdf02Icon,
  Sun02Icon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useChangeLanguageUrl } from "@/hooks/useChangeLanguageUrl";
import { type Language, locales } from "@/i18n/config";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { Themes, useThemeStore } from "@/stores/useThemeStore";

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
  const pathname = usePathname();
  // use in links
  const { language, setLanguage } = useLanguageStore();
  const changeLanguageUrl = useChangeLanguageUrl();
  const isAlbumsSelected = pathname.startsWith(`/${language}/albums`);
  const isAboutSelected = pathname.startsWith(`/${language}/about`);
  const isCvSelected = pathname.startsWith(`/${language}/cv`);
  const selectedClassName = "bg-theme-400 border-theme-300";
  const { theme, toggle } = useThemeStore();

  return (
    <Drawer
      classNames={`flex flex-col ${side === "right" ? "border-l border-r-2" : "border-r border-l-2"} rounded-l-lg`}
      open={open}
      onClose={onClose}
      side={side}
      useTheme={useTheme}
    >
      <div className="flex justify-end py-3 px-2.5 sm:px-3">
        <Button variant="keyboard" size="icon" onClick={onClose} aria-label="close menu">
          <HugeiconsIcon icon={Close} className="size-6" />
        </Button>
      </div>
      <nav className="flex flex-col px-2.5 sm:px-3 gap-0.5">
        <Button
          asChild
          variant="keyboard"
          className={`justify-start h-13 ${isAlbumsSelected ? selectedClassName : ""}`}
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
          className={`justify-start h-13 ${isAboutSelected ? selectedClassName : ""}`}
          onClick={onClose}
          aria-label="open about page"
        >
          <Link href={`/${language}/about/`}>
            <HugeiconsIcon icon={LaptopProgrammingIcon} className="size-6" />
            {t(($) => $.menu.about)}
          </Link>
        </Button>
        <div className="mt-auto gap-0.5 flex">
          <Button
            asChild
            variant="keyboard"
            className={`justify-start h-13 grow ${isCvSelected ? selectedClassName : ""}`}
            onClick={onClose}
            aria-label="open about page"
          >
            <Link href={`/${language}/cv/`}>
              <HugeiconsIcon icon={FileBadgeIcon} className="size-6" />
              {t(($) => $.menu.cv)}/{t(($) => $.menu.resume)}
            </Link>
          </Button>
          <Button
            asChild
            variant="keyboard"
            size="icon"
            className="h-13 w-13"
            onClick={onClose}
            aria-label="open html cv"
          >
            <Link href="/mike-brucker-cv.html" target="_blank" rel="noopener noreferrer">
              <HugeiconsIcon icon={HtmlFile02Icon} className="size-6" />
            </Link>
          </Button>
          <Button
            asChild
            variant="keyboard"
            size="icon"
            className="h-13 w-13"
            onClick={onClose}
            aria-label="open pdf cv"
          >
            <Link href="/mike-brucker-cv.pdf" target="_blank" rel="noopener noreferrer">
              <HugeiconsIcon icon={Pdf02Icon} className="size-6" />
            </Link>
          </Button>
        </div>
      </nav>
      <div className="mt-auto py-3 px-2.5 sm:px-3 gap-0.5 flex flex-wrap-reverse justify-end">
        <Button
          variant="keyboard"
          size="icon"
          onClick={toggle}
          className={`h-13 w-13 ${theme === Themes.light ? "bg-amber-200 border-yellow-200" : "bg-indigo-800 border-indigo-900"}`}
          aria-label="toggle theme"
        >
          <HugeiconsIcon icon={theme === Themes.dark ? Moon02Icon : Sun02Icon} className="size-6" />
        </Button>
        {locales.map((locale) => (
          <Button
            key={locale}
            variant="keyboard"
            size="icon"
            className={`h-13 w-13 ${locale === language ? selectedClassName : ""}`}
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
