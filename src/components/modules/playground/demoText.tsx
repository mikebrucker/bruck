"use client";

import { DemoControl } from "@/components/modules/playground/demoControl";
import { Input } from "@/components/ui/input";

interface DemoTextProps {
  label: string;
  hint?: string;
  value: string;
  placeholder?: string;
  stacked?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

function DemoText({ label, hint, value, placeholder, stacked, readOnly, onChange }: DemoTextProps) {
  return (
    <DemoControl label={label} hint={hint} stacked={stacked}>
      <Input
        size="sm"
        className={stacked ? "w-full" : "max-w-36"}
        readOnly={readOnly}
        value={value}
        aria-label={label}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </DemoControl>
  );
}

export { DemoText };
