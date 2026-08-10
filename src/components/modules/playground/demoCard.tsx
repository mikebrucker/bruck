"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface DemoCardProps {
  name: string;
  description: string;
  controls?: ReactNode;
  children: ReactNode;
  previewClassName?: string;
}

function DemoCard({ name, description, controls, children, previewClassName }: DemoCardProps) {
  const { t } = useTranslation();
  const titleId = `playground-${name.toLowerCase()}`;

  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-3 rounded-primary bg-card border border-border p-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id={titleId} className="text-lg font-semibold font-mono text-foreground">
          {name}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className={cn("grid grid-cols-1 gap-3", controls ? "md:grid-cols-2" : null)}>
        <div className="flex flex-col gap-1.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t(($) => $.playground.preview)}
          </p>
          <div
            className={cn(
              "flex flex-1 min-h-32 items-center justify-center rounded-secondary bg-muted p-4",
              previewClassName,
            )}
          >
            {children}
          </div>
        </div>
        {controls ? (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t(($) => $.playground.props)}
            </p>
            <div className="flex flex-1 flex-col gap-2 rounded-secondary bg-muted p-3">
              {controls}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { DemoCard };
