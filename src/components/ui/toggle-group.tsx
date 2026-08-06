"use client";

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import type { VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import { type ComponentProps, createContext, useContext } from "react";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const ToggleGroupContext = createContext<VariantProps<typeof toggleVariants>>({
  variant: "default",
  size: "default",
});

function ToggleGroup({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "group/toggle-group flex w-fit items-center rounded-secondary isolate",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  variant,
  size,
  icon,
  iconClassName = "",
  children,
  ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants> & {
    icon?: IconSvgElement;
    iconClassName?: string;
  }) {
  const context = useContext(ToggleGroupContext);
  const resolvedVariant = variant ?? context.variant;
  const resolvedSize = size ?? context.size;

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={cn(
        toggleVariants({ variant: resolvedVariant, size: resolvedSize }),
        "rounded-none first:rounded-l-secondary last:rounded-r-secondary not-first:-ml-px hover:z-10 focus-visible:z-10 data-[state=on]:z-10",
        className,
      )}
      {...props}
    >
      {icon ? <HugeiconsIcon icon={icon} className={iconClassName} /> : null}
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
