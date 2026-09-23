"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

/**
 * A thin bar filled to `value` of `max`. The value is clamped into range, since
 * Radix drops one outside it and a clock read between ticks runs a hair past zero.
 */
function Progress({
  className,
  indicatorClassName,
  value,
  max = 100,
  ...props
}: Omit<React.ComponentProps<typeof ProgressPrimitive.Root>, "value"> & {
  value: number;
  /** The fill's colour and transition, where the theme and a 300 ms ease are not right. */
  indicatorClassName?: string;
}) {
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.max(0, Math.min(value, safeMax));

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      value={clamped}
      max={safeMax}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full bg-theme-500 transition-transform duration-300 motion-reduce:transition-none",
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - (clamped / safeMax) * 100}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
