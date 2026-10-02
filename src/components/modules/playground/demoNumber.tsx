"use client";

import { DemoControl } from "@/components/modules/playground/demoControl";
import { Input } from "@/components/ui/input";

interface DemoNumberProps {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  stacked?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

function DemoNumber({
  label,
  hint,
  value,
  onChange,
  stacked,
  min,
  max,
  step,
  disabled,
}: DemoNumberProps) {
  return (
    <DemoControl label={label} hint={hint} stacked={stacked}>
      <Input
        type="number"
        size="sm"
        className={stacked ? "w-full" : "max-w-36"}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isNaN(next)) return;
          onChange(max === undefined ? next : Math.min(next, max));
        }}
        onBlur={() => {
          if (min !== undefined && value < min) onChange(min);
        }}
      />
    </DemoControl>
  );
}

export { DemoNumber };
