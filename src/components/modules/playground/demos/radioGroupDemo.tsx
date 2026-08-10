"use client";

import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import { cn } from "@/lib/utils";
import type { PropOptions } from "@/types/playground";

/** Playground-only: the value stays a stable slug so the visible label can be translated. */
const RadioFormats = {
  vinyl: "vinyl",
  cassette: "cassette",
  cd: "cd",
} as const;

const RadioGroupOrientations: PropOptions<
  NonNullable<ComponentProps<typeof RadioGroup>["orientation"]>
> = {
  horizontal: "horizontal",
  vertical: "vertical",
};

function RadioGroupDemo() {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>(RadioFormats.vinyl);
  const [orientation, setOrientation] = useState(RadioGroupOrientations.vertical);
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="RadioGroup"
      description={t(($) => $.playground.demos.radio_group.description)}
      controls={
        <>
          <DemoSelect
            label="orientation"
            options={RadioGroupOrientations}
            value={orientation}
            onChange={setOrientation}
          />
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
      <RadioGroup
        value={value}
        onValueChange={setValue}
        orientation={orientation}
        disabled={disabled}
        className={cn(
          orientation === RadioGroupOrientations.horizontal ? "flex-row gap-4" : null,
          classNames,
        )}
      >
        {Object.values(RadioFormats).map((option) => (
          <div key={option} className="flex items-center gap-2">
            <RadioGroupItem id={`playground-radio-${option}`} value={option} />
            <label htmlFor={`playground-radio-${option}`} className="text-sm font-medium">
              {t(($) => $.playground.demos.radio_group[option])}
            </label>
          </div>
        ))}
      </RadioGroup>
    </DemoCard>
  );
}

export { RadioGroupDemo };
