"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useDisclosure } from "@/hooks/useDisclosure";
import { type Side, Sides } from "@/types/settings";

function DrawerDemo() {
  const { t } = useTranslation();
  const drawer = useDisclosure();
  const [side, setSide] = useState<Side>(Sides.right);
  const [useTheme, setUseTheme] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Drawer"
      description={t(($) => $.playground.demos.drawer.description)}
      controls={
        <>
          <DemoSelect label="side" options={Sides} value={side} onChange={setSide} />
          <DemoSwitch label="useTheme" checked={useTheme} onCheckedChange={setUseTheme} />
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
      <Button type="button" variant="outline" onClick={drawer.open}>
        {t(($) => $.playground.demos.drawer.trigger)}
      </Button>
      <Drawer
        open={drawer.isOpen}
        onClose={drawer.close}
        side={side}
        useTheme={useTheme}
        classNames={classNames}
      >
        <div className="flex flex-col gap-3 p-4">
          <p className="text-lg font-semibold">{t(($) => $.playground.demos.drawer.title)}</p>
          <p className="text-sm text-muted-foreground">
            {t(($) => $.playground.demos.drawer.body)}
          </p>
          <Button type="button" variant="outline" onClick={drawer.close}>
            {t(($) => $.playground.close)}
          </Button>
        </div>
      </Drawer>
    </DemoCard>
  );
}

export { DrawerDemo };
