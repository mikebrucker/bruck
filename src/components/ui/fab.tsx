import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

const fabVariants = cva(
  "group/fab fixed z-50 inline-flex shrink-0 items-center justify-center rounded-primary shadow-[0_6px_16px_-2px_rgb(0_0_0/0.30),0_3px_6px_-2px_rgb(0_0_0/0.20)] dark:shadow-[0_6px_16px_-2px_rgb(0_0_0/0.45),0_3px_6px_-2px_rgb(0_0_0/0.30)] outline-none select-none cursor-pointer transition-all duration-300 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border border-border bg-card text-card-foreground hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-border bg-input/30 hover:bg-input/50 hover:text-foreground",
      },
      size: {
        default: "size-12 [&_svg:not([class*='size-'])]:size-6",
        sm: "size-10 [&_svg:not([class*='size-'])]:size-5",
        lg: "size-14 [&_svg:not([class*='size-'])]:size-7",
      },
      position: {
        "bottom-right": "bottom-12 right-4 sm:bottom-14 lg:bottom-16 sm:right-5 lg:right-6",
        "bottom-left": "bottom-12 left-4 sm:bottom-14 lg:bottom-16 sm:left-5 lg:left-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "bottom-right",
    },
  },
);

function Fab({
  className,
  variant = "default",
  size = "default",
  position = "bottom-right",
  visible = true,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof fabVariants> & {
    visible?: boolean;
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="fab"
      data-variant={variant}
      data-size={size}
      data-position={position}
      data-visible={visible}
      aria-hidden={visible ? undefined : true}
      tabIndex={visible ? undefined : -1}
      className={cn(
        fabVariants({ variant, size, position }),
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-90 opacity-0",
        className,
      )}
      {...props}
    />
  );
}

export { Fab, fabVariants };
