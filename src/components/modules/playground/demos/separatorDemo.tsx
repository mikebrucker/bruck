"use client";

import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoText } from "@/components/modules/playground/demoText";
import { Separator } from "@/components/ui/separator";
import type { PropOptions } from "@/types/playground";

const SeparatorOrientations: PropOptions<
  NonNullable<ComponentProps<typeof Separator>["orientation"]>
> = {
  horizontal: "horizontal",
  vertical: "vertical",
};

function SeparatorDemo() {
  const { t } = useTranslation();
  const [orientation, setOrientation] = useState(SeparatorOrientations.horizontal);
  const [classNames, setClassNames] = useState("");

  const isVertical = orientation === SeparatorOrientations.vertical;

  return (
    <DemoCard
      name="Separator"
      description={t(($) => $.playground.demos.separator.description)}
      controls={
        <>
          <DemoSelect
            label="orientation"
            options={SeparatorOrientations}
            value={orientation}
            onChange={setOrientation}
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
      <div
        className={
          isVertical ? "flex h-16 items-center gap-3" : "flex w-full flex-col items-center gap-3"
        }
      >
        <p className="text-sm text-muted-foreground">
          {t(($) => $.playground.demos.separator.before)}
        </p>
        <Separator orientation={orientation} className={classNames} />
        <p className="text-sm text-muted-foreground">
          {t(($) => $.playground.demos.separator.after)}
        </p>
      </div>
    </DemoCard>
  );
}

export { SeparatorDemo };
