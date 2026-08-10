"use client";

import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Select } from "@/components/ui/select";
import type { Genre } from "@/types/album";
import type { PropOptions } from "@/types/playground";

const options: Array<{ value: string; label: Genre }> = [
  { value: "acid", label: "Progressive Metal" },
  { value: "bebop", label: "Technical Death Metal" },
  { value: "cumbia", label: "Alternative Metal" },
];

const SelectVariants: PropOptions<NonNullable<ComponentProps<typeof Select>["variant"]>> = {
  default: "default",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
  keyboard: "keyboard",
};

const SelectSizes: PropOptions<NonNullable<ComponentProps<typeof Select>["size"]>> = {
  default: "default",
  xs: "xs",
  sm: "sm",
  lg: "lg",
};

function SelectDemo() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState(SelectVariants.default);
  const [size, setSize] = useState(SelectSizes.default);
  const [placeholder, setPlaceholder] = useDemoState(
    t(($) => $.playground.demos.select.placeholder),
  );
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Select"
      description={t(($) => $.playground.demos.select.description)}
      controls={
        <>
          <DemoSelect
            label="variant"
            options={SelectVariants}
            value={variant}
            onChange={setVariant}
          />
          <DemoSelect label="size" options={SelectSizes} value={size} onChange={setSize} />
          <DemoText label="placeholder" value={placeholder} onChange={setPlaceholder} />
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
      <Select
        variant={variant}
        size={size}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        value={value === "" ? undefined : value}
        className={classNames}
        onValueChange={setValue}
      />
    </DemoCard>
  );
}

export { SelectDemo };
