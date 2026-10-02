import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DemoControlProps {
  label: string;
  hint?: string;
  htmlFor?: string;
  stacked?: boolean;
  children: ReactNode;
}

function DemoControl({ label, hint, htmlFor, stacked, children }: DemoControlProps) {
  const labelClassName = "text-sm font-medium font-mono text-foreground";
  return (
    <div
      className={cn(
        "flex gap-3 min-h-9",
        stacked ? "flex-col items-stretch gap-1.5" : "items-center justify-between",
      )}
    >
      <div className="flex flex-col">
        {htmlFor ? (
          <label htmlFor={htmlFor} className={labelClassName}>
            {label}
          </label>
        ) : (
          <p className={labelClassName}>{label}</p>
        )}
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

export { DemoControl };
