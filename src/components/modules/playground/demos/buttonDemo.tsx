"use client";

import { AmericanFootballIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { VariantProps } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { PropOptions } from "@/types/playground";

const ButtonVariants: PropOptions<NonNullable<VariantProps<typeof buttonVariants>["variant"]>> = {
  default: "default",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "destructive",
  link: "link",
  keyboardModern: "keyboardModern",
  keyboard: "keyboard",
};

const ButtonSizes: PropOptions<NonNullable<VariantProps<typeof buttonVariants>["size"]>> = {
  default: "default",
  xs: "xs",
  sm: "sm",
  lg: "lg",
  icon: "icon",
  "icon-xs": "icon-xs",
  "icon-sm": "icon-sm",
  "icon-lg": "icon-lg",
};

function ButtonDemo() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState(ButtonVariants.default);
  const [size, setSize] = useState(ButtonSizes.default);
  const [label, setLabel] = useDemoState(t(($) => $.playground.demos.button.children));
  const [icon, setIcon] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  const isIconOnly = size.startsWith("icon");

  return (
    <DemoCard
      name="Button"
      description={t(($) => $.playground.demos.button.description)}
      controls={
        <>
          <DemoSelect
            label="variant"
            options={ButtonVariants}
            value={variant}
            onChange={setVariant}
          />
          <DemoSelect label="size" options={ButtonSizes} value={size} onChange={setSize} />
          <DemoText label="children" value={label} onChange={setLabel} />
          <DemoSwitch label="with icon" checked={icon} onCheckedChange={setIcon} />
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
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={disabled}
        aria-label={t(($) => $.playground.aria.demo_button)}
        className={classNames}
      >
        {icon || isIconOnly ? (
          <HugeiconsIcon className="size-5" icon={AmericanFootballIcon} data-icon="inline-start" />
        ) : null}
        {isIconOnly ? null : label}
      </Button>
    </DemoCard>
  );
}

export { ButtonDemo };
