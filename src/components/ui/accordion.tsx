"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

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
  const s = sizes[size];
  const durationStyle = { transitionDuration: `${duration}ms` };

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultOpen ? "item" : undefined}
      className={cn("w-full", classNames)}
    >
      <AccordionPrimitive.Item value="item">
        <div className="flex items-center w-full">
          <AccordionPrimitive.Header className="flex flex-1 min-w-0">
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex flex-1 min-w-0 p-2 items-center gap-4 text-left font-semibold text-muted-foreground tracking-widest hover:text-foreground transition-colors cursor-pointer",
                s.title,
                s.py,
              )}
            >
              <svg
                width={s.svgSize}
                height={s.svgSize}
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 transition-transform ease-in-out origin-center rotate-180 group-data-[state=open]:rotate-0"
                style={durationStyle}
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
                  className="transition-transform transform-fill ease-in-out origin-center scale-y-100 group-data-[state=open]:scale-y-0"
                  style={durationStyle}
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
                {subtitle ? (
                  <span
                    className={cn(
                      "normal-case tracking-normal font-normal text-muted-foreground",
                      s.subtitle,
                    )}
                  >
                    {subtitle}
                  </span>
                ) : null}
              </div>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          {actionButton ? <div className="shrink-0 pr-2">{actionButton}</div> : null}
        </div>
        <AccordionPrimitive.Content
          forceMount
          className="grid overflow-hidden transition-[grid-template-rows] ease-in-out grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]"
          style={durationStyle}
        >
          <div className="min-h-0">
            <div className={cn("mt-1 flex flex-col", s.gap)}>{children}</div>
          </div>
        </AccordionPrimitive.Content>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
}
