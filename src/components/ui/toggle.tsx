import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-sm px-2.5 text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-muted hover:text-foreground",
        outline:
          "border border-border bg-input/30 hover:bg-input/50 hover:text-foreground data-[state=on]:border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    icon: IconSvgElement;
  }) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      data-variant={variant}
      className={cn(toggleVariants({ variant, className }))}
      {...props}
    >
      <HugeiconsIcon icon={icon} className="size-5" />
      {children}
    </TogglePrimitive.Root>
  );
}

export { Toggle, toggleVariants };
