"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoSelect } from "@/components/modules/playground/demoSelect";
import { DemoSwitch } from "@/components/modules/playground/demoSwitch";
import { DemoText } from "@/components/modules/playground/demoText";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import type { Accent } from "@/types/settings";

const accentTextClasses: Record<Accent | string, string> = {
  none: "",
  white: "text-white",
  black: "text-black",
  red: "text-red-500",
  orange: "text-orange-500",
  amber: "text-amber-500",
  yellow: "text-yellow-500",
  lime: "text-lime-500",
  green: "text-green-500",
  emerald: "text-emerald-500",
  teal: "text-teal-500",
  cyan: "text-cyan-500",
  sky: "text-sky-500",
  blue: "text-blue-500",
  indigo: "text-indigo-500",
  violet: "text-violet-500",
  purple: "text-purple-500",
  fuchsia: "text-fuchsia-500",
  pink: "text-pink-500",
  rose: "text-rose-500",
  slate: "text-slate-500",
  gray: "text-gray-500",
  zinc: "text-zinc-500",
  neutral: "text-neutral-500",
  stone: "text-stone-500",
  mauve: "text-mauve-500",
  olive: "text-olive-500",
  mist: "text-mist-500",
  taupe: "text-taupe-500",
  eagle: "text-eagle-500",
  kelly: "text-kelly-500",
  flyer: "text-flyer-500",
  phantom: "text-phantom-500",
  phillie: "text-phillie-500",
  maroon: "text-maroon-500",
  sixer: "text-sixer-500",
};

function LoaderDemo() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [color, setColor] = useState<string>("none");
  const [fullScreen, setFullScreen] = useState(false);
  const [transparentBg, setTransparentBg] = useState(false);
  const [classNames, setClassNames] = useState("");

  return (
    <DemoCard
      name="Loader"
      description={t(($) => $.playground.demos.loader.description)}
      previewClassName="relative transform-gpu overflow-hidden"
      controls={
        <>
          <DemoSwitch label="isOpen" checked={isOpen} onCheckedChange={setIsOpen} />
          <DemoSelect
            label="text-{color}-500"
            options={accentTextClasses}
            value={color}
            onChange={setColor}
          />
          <DemoSwitch label="fullScreen" checked={fullScreen} onCheckedChange={setFullScreen} />
          {fullScreen ? (
            <DemoSwitch
              label="transparentBg"
              checked={transparentBg}
              onCheckedChange={setTransparentBg}
            />
          ) : null}
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
      <Loader
        isOpen={isOpen}
        className={cn(accentTextClasses[color], classNames)}
        fullScreen={fullScreen}
        transparentBg={transparentBg}
      />
    </DemoCard>
  );
}

export { LoaderDemo };
