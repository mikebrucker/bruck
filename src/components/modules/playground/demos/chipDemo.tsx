"use client";

import { TranslateIcon } from "@hugeicons/core-free-icons";
import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Chip } from "@/components/ui/chip";
import type { PropOptions } from "@/types/playground";

const ChipSlots: PropOptions<NonNullable<ComponentProps<typeof Chip>["slot"]>> = {
  start: "start",
  end: "end",
};

function ChipDemo() {
  const { t } = useTranslation();
  const [text, setText] = useState("i18next");
  const [slot, setSlot] = useState(ChipSlots.start);
  const [withIcon, setWithIcon] = useState(true);
  const [useIconThemeColor, setUseIconThemeColor] = useState(true);
  const [classNames, setClassNames] = useState("bg-card");

  return (
    <DemoCard
      name="Chip"
      description={t(($) => $.playground.demos.chip.description)}
      controls={
        <>
          <DemoText label="text" value={text} onChange={setText} />
          <DemoSwitch label="with icon" checked={withIcon} onCheckedChange={setWithIcon} />
          <DemoSelect label="slot" options={ChipSlots} value={slot} onChange={setSlot} />
          <DemoSwitch
            label="useIconThemeColor"
            checked={useIconThemeColor}
            onCheckedChange={setUseIconThemeColor}
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
      <Chip
        text={text}
        slot={slot}
        icon={withIcon ? TranslateIcon : undefined}
        useIconThemeColor={useIconThemeColor}
        className={classNames}
      />
    </DemoCard>
  );
}

export { ChipDemo };
