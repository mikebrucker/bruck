import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DemoControlProps {
  label: string;
  stacked?: boolean;
  children: ReactNode;
}

function DemoControl({ label, stacked, children }: DemoControlProps) {
  return (
    <div
      className={cn(
        "flex gap-3 min-h-9",
        stacked ? "flex-col items-stretch gap-1.5" : "items-center justify-between",
      )}
    >
      <p className="text-sm font-medium font-mono text-foreground">{label}</p>
      {children}
    </div>
  );
}

export { DemoControl };
