"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

function FormDemo() {
  const { t } = useTranslation();
  const [label, setLabel] = useDemoState(t(($) => $.playground.demos.form.label));
  const [required, setRequired] = useState(true);
  const [serverInvalid, setServerInvalid] = useState(false);
  const [classNames, setClassNames] = useState("flex w-full flex-col gap-3");

  return (
    <DemoCard
      name="Form"
      description={t(($) => $.playground.demos.form.description)}
      controls={
        <>
          <DemoText label="FormLabel" value={label} onChange={setLabel} />
          <DemoSwitch label="required" checked={required} onCheckedChange={setRequired} />
          <DemoSwitch
            label="serverInvalid"
            checked={serverInvalid}
            onCheckedChange={setServerInvalid}
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
      <Form
        className={classNames}
        onSubmit={(event) => event.preventDefault()}
        onClearServerErrors={() => setServerInvalid(false)}
      >
        <FormField name="email" serverInvalid={serverInvalid}>
          <FormLabel>{label}</FormLabel>
          <FormControl asChild>
            <Input variant="outline" type="email" required={required} placeholder="you@site.dev" />
          </FormControl>
          <FormMessage match="valueMissing">
            {t(($) => $.playground.demos.form.required)}
          </FormMessage>
          <FormMessage match="typeMismatch">
            {t(($) => $.playground.demos.form.type_mismatch)}
          </FormMessage>
          {serverInvalid ? (
            <FormMessage>{t(($) => $.playground.demos.form.taken)}</FormMessage>
          ) : null}
        </FormField>
        <Button type="submit" variant="outline" className="w-fit">
          {t(($) => $.playground.demos.form.submit)}
        </Button>
      </Form>
    </DemoCard>
  );
}

export { FormDemo };
