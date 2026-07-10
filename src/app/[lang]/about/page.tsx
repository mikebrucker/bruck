"use client";

import {
  ReactIcon,
  ShadcnIcon,
  SqlIcon,
  TailwindcssIcon,
  TranslateIcon,
  Typescript01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import type en from "@/i18n/locales/en.json";

type Item = { label: string; icon?: IconSvgElement };
type Group = { label: keyof typeof en.about; items: Array<Item> };

const groups: Array<Group> = [
  {
    label: "frontend",
    items: [
      { label: "TypeScript", icon: Typescript01Icon },
      { label: "React", icon: ReactIcon },
      { label: "Next.js" },
    ],
  },
  {
    label: "styling",
    items: [
      { label: "Tailwind CSS", icon: TailwindcssIcon },
      { label: "Radix UI" },
      { label: "shadcn", icon: ShadcnIcon },
    ],
  },
  {
    label: "data",
    items: [
      { label: "Neon Postgres", icon: SqlIcon },
      { label: "Drizzle ORM" },
      { label: "Zod" },
      { label: "Zustand" },
    ],
  },
  {
    label: "i18n",
    items: [{ label: "i18next", icon: TranslateIcon }],
  },
];

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col gap-4">
      <code className="text-2xl mx-3 px-3 py-0.5 w-fit rounded-sm bg-card font-semibold font-mono">
        <span className="text-[#0431FA] dark:text-[#569CD6]">this</span>.
        <span className="text-[#795E26] dark:text-[#DCDCAA]">website</span>
        <span className="text-[#B8860B] dark:text-[#FFD700]">()</span>
      </code>
      {groups.map((group) => (
        <div key={group.label} className="px-3">
          <p className="font-semibold font-mono">{t(($) => $.about[group.label])}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {group.items.map((item) => (
              <div
                key={item.label}
                className="bg-muted rounded-lg border border-border p-3 flex items-center gap-2.5"
              >
                {item.icon ? (
                  <HugeiconsIcon icon={item.icon} className="size-6 text-theme-600 shrink-0" />
                ) : null}
                <p className="font-medium">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
