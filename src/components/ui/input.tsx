import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-secondary text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground placeholder:text-card-foreground/60",
        outline: "border border-border bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground placeholder:text-secondary-foreground/60",
        ghost: "bg-transparent",
      },
      size: {
        default: "h-9 px-3",
        xs: "h-6 px-2.5 text-xs",
        sm: "h-8 px-3",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

/**
 * The native `size` attribute is a number, and intersecting it with the cva size
 * scale leaves a prop nothing can satisfy, so it is omitted: the variant wins.
 */
function Input({
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      data-slot="input"
      data-variant={variant}
      data-size={size}
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Input, inputVariants };
