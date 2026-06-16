"use client";

import { useState } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizes: Record<
  Size,
  { title: string; subtitle: string; svgSize: number; py: string; gap: string }
> = {
  xs: { title: "text-xs", subtitle: "text-xs", svgSize: 12, py: "py-1", gap: "gap-2" },
  sm: { title: "text-sm", subtitle: "text-xs", svgSize: 14, py: "py-1.5", gap: "gap-2" },
  md: { title: "text-base", subtitle: "text-sm", svgSize: 16, py: "py-2", gap: "gap-2" },
  lg: { title: "text-lg", subtitle: "text-sm", svgSize: 18, py: "py-2.5", gap: "gap-3" },
  xl: { title: "text-xl", subtitle: "text-base", svgSize: 20, py: "py-3", gap: "gap-3" },
  "2xl": { title: "text-2xl", subtitle: "text-base", svgSize: 24, py: "py-3", gap: "gap-3" },
};

type AccordionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  classNames?: string;
  defaultOpen?: boolean;
  size?: Size;
};

export function Accordion({
  title,
  subtitle,
  children,
  classNames,
  defaultOpen = true,
  size = "md",
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const s = sizes[size];

  return (
    <div className={`w-full ${classNames ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-4 w-full text-left ${s.title} font-semibold text-muted-foreground tracking-widest ${s.py} hover:text-foreground transition-colors cursor-pointer`}
      >
        <svg
          width={s.svgSize}
          height={s.svgSize}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
          aria-hidden="true"
        >
          <line
            x1="6"
            y1="1"
            x2="6"
            y2="11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className={`transition-transform duration-300 transform-fill origin-center ${open ? "scale-y-0" : "scale-y-100"}`}
          />
          <line
            x1="1"
            y1="6"
            x2="11"
            y2="6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col text-foreground">
          <span>{title}</span>
          {subtitle && (
            <span
              className={`${s.subtitle} normal-case tracking-normal font-normal text-muted-foreground`}
            >
              {subtitle}
            </span>
          )}
        </div>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className={`mt-1 flex flex-col ${s.gap}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
