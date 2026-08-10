"use client";

import { IceHockeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { VariantProps } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Fab, type fabVariants } from "@/components/ui/fab";
import type { PropOptions } from "@/types/playground";

const FabVariants: PropOptions<NonNullable<VariantProps<typeof fabVariants>["variant"]>> = {
  default: "default",
  secondary: "secondary",
  outline: "outline",
};

const FabSizes: PropOptions<NonNullable<VariantProps<typeof fabVariants>["size"]>> = {
  default: "default",
  sm: "sm",
  lg: "lg",
};

const FabPositions: PropOptions<NonNullable<VariantProps<typeof fabVariants>["position"]>> = {
  "bottom-right": "bottom-right",
  "bottom-left": "bottom-left",
};

function FabDemo() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState(FabVariants.default);
  const [size, setSize] = useState(FabSizes.default);
  const [position, setPosition] = useState(FabPositions["bottom-right"]);
  const [visible, setVisible] = useState(true);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Fab"
      description={t(($) => $.playground.demos.fab.description)}
      previewClassName="relative transform-gpu overflow-hidden"
      controls={
        <>
          <DemoSelect label="variant" options={FabVariants} value={variant} onChange={setVariant} />
          <DemoSelect label="size" options={FabSizes} value={size} onChange={setSize} />
          <DemoSelect
            label="position"
            options={FabPositions}
            value={position}
            onChange={setPosition}
          />
          <DemoSwitch label="visible" checked={visible} onCheckedChange={setVisible} />
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
      <Fab
        type="button"
        variant={variant}
        size={size}
        position={position}
        visible={visible}
        aria-label={t(($) => $.playground.aria.demo_button)}
        className={classNames}
      >
        <HugeiconsIcon icon={IceHockeyIcon} />
      </Fab>
    </DemoCard>
  );
}

export { FabDemo };
