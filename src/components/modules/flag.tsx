import Image from "next/image";
import { flagMap, type Language } from "@/i18n/config";
import { cn } from "@/lib/utils";

type FlagProps = {
  language: Language;
  className?: string;
};

// Both flags are 3:2 and sized off the font-size, so callers keep using text-* utilities.
// `unoptimized` because the image optimizer refuses SVG unless `dangerouslyAllowSVG` is set.
export function Flag({ language, className }: FlagProps) {
  return (
    <Image
      src={flagMap[language]}
      alt=""
      aria-hidden
      unoptimized
      width={900}
      height={600}
      className={cn("h-[1em] w-auto", className)}
    />
  );
}
