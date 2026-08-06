"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

type TooltipProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function Tooltip({ trigger, children, className }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild onClick={(e) => e.currentTarget.focus()}>
          {trigger}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={8}
            className={cn(
              "z-9999 rounded-secondary border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-[0_0_8px_2px_rgba(0,0,0,0.4),0_4px_6px_-2px_rgba(0,0,0,0.4)] dark:shadow-[0_0_8px_2px_rgba(0,0,0,0.75),0_4px_6px_-2px_rgba(0,0,0,0.75)] outline-none",
              className,
            )}
          >
            {children}
            <TooltipPrimitive.Arrow className="fill-popover" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export { Tooltip };
