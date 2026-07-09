import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type AppIconProps = {
  icon: IconSvgElement | string;
  className?: string;
  useThemeColor?: boolean;
};

export function AppIcon({ icon, className, useThemeColor = false }: AppIconProps) {
  if (typeof icon === "string") {
    return (
      <span
        aria-hidden
        className={cn("inline-block", useThemeColor ? "bg-theme-600" : "bg-foreground", className)}
        style={{
          maskImage: `url("${icon}")`,
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskImage: `url("${icon}")`,
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }

  return (
    <HugeiconsIcon
      icon={icon}
      className={cn(useThemeColor ? "text-theme-600" : undefined, className)}
    />
  );
}
