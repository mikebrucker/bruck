"use client";

import { Close } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Popover as PopoverPrimitive } from "radix-ui";
import type * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  useCloseButton?: boolean;
};

function Popover({ trigger, children, className, useCloseButton }: PopoverProps) {
  const { t } = useTranslation();
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="end"
          className={cn(
            "relative z-9999 rounded-primary border border-border bg-popover text-popover-foreground shadow-[0_0_8px_2px_rgba(0,0,0,0.4),0_4px_6px_-2px_rgba(0,0,0,0.4)] dark:shadow-[0_0_8px_2px_rgba(0,0,0,0.75),0_4px_6px_-2px_rgba(0,0,0,0.75)] outline-none",
            className,
          )}
        >
          {useCloseButton ? (
            <div className="flex justify-end w-full">
              <PopoverPrimitive.Close
                className="cursor-pointer rounded-secondary p-2 hover:bg-accent"
                aria-label={t(($) => $.ariaLabels.close)}
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
