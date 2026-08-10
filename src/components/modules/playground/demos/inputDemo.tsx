"use client";

import type { VariantProps } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Input, type inputVariants } from "@/components/ui/input";
import type { PropOptions } from "@/types/playground";

const InputVariants: PropOptions<NonNullable<VariantProps<typeof inputVariants>["variant"]>> = {
  default: "default",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
};

const InputSizes: PropOptions<NonNullable<VariantProps<typeof inputVariants>["size"]>> = {
  default: "default",
  xs: "xs",
  sm: "sm",
  lg: "lg",
};

function InputDemo() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState(InputVariants.default);
  const [size, setSize] = useState(InputSizes.default);
  const [placeholder, setPlaceholder] = useDemoState(
    t(($) => $.playground.demos.input.placeholder),
  );
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Input"
      description={t(($) => $.playground.demos.input.description)}
      controls={
        <>
          <DemoSelect
            label="variant"
            options={InputVariants}
            value={variant}
            onChange={setVariant}
          />
          <DemoSelect label="size" options={InputSizes} value={size} onChange={setSize} />
          <DemoText label="placeholder" value={placeholder} onChange={setPlaceholder} />
          <DemoSwitch label="disabled" checked={disabled} onCheckedChange={setDisabled} />
          <DemoSwitch label="aria-invalid" checked={invalid} onCheckedChange={setInvalid} />
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
      <Input
        variant={variant}
        size={size}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid}
        aria-label={t(($) => $.playground.aria.demo_input)}
        value={value}
        className={classNames}
        onChange={(event) => setValue(event.target.value)}
      />
    </DemoCard>
  );
}

export { InputDemo };
