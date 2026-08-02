import type { IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/icon";

export type LinkItem = {
  icon: IconSvgElement | string;
  label: string;
  href: string;
};

export function CvLinkButton({ item }: { item: LinkItem }) {
  const isExternal = item.href.startsWith("http");

  return (
    <Button asChild variant="keyboard" size="sm" className="flex-auto">
      <Link
        href={item.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        <AppIcon icon={item.icon} className="size-5" />
        {item.label}
      </Link>
    </Button>
  );
}
