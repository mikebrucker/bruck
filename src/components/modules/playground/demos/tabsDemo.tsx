"use client";

import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoText } from "@/components/modules/playground/demoText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PropOptions } from "@/types/playground";

/** Playground-only: the value stays a stable slug so the visible label can be translated. */
const TabsSections = {
  bands: "bands",
  stages: "stages",
  vendors: "vendors",
} as const;

const TabsOrientations: PropOptions<NonNullable<ComponentProps<typeof Tabs>["orientation"]>> = {
  horizontal: "horizontal",
  vertical: "vertical",
};

const TabsActivationModes: PropOptions<NonNullable<ComponentProps<typeof Tabs>["activationMode"]>> =
  {
    automatic: "automatic",
    manual: "manual",
  };

function TabsDemo() {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>(TabsSections.bands);
  const [orientation, setOrientation] = useState(TabsOrientations.horizontal);
  const [activationMode, setActivationMode] = useState(TabsActivationModes.automatic);
  const [classNames, setClassNames] = useState("");

  const isVertical = orientation === TabsOrientations.vertical;

  return (
    <DemoCard
      name="Tabs"
      description={t(($) => $.playground.demos.tabs.description)}
      controls={
        <>
          <DemoSelect
            label="orientation"
            options={TabsOrientations}
            value={orientation}
            onChange={setOrientation}
          />
          <DemoSelect
            label="activationMode"
            options={TabsActivationModes}
            value={activationMode}
            onChange={setActivationMode}
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
      <Tabs
        value={value}
        onValueChange={setValue}
        orientation={orientation}
        activationMode={activationMode}
        className={cn(isVertical ? "flex w-full gap-4" : "flex w-full flex-col gap-3", classNames)}
      >
        <TabsList className={cn("bg-card", isVertical ? "flex-col items-stretch" : null)}>
          {Object.values(TabsSections).map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {t(($) => $.playground.demos.tabs[tab])}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.values(TabsSections).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <p className="text-sm text-muted-foreground">
              {t(($) => $.playground.demos.tabs.panel, {
                name: t(($) => $.playground.demos.tabs[tab]),
              })}
            </p>
          </TabsContent>
        ))}
      </Tabs>
    </DemoCard>
  );
}

export { TabsDemo };
