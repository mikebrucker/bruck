"use client";

import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { type Side, Sides } from "@/types/settings";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  side?: Side;
  useTheme?: boolean;
  classNames?: string;
}

function Drawer({
  open,
  onClose,
  children,
  side = Sides.right,
  useTheme = false,
  classNames,
}: DrawerProps) {
  const { t } = useTranslation();
  const slideIn =
    side === Sides.right
      ? "data-[state=open]:animate-drawer-slide-in-right"
      : "data-[state=open]:animate-drawer-slide-in-left";
  const slideOut =
    side === Sides.right
      ? "data-[state=closed]:animate-drawer-slide-out-right"
      : "data-[state=closed]:animate-drawer-slide-out-left";
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-black/50 data-[state=open]:animate-drawer-fade-in data-[state=closed]:animate-drawer-fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed top-0 z-60 h-full w-9/10 max-w-90",
            side === Sides.right ? "right-0" : "left-0",
            slideIn,
            slideOut,
            classNames,
          )}
          style={{
            background: useTheme
              ? `linear-gradient(to bottom ${side}, var(--theme-200), var(--background))`
              : "var(--background)",
          }}
        >
          <Dialog.Title className="sr-only">{t(($) => $.ariaLabels.menu)}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Drawer };
