"use client";

import { AmericanFootballIcon, BaseballBatIcon, IceHockeyIcon } from "@hugeicons/core-free-icons";
import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { ToggleSizes, ToggleVariants } from "@/components/modules/playground/demos/toggleDemo";
import { DemoText } from "@/components/modules/playground/demoText";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { PropOptions } from "@/types/playground";

const ToggleGroupTypes: PropOptions<NonNullable<ComponentProps<typeof ToggleGroup>["type"]>> = {
  single: "single",
  multiple: "multiple",
};

function ToggleGroupDemo() {
  const { t } = useTranslation();
  const [type, setType] = useState(ToggleGroupTypes.single);
  const [variant, setVariant] = useState(ToggleVariants.outline);
  const [size, setSize] = useState(ToggleSizes["icon-lg"]);
  const [single, setSingle] = useState("football");
  const [multiple, setMultiple] = useState<Array<string>>(["football"]);
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  const isIconOnly = size.startsWith("icon");

  const items = [
    {
      value: "football",
      icon: AmericanFootballIcon,
      label: t(($) => $.playground.demos.toggle_group.football),
    },
    {
      value: "hockey",
      icon: IceHockeyIcon,
      label: t(($) => $.playground.demos.toggle_group.hockey),
    },
    {
      value: "baseball",
      icon: BaseballBatIcon,
      label: t(($) => $.playground.demos.toggle_group.baseball),
    },
  ];

  const children = items.map((item, index) => (
    <ToggleGroupItem
      key={item.value}
      value={item.value}
      icon={item.icon}
      iconClassName="size-5"
      aria-label={t(($) => $.playground.aria.demo_toggle_item, { number: index + 1 })}
    >
      {isIconOnly ? null : item.label}
    </ToggleGroupItem>
  ));

  return (
    <DemoCard
      name="ToggleGroup"
      description={t(($) => $.playground.demos.toggle_group.description)}
      controls={
        <>
          <DemoSelect label="type" options={ToggleGroupTypes} value={type} onChange={setType} />
          <DemoSelect
            label="variant"
            options={ToggleVariants}
            value={variant}
            onChange={setVariant}
          />
          <DemoSelect label="size" options={ToggleSizes} value={size} onChange={setSize} />
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
      {type === ToggleGroupTypes.single ? (
        <ToggleGroup
          type="single"
          variant={variant}
          size={size}
          disabled={disabled}
          value={single}
          className={classNames}
          onValueChange={setSingle}
        >
          {children}
        </ToggleGroup>
      ) : (
        <ToggleGroup
          type="multiple"
          variant={variant}
          size={size}
          disabled={disabled}
          value={multiple}
          className={classNames}
          onValueChange={setMultiple}
        >
          {children}
        </ToggleGroup>
      )}
    </DemoCard>
  );
}

export { ToggleGroupDemo };
