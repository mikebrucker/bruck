"use client";

import { DemoControl } from "@/components/modules/playground/demoControl";
import { Switch } from "@/components/ui/switch";

interface DemoSwitchProps {
  label: string;
  checked: boolean;
  stacked?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function DemoSwitch({ label, checked, stacked, onCheckedChange }: DemoSwitchProps) {
  return (
    <DemoControl label={label} stacked={stacked}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
    </DemoControl>
  );
}

export { DemoSwitch };
