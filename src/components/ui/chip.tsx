import type { IconSvgElement } from "@hugeicons/react";
import { AppIcon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type ChipProps = {
  text: string;
  icon?: IconSvgElement | string;
  slot?: "start" | "end";
  useIconThemeColor?: boolean;
  className?: string;
};

export function Chip({
  text,
  icon,
  slot = "start",
  useIconThemeColor = false,
  className,
}: ChipProps) {
  const iconElement = icon ? (
    <AppIcon icon={icon} className="size-5 shrink-0" useThemeColor={useIconThemeColor} />
  ) : null;

  return (
    <span
      className={cn(
        "bg-muted rounded px-1.5 py-0.5 text-sm font-medium inline-flex items-center gap-1.5",
        className,
      )}
    >
      {slot === "start" ? iconElement : null}
      {text}
      {slot === "end" ? iconElement : null}
    </span>
  );
}
