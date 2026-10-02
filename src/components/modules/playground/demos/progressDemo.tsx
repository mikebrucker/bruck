"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoNumber } from "@/components/modules/playground/demoNumber";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Progress } from "@/components/ui/progress";

function ProgressDemo() {
  const { t } = useTranslation();
  const [value, setValue] = useState(40);
  const [max, setMax] = useState(100);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(1);
  const [speed, setSpeed] = useState(250);
  const [indicatorClassNames, setIndicatorClassNames] = useState("");
  const [classNames, setClassNames] = useState("");

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setValue((current) => (current >= max ? 0 : Math.min(current + step, max)));
    }, speed);
    return () => clearInterval(interval);
  }, [running, max, step, speed]);

  return (
    <DemoCard
      name="Progress"
      description={t(($) => $.playground.demos.progress.description)}
      controls={
        <>
          <DemoNumber label="value" value={value} onChange={setValue} min={0} />
          <DemoNumber label="max" value={max} onChange={setMax} min={1} />
          <DemoSwitch
            label="running"
            hint={t(($) => $.playground.demo_only)}
            checked={running}
            onCheckedChange={setRunning}
          />
          <DemoNumber
            label="step"
            hint={t(($) => $.playground.demo_only)}
            value={step}
            onChange={setStep}
            step={1}
            min={1}
            max={max}
            disabled={!running}
          />
          <DemoNumber
            label="speed"
            hint={`${t(($) => $.playground.milliseconds)}, ${t(($) => $.playground.demo_only)}`}
            value={speed}
            onChange={setSpeed}
            disabled={!running}
            min={1}
            max={1000}
          />
          <DemoText
            placeholder="Tailwind classNames"
            label="indicatorClassName"
            value={indicatorClassNames}
            onChange={setIndicatorClassNames}
            stacked
          />
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
        <Progress
          value={value}
          max={max}
          indicatorClassName={indicatorClassNames}
          className={classNames}
        />
        <p className="text-center text-sm font-mono text-muted-foreground">
          {`${Math.round(value * 100) / 100} / ${max}`}
        </p>
      </div>
    </DemoCard>
  );
}

export { ProgressDemo };
