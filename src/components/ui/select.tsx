"use client";

import { ChevronDown, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Select as SelectPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

const variantColors = {
  default: "bg-primary text-primary-foreground",
  outline: "border-border bg-input/30 text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "text-foreground",
} as const;

const selectVariants = cva(
  "inline-flex min-w-40 shrink-0 items-center justify-between rounded-sm bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: `${variantColors.default} hover:bg-primary/80`,
        outline: `${variantColors.outline} hover:bg-input/50`,
        secondary: `${variantColors.secondary} hover:bg-secondary/80`,
        ghost: `${variantColors.ghost} hover:bg-muted dark:hover:bg-muted/50`,
      },
      size: {
        default: "h-9 gap-1.5 px-3",
        xs: "h-6 gap-1 px-2.5 text-xs",
        sm: "h-8 gap-1 px-3",
        lg: "h-10 gap-1.5 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type Option = { value: string; label: string; icon?: React.ReactNode };

function Select({
  className,
  variant,
  size,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
}: VariantProps<typeof selectVariants> & {
  options: Array<Option>;
  className?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        data-slot="select"
        data-variant={variant}
        data-size={size}
        className={cn(selectVariants({ variant, size, className }))}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <HugeiconsIcon icon={ChevronDown} className="size-6 shrink-0" aria-hidden="true" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "relative z-9999 min-w-(--radix-select-trigger-width) overflow-hidden rounded-sm shadow-md",
            variantColors[variant ?? "default"],
            className,
          )}
        >
          <SelectPrimitive.Viewport>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-sm px-3 h-9 text-sm font-medium outline-none select-none data-highlighted:bg-theme-300 data-disabled:pointer-events-none data-disabled:opacity-50"
              >
                <SelectPrimitive.ItemText>
                  <span className="flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                </SelectPrimitive.ItemText>
                <span className="size-4 shrink-0 flex items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <HugeiconsIcon icon={Tick01Icon} className="size-6" aria-hidden="true" />
                  </SelectPrimitive.ItemIndicator>
                </span>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

export { Select };
