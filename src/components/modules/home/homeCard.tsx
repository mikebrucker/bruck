import type { IconSvgElement } from "@hugeicons/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const homeCardVariants = cva(
  "bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-primary flex flex-col gap-2 p-3 sm:p-4 h-full outline-none transition-all duration-300 hover:bg-muted active:bg-muted active:translate-y-px focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:shadow-[0_2px_3px_-1px_rgb(0_0_0/0.25),0_1px_2px_-1px_rgb(0_0_0/0.15)] dark:active:shadow-[0_2px_3px_-1px_rgb(0_0_0/0.35),0_1px_2px_-1px_rgb(0_0_0/0.22)]",
  {
    variants: {
      size: {
        hero: "hover:-translate-y-1 shadow-[0_10px_16px_-3px_rgb(0_0_0/0.30),0_5px_8px_-4px_rgb(0_0_0/0.20)] dark:shadow-[0_10px_16px_-3px_rgb(0_0_0/0.45),0_5px_8px_-4px_rgb(0_0_0/0.30)] hover:shadow-[0_16px_24px_-4px_rgb(0_0_0/0.35),0_8px_12px_-5px_rgb(0_0_0/0.25)] dark:hover:shadow-[0_16px_24px_-4px_rgb(0_0_0/0.5),0_8px_12px_-5px_rgb(0_0_0/0.35)]",
        default:
          "hover:-translate-y-0.5 shadow-[0_5px_6px_-1px_rgb(0_0_0/0.25),0_3px_4px_-2px_rgb(0_0_0/0.15)] dark:shadow-[0_5px_6px_-1px_rgb(0_0_0/0.35),0_3px_4px_-2px_rgb(0_0_0/0.22)] hover:shadow-[0_9px_14px_-2px_rgb(0_0_0/0.30),0_5px_8px_-3px_rgb(0_0_0/0.20)] dark:hover:shadow-[0_9px_14px_-2px_rgb(0_0_0/0.45),0_5px_8px_-3px_rgb(0_0_0/0.30)]",
        compact:
          "hover:-translate-y-0.5 shadow-[0_3px_4px_-1px_rgb(0_0_0/0.2),0_2px_3px_-2px_rgb(0_0_0/0.12)] dark:shadow-[0_3px_4px_-1px_rgb(0_0_0/0.3),0_2px_3px_-2px_rgb(0_0_0/0.18)] hover:shadow-[0_6px_10px_-2px_rgb(0_0_0/0.25),0_3px_5px_-3px_rgb(0_0_0/0.15)] dark:hover:shadow-[0_6px_10px_-2px_rgb(0_0_0/0.38),0_3px_5px_-3px_rgb(0_0_0/0.24)]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type HomeCardProps = VariantProps<typeof homeCardVariants> & {
  href: string;
  title: string;
  description?: string;
  icon: IconSvgElement;
  media?: React.ReactNode;
  className?: string;
};

function HomeCard({
  href,
  title,
  description,
  icon,
  media,
  size = "default",
  className,
}: HomeCardProps) {
  return (
    <Link href={href} className={cn(homeCardVariants({ size }), className)}>
      <div className="flex items-center gap-2.5">
        <HugeiconsIcon icon={icon} aria-hidden className="size-6 shrink-0 text-theme-600" />
        <h2 className="text-lg font-bold leading-tight">{title}</h2>
      </div>
      {description ? (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{description}</p>
      ) : null}
      {media}
    </Link>
  );
}

export { HomeCard, type HomeCardProps };
