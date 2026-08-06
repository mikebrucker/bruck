import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/stores/useLanguageStore";

interface HeaderProps extends React.ComponentProps<"header"> {
  onAction?: () => void;
  actionIcon?: IconSvgElement;
  actionLabel?: string;
  sticky?: boolean;
}

function Header({
  className,
  onAction,
  actionIcon,
  actionLabel,
  sticky = false,
  ...props
}: HeaderProps) {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);
  const resolvedActionLabel = actionLabel ?? t(($) => $.ariaLabels.action);

  return (
    <header
      className={cn(
        "w-full bg-card px-4 py-3 border-b border-border rounded-b-primary flex items-center justify-between shadow-[0_5px_6px_-1px_rgb(0_0_0/0.25),0_3px_4px_-2px_rgb(0_0_0/0.15)] dark:shadow-[0_5px_6px_-1px_rgb(0_0_0/0.35),0_3px_4px_-2px_rgb(0_0_0/0.22)]",
        sticky && "sticky top-0 z-10",
        className,
      )}
      {...props}
    >
      <Link href={`/${language}`}>
        <h1 className="font-bold text-xl sm:text-3xl md:text-4xl tracking-widest font-metal-mania text-shadow-lg text-shadow-theme-600 dark:text-shadow-theme-400 transition-[font-size] duration-1000">
          Mike Brucker
        </h1>
      </Link>
      {onAction && actionIcon ? (
        <Button variant="keyboard" size="icon" onClick={onAction} aria-label={resolvedActionLabel}>
          <HugeiconsIcon icon={actionIcon} className="size-6" />
        </Button>
      ) : null}
    </header>
  );
}

export { Header };
