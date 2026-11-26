"use client";

import { Textarea } from "@mikebrucker/brucks/ui";
import { DemoControl } from "@/components/modules/playground/demoControl";

interface DemoTextAreaProps {
  label: string;
  hint?: string;
  value: string;
  stacked?: boolean;
  rows?: number;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

function DemoTextArea({
  label,
  hint,
  value,
  stacked,
  rows = 3,
  readOnly,
  onChange,
}: DemoTextAreaProps) {
  return (
    <DemoControl label={label} hint={hint} stacked={stacked}>
      <Textarea
        size="xs"
        className={stacked ? "w-full" : "max-w-36"}
        rows={rows}
        readOnly={readOnly}
        value={value}
        aria-label={label}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </DemoControl>
  );
}

export { DemoTextArea };
