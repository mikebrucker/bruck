"use client";

import {
  CodesandboxIcon,
  FileBadgeIcon,
  LaptopProgrammingIcon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { navSelected } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/useLanguageStore";

function HeaderNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const language = useLanguageStore((state) => state.language);

  const links = [
    { path: "music", icon: Vynil02Icon, label: t(($) => $.menu.music) },
    { path: "playground", icon: CodesandboxIcon, label: t(($) => $.menu.playground) },
    { path: "about", icon: LaptopProgrammingIcon, label: t(($) => $.menu.about) },
    {
      path: "cv",
      icon: FileBadgeIcon,
      label: `${t(($) => $.menu.cv)}/${t(($) => $.menu.resume)}`,
    },
  ];

  return (
    <nav aria-label={t(($) => $.ariaLabels.main_navigation)} className="hidden lg:block">
      <ul className="flex items-center gap-0.5">
        {links.map(({ path, icon, label }) => {
          const isSelected = pathname.startsWith(`/${language}/${path}`);
          return (
            <li key={path}>
              <Button
                asChild
                variant="keyboard"
                size="icon"
                className={cn(isSelected ? navSelected : null)}
              >
                <Link
                  href={`/${language}/${path}/`}
                  aria-label={label}
                  title={label}
                  aria-current={isSelected ? "page" : undefined}
                >
                  <HugeiconsIcon
                    icon={icon}
                    aria-hidden
                    className={cn("size-6", isSelected ? null : "text-theme-500")}
                  />
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { HeaderNav };
