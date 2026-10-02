"use client";

import type { CSSProperties, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsSwatchButtonProps {
  selected: boolean;
  style: CSSProperties;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

function SettingsSwatchButton({
  selected,
  style,
  onClick,
  className,
  children,
}: SettingsSwatchButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      aria-pressed={selected}
      style={style}
      className={cn(
        "relative isolate w-full h-auto aspect-4/3 after:content-[''] after:absolute after:inset-0 after:-z-10 after:transition-colors hover:after:bg-black/25 overflow-hidden hc:[&>span]:bg-background hc:[&>span]:text-foreground hc:[&>span]:px-1.5 hc:[&>span]:rounded-secondary hc:aria-pressed:outline-solid hc:aria-pressed:outline-4 hc:aria-pressed:outline-offset-2 hc:aria-pressed:outline-foreground",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export { SettingsSwatchButton };
