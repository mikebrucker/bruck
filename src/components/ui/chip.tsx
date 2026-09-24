import type { IconSvgElement } from "@hugeicons/react";
import { AppIcon } from "@/components/ui/icon";
import { chip } from "@/lib/styles";
import { cn } from "@/lib/utils";

type ChipProps = {
  text: string;
  prefix?: string;
  icon?: IconSvgElement | string;
  slot?: "start" | "end";
  useIconThemeColor?: boolean;
  className?: string;
  prefixClassName?: string;
};

export function Chip({
  text,
  prefix,
  icon,
  slot = "start",
  useIconThemeColor = false,
  className,
  prefixClassName,
}: ChipProps) {
  const iconElement = icon ? (
    <AppIcon icon={icon} className="size-5 shrink-0" useThemeColor={useIconThemeColor} />
  ) : null;

  return (
    <span className={cn(chip, className)}>
      {slot === "start" ? iconElement : null}
      <span>
        {prefix ? <span className={prefixClassName}>{prefix}</span> : null}
        {text}
      </span>
      {slot === "end" ? iconElement : null}
    </span>
  );
}
