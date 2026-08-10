"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Switch } from "@/components/ui/switch";

function SwitchDemo() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Switch"
      description={t(($) => $.playground.demos.switch.description)}
      controls={
        <>
          <DemoSwitch label="checked" checked={checked} onCheckedChange={setChecked} />
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
      <div className="flex items-center gap-2">
        <Switch
          id="playground-switch-demo"
          checked={checked}
          disabled={disabled}
          className={classNames}
          onCheckedChange={setChecked}
        />
        <label htmlFor="playground-switch-demo" className="text-sm font-medium">
          {t(($) => $.playground.demos.switch.label)}
        </label>
      </div>
    </DemoCard>
  );
}

export { SwitchDemo };
