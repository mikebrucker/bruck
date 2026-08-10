"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";

function PopoverDemo() {
  const { t } = useTranslation();
  const [useCloseButton, setUseCloseButton] = useState(true);
  const [classNames, setClassNames] = useState("w-64 p-3");

  return (
    <DemoCard
      name="Popover"
      description={t(($) => $.playground.demos.popover.description)}
      controls={
        <>
          <DemoSwitch
            label="useCloseButton"
            checked={useCloseButton}
            onCheckedChange={setUseCloseButton}
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
      <Popover
        useCloseButton={useCloseButton}
        className={classNames}
        trigger={
          <Button type="button" variant="outline">
            {t(($) => $.playground.demos.popover.trigger)}
          </Button>
        }
      >
        <p className="px-3 pb-3 text-sm text-muted-foreground">
          {t(($) => $.playground.demos.popover.body)}
        </p>
      </Popover>
    </DemoCard>
  );
}

export { PopoverDemo };
