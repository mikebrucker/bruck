"use client";

import {
  Close,
  HtmlFile02FreeIcons,
  Moon01Icon,
  Pdf02FreeIcons,
  Sun,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { convexButtonGradient } from "@/lib/styles";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { useThemeStore } from "@/stores/useThemeStore";

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
      classNames={side === "right" ? "border-l border-r-2" : "border-r border-l-2"}
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
          className={`rounded-sm ${convexButtonGradient}`}
        >
          <HugeiconsIcon icon={Close} className="size-6" />
        </Button>
      </div>
      <nav className="flex flex-col">
        <button
          type="button"
          onClick={toggle}
          className={`border-b text-lg font-medium hover:bg-theme-300 active:bg-theme-500 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer ${convexButtonGradient}`}
        >
          <HugeiconsIcon icon={theme === "dark" ? Moon01Icon : Sun} className="size-6" />
          {theme === "dark" ? "Dark mode" : "Light mode"}
        </button>
        <Link
          href="/mike-brucker-cv.html"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={`border-b text-lg font-medium hover:bg-theme-300 active:bg-theme-500 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer ${convexButtonGradient}`}
        >
          <HugeiconsIcon icon={HtmlFile02FreeIcons} className="size-6" />
          {t(($) => $.menu.cv)} - HTML
        </Link>
        <Link
          href="/mike-brucker-cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className={`border-b text-lg font-medium hover:bg-theme-300 active:bg-theme-500 transition-colors duration-250 px-4 py-3 flex items-center gap-2 text-left cursor-pointer ${convexButtonGradient}`}
        >
          <HugeiconsIcon icon={Pdf02FreeIcons} className="size-6" />
          {t(($) => $.menu.cv)} - PDF
        </Link>
      </nav>
    </Drawer>
  );
}

export { Menu };
