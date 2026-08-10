"use client";

import { DemoControl } from "@/components/modules/playground/demoControl";
import { Input } from "@/components/ui/input";

interface DemoNumberProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  stacked?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

function DemoNumber({ label, value, onChange, stacked, min, max, step }: DemoNumberProps) {
  return (
    <DemoControl label={label} stacked={stacked}>
      <Input
        type="number"
        size="sm"
        className={stacked ? "w-full" : "max-w-36"}
        value={value}
        min={min}
        max={max}
        step={step}
        aria-label={label}
        onChange={(event) => {
          const next = Number(event.target.value);
          // An empty or half-typed field parses to NaN, which would blow up any
          // duration or height the value feeds into.
          if (!Number.isNaN(next)) onChange(next);
        }}
      />
    </DemoControl>
  );
}

export { DemoNumber };
