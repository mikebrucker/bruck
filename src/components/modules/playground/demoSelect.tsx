"use client";

import { DemoControl } from "@/components/modules/playground/demoControl";
import { Select } from "@/components/ui/select";
import { isKeyOf } from "@/lib/utils";

interface DemoSelectProps<TValue extends string> {
  label: string;
  options: Record<TValue, TValue>;
  value: TValue;
  stacked?: boolean;
  onChange: (value: TValue) => void;
}

function DemoSelect<TValue extends string>({
  label,
  options,
  value,
  stacked,
  onChange,
}: DemoSelectProps<TValue>) {
  return (
    <DemoControl label={label} stacked={stacked}>
      <Select
        size="sm"
        className={stacked ? "w-full" : "min-w-36"}
        options={Object.keys(options).map((option) => ({ value: option, label: option }))}
        value={value}
        onValueChange={(next) => {
          if (isKeyOf(options, next)) onChange(next);
        }}
      />
    </DemoControl>
  );
}

export { DemoSelect };
