"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

type SliderValue = [number] | [number, number];

type SliderProps = {
  value: SliderValue;
  onValueChange: (value: SliderValue) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  className?: string;
};

function Slider({ value, onValueChange, min, max, step = 1, disabled, className }: SliderProps) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={(next) => onValueChange(value.length === 1 ? [next[0]] : [next[0], next[1]])}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      minStepsBetweenThumbs={1}
      className={cn(
        "relative flex w-full touch-none items-center select-none h-5 cursor-pointer data-disabled:cursor-not-allowed",
        className,
      )}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-theme-500" />
      </SliderPrimitive.Track>
      {value.map((_, i) => (
        <SliderPrimitive.Thumb
          // biome-ignore lint/suspicious/noArrayIndexKey: thumb count is fixed by the value tuple length (1 or 2), order never changes
          key={i}
          className="block size-4 shrink-0 rounded-full bg-theme-500 border-2 border-background shadow transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
