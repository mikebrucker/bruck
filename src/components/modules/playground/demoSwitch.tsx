"use client";

import { Switch } from "@mikebrucker/brucks/ui";
import { DemoControl } from "@/components/modules/playground/demoControl";

interface DemoSwitchProps {
  label: string;
  hint?: string;
  checked: boolean;
  stacked?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function DemoSwitch({ label, hint, checked, stacked, onCheckedChange }: DemoSwitchProps) {
  return (
    <DemoControl label={label} hint={hint} stacked={stacked}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </DemoControl>
  );
}

export { DemoSwitch };
