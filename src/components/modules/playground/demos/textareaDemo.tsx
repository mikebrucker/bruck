"use client";

import type { VariantProps } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoNumber } from "@/components/modules/playground/demoNumber";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Textarea, type textareaVariants } from "@/components/ui/textarea";
import type { PropOptions } from "@/types/playground";

const TextareaVariants: PropOptions<NonNullable<VariantProps<typeof textareaVariants>["variant"]>> =
  {
    default: "default",
    outline: "outline",
    secondary: "secondary",
    ghost: "ghost",
  };

const TextareaSizes: PropOptions<NonNullable<VariantProps<typeof textareaVariants>["size"]>> = {
  default: "default",
  xs: "xs",
  sm: "sm",
  lg: "lg",
};

function TextareaDemo() {
  const { t } = useTranslation();
  const [variant, setVariant] = useState(TextareaVariants.default);
  const [size, setSize] = useState(TextareaSizes.default);
  const [placeholder, setPlaceholder] = useDemoState(
    t(($) => $.playground.demos.textarea.placeholder),
  );
  const [rows, setRows] = useState(3);
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Textarea"
      description={t(($) => $.playground.demos.textarea.description)}
      controls={
        <>
          <DemoSelect
            label="variant"
            options={TextareaVariants}
            value={variant}
            onChange={setVariant}
          />
          <DemoSelect label="size" options={TextareaSizes} value={size} onChange={setSize} />
          <DemoText label="placeholder" value={placeholder} onChange={setPlaceholder} />
          <DemoNumber label="rows" value={rows} onChange={setRows} min={1} />
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
      <Textarea
        variant={variant}
        size={size}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={t(($) => $.playground.aria.demo_textarea)}
        value={value}
        className={classNames}
        onChange={(event) => setValue(event.target.value)}
      />
    </DemoCard>
  );
}

export { TextareaDemo };
