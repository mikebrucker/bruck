"use client";

import { type ComponentProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoNumber } from "@/components/modules/playground/demoNumber";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoText } from "@/components/modules/playground/demoText";
import { useDemoState } from "@/components/modules/playground/useDemoState";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useDisclosure } from "@/hooks/useDisclosure";
import type { PropOptions } from "@/types/playground";

const ToastVariants: PropOptions<NonNullable<ComponentProps<typeof Toast>["variant"]>> = {
  default: "default",
  error: "error",
};

function ToastDemo() {
  const { t } = useTranslation();
  const toast = useDisclosure();
  const [variant, setVariant] = useState(ToastVariants.default);
  const [text, setText] = useDemoState(t(($) => $.playground.demos.toast.text));
  const [duration, setDuration] = useState(5000);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Toast"
      description={t(($) => $.playground.demos.toast.description)}
      controls={
        <>
          <DemoSelect
            label="variant"
            options={ToastVariants}
            value={variant}
            onChange={setVariant}
          />
          <DemoText label="text" value={text} onChange={setText} />
          <DemoNumber label="duration" value={duration} onChange={setDuration} min={0} step={500} />
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
      <Button type="button" variant="outline" onClick={toast.open}>
        {t(($) => $.playground.demos.toast.trigger)}
      </Button>
      <Toast
        open={toast.isOpen}
        onOpenChange={(next) => {
          if (!next) toast.close();
        }}
        text={text}
        variant={variant}
        duration={duration}
        className={classNames}
      />
    </DemoCard>
  );
}

export { ToastDemo };
