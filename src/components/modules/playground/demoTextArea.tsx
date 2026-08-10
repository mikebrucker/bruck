"use client";

import { DemoControl } from "@/components/modules/playground/demoControl";
import { Textarea } from "@/components/ui/textarea";

interface DemoTextAreaProps {
  label: string;
  value: string;
  stacked?: boolean;
  rows?: number;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

function DemoTextArea({ label, value, stacked, rows = 3, readOnly, onChange }: DemoTextAreaProps) {
  return (
    <DemoControl label={label} stacked={stacked}>
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
