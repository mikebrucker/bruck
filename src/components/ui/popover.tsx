"use client";

import { Close } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Popover as PopoverPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  useCloseButton?: boolean;
};

function Popover({ trigger, children, className, useCloseButton }: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="end"
          className={cn(
            "relative z-9999 rounded-lg border border-border bg-popover text-popover-foreground shadow-md outline-none",
            className,
          )}
        >
          {useCloseButton ? (
            <div className="flex justify-end w-full">
              <PopoverPrimitive.Close
                className="cursor-pointer rounded-md p-1 hover:bg-accent"
                aria-label="Close"
              >
                <HugeiconsIcon icon={Close} className="size-5" />
              </PopoverPrimitive.Close>
            </div>
          ) : null}
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { Popover };
