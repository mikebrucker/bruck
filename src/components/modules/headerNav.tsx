"use client";

import {
  Castle02Icon,
  CodesandboxIcon,
  LaptopProgrammingIcon,
  Settings01Icon,
  Vynil02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@mikebrucker/brucks/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { navSelected } from "@/lib/styles";
import { cn } from "@/lib/utils";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import { useLanguageStore } from "@/stores/useLanguageStore";

function HeaderNav() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const language = useLanguageStore((state) => state.language);
  const isAdmin = Boolean(useAdminAuthStore((state) => state.token));

  const links = [
    { path: "music", icon: Vynil02Icon, label: t(($) => $.menu.music) },
    { path: "playground", icon: CodesandboxIcon, label: t(($) => $.menu.playground) },
    { path: "about", icon: LaptopProgrammingIcon, label: t(($) => $.menu.about) },
    ...(isAdmin ? [{ path: "admin", icon: Castle02Icon, label: t(($) => $.menu.admin) }] : []),
    { path: "settings", icon: Settings01Icon, label: t(($) => $.settings.title) },
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
