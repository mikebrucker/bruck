"use client";

import {
  Close,
  HtmlFile02Icon,
  Moon02Icon,
  Pdf02Icon,
  Sun02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { convexButtonGradient8, convexButtonGradient12 } from "@/lib/styles";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { LanguageSelect } from "./languageSelect";

interface MenuProps {
  open: boolean;
  onClose: () => void;
  useTheme?: boolean;
}

function Menu({ open, onClose, useTheme }: MenuProps) {
  const { t } = useTranslation();
  // use in links
  const _lang = useLanguageStore((s) => s.language);
  const { theme, toggle } = useThemeStore();
  const side: "left" | "right" = "right";
  return (
    <Drawer
      classNames={`flex flex-col ${side === "right" ? "border-l border-r-2" : "border-r border-l-2"}`}
      open={open}
      onClose={onClose}
      side={side}
      useTheme={useTheme}
    >
      <div className="flex justify-end px-4 py-3 border-b">
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          aria-label={"close menu"}
          className={`bg-theme-100 ${convexButtonGradient8}`}
        >
          <HugeiconsIcon icon={Close} className="size-6" />
        </Button>
      </div>
      <nav className="flex flex-col">
        <button
          type="button"
          onClick={toggle}
          className={`border-b text-lg font-medium hover:bg-theme-300 active:bg-theme-500 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer bg-theme-100 ${convexButtonGradient12}`}
        >
          <HugeiconsIcon icon={theme === "dark" ? Moon02Icon : Sun02Icon} className="size-6" />
          {theme === "dark" ? t(($) => $.menu.dark) : t(($) => $.menu.light)}
        </button>
        <Link
          href="/mike-brucker-cv.html"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={`border-b text-lg font-medium hover:bg-theme-300 active:bg-theme-500 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer bg-theme-100 ${convexButtonGradient12}`}
        >
          <HugeiconsIcon icon={HtmlFile02Icon} className="size-6" />
          {t(($) => $.menu.cv)} - HTML
        </Link>
        <Link
          href="/mike-brucker-cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={`border-b text-lg font-medium hover:bg-theme-300 active:bg-theme-500 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer bg-theme-100 ${convexButtonGradient12}`}
        >
          <HugeiconsIcon icon={Pdf02Icon} className="size-6" />
          {t(($) => $.menu.cv)} - PDF
        </Link>
      </nav>
      <div className="mt-auto p-4 flex justify-end">
        <LanguageSelect />
      </div>
    </Drawer>
  );
}

export { Menu };
