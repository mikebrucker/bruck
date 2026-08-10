"use client";

import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoNumber } from "@/components/modules/playground/demoNumber";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Accordion } from "@/components/ui/accordion";
import type { PropOptions } from "@/types/playground";

const AccordionSizes: PropOptions<NonNullable<ComponentProps<typeof Accordion>["size"]>> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  "2xl": "2xl",
};

function AccordionDemo() {
  const { t } = useTranslation();
  const [size, setSize] = useState(AccordionSizes.md);
  const [subtitle, setSubtitle] = useDemoState(t(($) => $.playground.demos.accordion.subtitle));
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [duration, setDuration] = useState(300);
  const [classNames, setClassNames] = useState("bg-card rounded-secondary px-4");

  return (
    <DemoCard
      name="Accordion"
      description={t(($) => $.playground.demos.accordion.description)}
      controls={
        <>
          <DemoSelect label="size" options={AccordionSizes} value={size} onChange={setSize} />
          <DemoText label="subtitle" value={subtitle} onChange={setSubtitle} />
          <DemoSwitch label="defaultOpen" checked={defaultOpen} onCheckedChange={setDefaultOpen} />
          <DemoNumber label="duration" value={duration} onChange={setDuration} min={0} step={50} />
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
      <Accordion
        // defaultOpen only reads on mount, so remount when it or the duration changes.
        key={`${defaultOpen}-${duration}`}
        title={t(($) => $.playground.demos.accordion.title)}
        subtitle={subtitle === "" ? undefined : subtitle}
        size={size}
        defaultOpen={defaultOpen}
        duration={duration}
        classNames={classNames}
      >
        <p className="text-sm text-muted-foreground">
          {t(($) => $.playground.demos.accordion.children)}
        </p>
        <p className="text-sm text-muted-foreground">
          {t(($) => $.playground.demos.accordion.item, { number: 1 })}
        </p>
        <p className="text-sm text-muted-foreground">
          {t(($) => $.playground.demos.accordion.item, { number: 2 })}
        </p>
        <p className="text-sm text-muted-foreground pb-2">
          {t(($) => $.playground.demos.accordion.item, { number: 3 })}
        </p>
      </Accordion>
    </DemoCard>
  );
}

export { AccordionDemo };
