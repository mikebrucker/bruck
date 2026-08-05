import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-md text-sm outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
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
        default: "min-h-16 px-3 py-2",
        xs: "min-h-10 px-2.5 py-1.5 text-xs",
        sm: "min-h-12 px-3 py-1.5",
        lg: "min-h-24 px-4 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Textarea({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      data-variant={variant}
      data-size={size}
      className={cn(textareaVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Textarea, textareaVariants };
