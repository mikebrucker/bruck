import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type ChipProps = {
  text: string;
  icon?: IconSvgElement;
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
    <HugeiconsIcon
      icon={icon}
      className={cn("size-5 shrink-0", useIconThemeColor ? "text-theme-600" : undefined)}
    />
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
