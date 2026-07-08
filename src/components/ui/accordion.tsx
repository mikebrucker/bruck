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
  duration?: number;
  actionButton?: React.ReactNode;
};

export function Accordion({
  title,
  subtitle,
  children,
  classNames,
  defaultOpen = true,
  size = "md",
  duration = 300,
  actionButton,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const s = sizes[size];

  return (
    <div className={`w-full ${classNames ?? ""}`}>
      <div className="flex items-center w-full">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex flex-1 min-w-0 p-2 items-center gap-4 text-left ${s.title} font-semibold text-muted-foreground tracking-widest ${s.py} hover:text-foreground transition-colors cursor-pointer`}
        >
          <svg
            width={s.svgSize}
            height={s.svgSize}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 transition-transform ease-in-out origin-center ${open ? "rotate-0" : "rotate-180"}`}
            style={{ transitionDuration: `${duration}ms` }}
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
              className={`transition-transform transform-fill ease-in-out origin-center ${open ? "scale-y-0" : "scale-y-100"}`}
              style={{ transitionDuration: `${duration}ms` }}
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
          <div className="flex flex-col text-foreground min-w-0">
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
        {actionButton ? <div className="shrink-0 pr-2">{actionButton}</div> : null}
      </div>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] ease-in-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
        style={{ transitionDuration: `${duration}ms` }}
      >
        <div className="min-h-0">
          <div className={`mt-1 flex flex-col ${s.gap}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}
