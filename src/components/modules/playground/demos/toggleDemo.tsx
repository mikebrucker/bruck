"use client";

import { PowerIcon } from "@hugeicons/core-free-icons";
import type { VariantProps } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Toggle, type toggleVariants } from "@/components/ui/toggle";
import type { PropOptions } from "@/types/playground";

/**
 * Exported for the ToggleGroup demo: the group shares the toggle variant and
 * size and pushes both down to its items, so both demos drive the same maps.
 */
const ToggleVariants: PropOptions<NonNullable<VariantProps<typeof toggleVariants>["variant"]>> = {
  default: "default",
  outline: "outline",
};

const ToggleSizes: PropOptions<NonNullable<VariantProps<typeof toggleVariants>["size"]>> = {
  default: "default",
  xs: "xs",
  sm: "sm",
  lg: "lg",
  icon: "icon",
  "icon-xs": "icon-xs",
  "icon-sm": "icon-sm",
  "icon-lg": "icon-lg",
};

function ToggleDemo() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState(ToggleVariants.outline);
  const [size, setSize] = useState(ToggleSizes.default);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useDemoState(t(($) => $.playground.demos.toggle.children));
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  const isIconOnly = size.startsWith("icon");

  return (
    <DemoCard
      name="Toggle"
      description={t(($) => $.playground.demos.toggle.description)}
      controls={
        <>
          <DemoSelect
            label="variant"
            options={ToggleVariants}
            value={variant}
            onChange={setVariant}
          />
          <DemoSelect label="size" options={ToggleSizes} value={size} onChange={setSize} />
          <DemoText label="children" value={label} onChange={setLabel} />
          <DemoSwitch label="pressed" checked={pressed} onCheckedChange={setPressed} />
          <DemoSwitch label="disabled" checked={disabled} onCheckedChange={setDisabled} />
          <DemoText
            placeholder="Tailwind classNames"
            label="classNames"
            value={classNames}
            onChange={setClassNames}
            stacked
          />
        </>
      }
    >
      <Toggle
        icon={PowerIcon}
        variant={variant}
        size={size}
        pressed={pressed}
        disabled={disabled}
        onPressedChange={setPressed}
        aria-label={t(($) => $.playground.aria.demo_toggle)}
        className={classNames}
      >
        {isIconOnly ? null : label}
      </Toggle>
    </DemoCard>
  );
}

export { ToggleDemo, ToggleSizes, ToggleVariants };
