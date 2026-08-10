"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoNumber } from "@/components/modules/playground/demoNumber";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Slider } from "@/components/ui/slider";

/** Playground-only: `Slider` derives its thumb count from the length of the value tuple. */
const SliderThumbCounts = {
  one: "one",
  two: "two",
} as const;
type SliderThumbCount = keyof typeof SliderThumbCounts;

function SliderDemo() {
  const { t } = useTranslation();
  const [thumbs, setThumbs] = useState<SliderThumbCount>(SliderThumbCounts.one);
  const [single, setSingle] = useState<[number]>([40]);
  const [range, setRange] = useState<[number, number]>([20, 70]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [step, setStep] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  const isRange = thumbs === SliderThumbCounts.two;

  return (
    <DemoCard
      name="Slider"
      description={t(($) => $.playground.demos.slider.description)}
      controls={
        <>
          <DemoSelect
            label="thumbs"
            options={SliderThumbCounts}
            value={thumbs}
            onChange={setThumbs}
          />
          <DemoNumber label="min" value={min} onChange={setMin} />
          <DemoNumber label="max" value={max} onChange={setMax} />
          <DemoNumber label="step" value={step} onChange={setStep} min={1} />
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
      <div className="flex w-full flex-col gap-3">
        {isRange ? (
          <Slider
            value={range}
            onValueChange={(next) => setRange(next.length === 1 ? [next[0], next[0]] : next)}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={classNames}
          />
        ) : (
          <Slider
            value={single}
            onValueChange={(next) => setSingle([next[0]])}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={classNames}
          />
        )}
        <p className="text-center text-sm font-mono text-muted-foreground">
          {isRange ? `[${range[0]}, ${range[1]}]` : `[${single[0]}]`}
        </p>
      </div>
    </DemoCard>
  );
}

export { SliderDemo };
