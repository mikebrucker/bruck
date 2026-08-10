"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

function TooltipDemo() {
  const { t } = useTranslation();
  const [text, setText] = useDemoState(t(($) => $.playground.demos.tooltip.content));
  const [classNames, setClassNames] = useState("max-w-48");

  return (
    <DemoCard
      name="Tooltip"
      description={t(($) => $.playground.demos.tooltip.description)}
      controls={
        <>
          <DemoText label="children" value={text} onChange={setText} />
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
      <Tooltip
        className={classNames}
        trigger={
          <Button type="button" variant="outline">
            {t(($) => $.playground.demos.tooltip.trigger)}
          </Button>
        }
      >
        {text}
      </Tooltip>
    </DemoCard>
  );
}

export { TooltipDemo };
