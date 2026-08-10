"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDisclosure } from "@/hooks/useDisclosure";

function ModalDemo() {
  const { t } = useTranslation();
  const modal = useDisclosure();
  const [showClose, setShowClose] = useState(true);
  const [classNames, setClassNames] = useState("rounded-primary max-w-sm w-full");

  return (
    <DemoCard
      name="Modal"
      description={t(($) => $.playground.demos.modal.description)}
      controls={
        <>
          <DemoSwitch label="showClose" checked={showClose} onCheckedChange={setShowClose} />
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
      <Button type="button" variant="outline" onClick={modal.open}>
        {t(($) => $.playground.demos.modal.trigger)}
      </Button>
      <Modal open={modal.isOpen} onClose={modal.close} showClose={showClose} className={classNames}>
        <div className="flex flex-col gap-3 p-4">
          <p className="text-lg font-semibold">{t(($) => $.playground.demos.modal.title)}</p>
          <p className="text-sm text-muted-foreground">{t(($) => $.playground.demos.modal.body)}</p>
          <Button type="button" variant="outline" onClick={modal.close}>
            {t(($) => $.playground.close)}
          </Button>
        </div>
      </Modal>
    </DemoCard>
  );
}

export { ModalDemo };
