"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoNumber } from "@/components/modules/playground/demoNumber";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Progress } from "@/components/ui/progress";

/** Playground-only: how often the running bar ticks, and how many ticks fill it once. */
const TICK_MS = 400;
const TICKS_PER_RUN = 20;

function ProgressDemo() {
  const { t } = useTranslation();
  const [value, setValue] = useState(40);
  const [max, setMax] = useState(100);
  const [running, setRunning] = useState(false);
  const [indicatorClassNames, setIndicatorClassNames] = useState("");
  const [classNames, setClassNames] = useState("");

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setValue((current) => (current >= max ? 0 : Math.min(current + max / TICKS_PER_RUN, max)));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running, max]);

  return (
    <DemoCard
      name="Progress"
      description={t(($) => $.playground.demos.progress.description)}
      controls={
        <>
          <DemoNumber label="value" value={value} onChange={setValue} />
          <DemoNumber label="max" value={max} onChange={setMax} />
          <DemoSwitch label="running" checked={running} onCheckedChange={setRunning} />
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
