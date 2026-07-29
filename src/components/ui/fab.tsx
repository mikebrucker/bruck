import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

const fabVariants = cva(
  "group/fab fixed z-50 inline-flex shrink-0 items-center justify-center rounded-lg shadow-lg outline-none select-none cursor-pointer transition-all duration-300 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
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
        default: "bottom-20 right-4 sm:bottom-24 sm:right-6",
        "bottom-left": "bottom-20 left-4 sm:bottom-24 sm:left-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      position: "default",
    },
  },
);

function Fab({
  className,
  variant = "default",
  size = "default",
  position = "default",
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
