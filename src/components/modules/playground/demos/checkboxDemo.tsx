"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Checkbox } from "@/components/ui/checkbox";

function CheckboxDemo() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Checkbox"
      description={t(($) => $.playground.demos.checkbox.description)}
      controls={
        <>
          <DemoSwitch label="checked" checked={checked} onCheckedChange={setChecked} />
          <DemoSwitch
            label="indeterminate"
            checked={indeterminate}
            onCheckedChange={setIndeterminate}
          />
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
        <Checkbox
          id="playground-checkbox-demo"
          checked={indeterminate ? "indeterminate" : checked}
          disabled={disabled}
          className={classNames}
          onCheckedChange={(next) => {
            setIndeterminate(false);
            setChecked(next === true);
          }}
        />
        <label htmlFor="playground-checkbox-demo" className="text-sm font-medium">
          {t(($) => $.playground.demos.checkbox.label)}
        </label>
      </div>
    </DemoCard>
  );
}

export { CheckboxDemo };
