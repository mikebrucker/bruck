"use client";

import { ChevronDown, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Select as SelectPrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

const variantColors = {
  default: "bg-card text-card-foreground",
  outline: "border border-border bg-input/30 text-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  ghost: "text-foreground",
  keyboard: "bg-transparent shadow-none",
} as const;

const selectVariants = cva(
  "inline-flex min-w-40 shrink-0 items-center justify-between rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: `${variantColors.default} hover:bg-card/80`,
        outline: `${variantColors.outline} hover:bg-input/50`,
        secondary: `${variantColors.secondary} hover:bg-secondary/80`,
        ghost: `${variantColors.ghost} hover:bg-muted dark:hover:bg-muted/50`,
        keyboard:
          "min-h-[44px] rounded-[10px] [border-style:outset] border-[var(--keycap-edge)] [border-width:8px_10px_10px_8px] bg-[var(--keycap-face)] text-xs text-[var(--keycap-text)] shadow-[0_5px_10px_2px_rgba(0,0,0,0.45)] transition-[box-shadow,transform,border-width] duration-100 ease-out active:translate-y-[3px] active:brightness-95 active:[border-style:inset] active:[border-width:8px_8px_5px_8px] active:shadow-[inset_0_2px_5px_0_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.45)] data-[state=open]:translate-y-[3px] data-[state=open]:brightness-95 data-[state=open]:[border-style:inset] data-[state=open]:[border-width:8px_8px_5px_8px] data-[state=open]:shadow-[inset_0_2px_5px_0_rgba(0,0,0,0.3),0_1px_3px_1px_rgba(0,0,0,0.45)]",
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
  contentClassName,
  variant,
  size,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  placeholder,
  id,
}: VariantProps<typeof selectVariants> & {
  options: Array<Option>;
  className?: string;
  contentClassName?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}) {
  const isKeyboard = variant === "keyboard";
  return (
    <SelectPrimitive.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
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
            "relative z-9999 min-w-(--radix-select-trigger-width) max-h-(--radix-select-content-available-height) rounded-md shadow-md",
            isKeyboard ? "overflow-y-auto p-1" : "overflow-hidden",
            variantColors[variant ?? "default"],
            contentClassName,
          )}
        >
          <SelectPrimitive.Viewport
            className={cn("max-h-full", isKeyboard ? "flex flex-col gap-2" : "overflow-y-auto")}
          >
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-1.5 outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50",
                  isKeyboard
                    ? "rounded-[10px] [border-style:outset] border-(--keycap-edge,rgb(240,240,203)) [border-width:6px_8px_8px_6px] bg-(--keycap-face,beige) px-3 py-2 text-xs font-medium text-(--keycap-text,#3a382c) shadow-[0_4px_8px_2px_rgba(0,0,0,0.4)] transition-[box-shadow,transform,border-width] duration-100 ease-out data-highlighted:translate-y-0.5 data-highlighted:brightness-95 data-highlighted:[border-style:inset] data-highlighted:[border-width:6px_6px_4px_6px] data-highlighted:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3),0_1px_2px_1px_rgba(0,0,0,0.4)]"
                    : "px-3 h-9 text-sm font-medium not-data-highlighted:even:bg-black/5 dark:not-data-highlighted:even:bg-white/5 data-highlighted:bg-theme-300",
                )}
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
