"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoNumber } from "@/components/modules/playground/demoNumber";
import { MyRangeComponent } from "@/components/modules/playground/demos/techIntDemo/myRangeComponent";

function TechIntDemoRange() {
  const { t } = useTranslation();
  const [range, setRange] = useState(5);
  const [min, setMin] = useState(1);

  return (
    <DemoCard
      name="MyRangeComponent"
      description={t(($) => $.playground.demos.tech_int_range.description)}
      controls={
        <>
          <DemoNumber label="range" value={range} onChange={setRange} min={1} />
          <DemoNumber label="min" value={min} onChange={setMin} min={0} max={range} />
        </>
      }
    >
      <MyRangeComponent key={`${range}-${min}`} range={range} min={min} />
    </DemoCard>
  );
}

export { TechIntDemoRange };
