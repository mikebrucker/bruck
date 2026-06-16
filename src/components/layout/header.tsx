import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  actionLabel = "Action",
  sticky = false,
  ...props
}: HeaderProps) {
  return (
    <header
      className={cn(
        "w-full bg-card px-4 py-3 border-b border-border flex items-center justify-between",
        sticky && "sticky top-0 z-10",
        className,
      )}
      {...props}
    >
      <h1 className="font-bold text-xl sm:text-3xl md:text-4xl font-asimovian text-shadow-lg text-shadow-zinc-900 transition-[font-size] duration-1000">
        Mike Brucker
      </h1>
      {onAction && actionIcon ? (
        <Button
          variant="outline"
          size="icon"
          onClick={onAction}
          aria-label={actionLabel}
          className="rounded-sm"
        >
          <HugeiconsIcon icon={actionIcon} className="size-6" />
        </Button>
      ) : null}
    </header>
  );
}

export { Header };
