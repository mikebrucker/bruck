"use client";

import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

type SliderValue = [number] | [number, number];

/** Evenly spaced numeric range, or an explicit ascending list of the only values the thumbs may take. */
type SliderScale =
  | {
      min: number;
      max: number;
      step?: number;
      steps?: never; // X
      showSteps?: boolean;
    }
  | {
      min?: never; // X
      max?: never; // X
      step?: never; // X
      steps: Array<number>;
      /** Draw a tick on the track at every entry in `steps`. */
      showSteps?: boolean;
    };

type SliderProps = SliderScale & {
  value: SliderValue;
  onValueChange: (value: SliderValue) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  thumbLabels?: Array<string>;
};

/** Index of the entry in `steps` closest to `value`, so an out-of-scale value still lands on a real stop. */
function nearestIndex(steps: Array<number>, value: number) {
  let nearest = 0;
  for (let i = 1; i < steps.length; i++) {
    if (Math.abs(steps[i] - value) < Math.abs(steps[nearest] - value)) nearest = i;
  }
  return nearest;
}

function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  steps,
  showSteps,
  disabled,
  className,
  label,
  thumbLabels,
}: SliderProps) {
  // With an explicit scale the track runs over indices, so uneven gaps between values render evenly.
  const scale = steps !== undefined && steps.length > 0 ? steps : undefined;
  const toTrack = (v: number) => (scale ? nearestIndex(scale, v) : v);
  const fromTrack = (v: number) => (scale ? scale[v] : v);
  const trackValue: SliderValue =
    value.length === 1 ? [toTrack(value[0])] : [toTrack(value[0]), toTrack(value[1])];

  // One percentage per selectable stop; empty unless showSteps, so the ticks just don't render.
  const tickPositions = (() => {
    if (!showSteps) return [];
    if (scale) return scale.map((_, i) => (scale.length > 1 ? (i / (scale.length - 1)) * 100 : 50));
    const span = max - min;
    if (span <= 0) return [50];
    const count = Math.floor(span / step);
    return Array.from({ length: count + 1 }, (_, i) => (Math.min(i * step, span) / span) * 100);
  })();

  /**
   * Radix nudges each thumb inward so it never overhangs the track: half a thumb right at 0%,
   * nothing at 50%, half a thumb left at 100%. Ticks copy it or they drift off the thumb at the ends.
   */
  const thumbSize = 16;
  const tickOffset = (percent: number) => thumbSize / 2 - (percent / 100) * thumbSize;

  return (
    <SliderPrimitive.Root
      value={trackValue}
      onValueChange={(next) =>
        onValueChange(
          value.length === 1 ? [fromTrack(next[0])] : [fromTrack(next[0]), fromTrack(next[1])],
        )
      }
      min={scale ? 0 : min}
      max={scale ? scale.length - 1 : max}
      step={scale ? 1 : step}
      disabled={disabled}
      minStepsBetweenThumbs={1}
      className={cn(
        "relative flex w-full touch-none items-center select-none h-5 cursor-pointer data-disabled:cursor-not-allowed",
        className,
      )}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full rounded-full bg-linear-to-r from-theme-300 to-theme-700" />
        {tickPositions.map((left) => (
          <span
            key={left}
            aria-hidden="true"
            className="absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border"
            style={{ left: `calc(${left}% + ${tickOffset(left)}px)` }}
          />
        ))}
      </SliderPrimitive.Track>
      {value.map((_, i) => (
        <SliderPrimitive.Thumb
          // biome-ignore lint/suspicious/noArrayIndexKey: thumb count is fixed by the value tuple length (1 or 2), order never changes
          key={i}
          aria-label={thumbLabels?.[i] ?? label}
          className={cn(
            "block size-4 shrink-0 rounded-full border-2 border-background shadow transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-disabled:pointer-events-none data-disabled:opacity-50",
            i === 0 ? "bg-theme-300" : "bg-theme-700",
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
