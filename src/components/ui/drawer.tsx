"use client";

import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  side?: "left" | "right";
  useTheme?: boolean;
  classNames?: string;
}

function Drawer({
  open,
  onClose,
  children,
  side = "right",
  useTheme = false,
  classNames,
}: DrawerProps) {
  const slideIn =
    side === "right"
      ? "data-[state=open]:animate-drawer-slide-in-right"
      : "data-[state=open]:animate-drawer-slide-in-left";
  const slideOut =
    side === "right"
      ? "data-[state=closed]:animate-drawer-slide-out-right"
      : "data-[state=closed]:animate-drawer-slide-out-left";
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-black/50 data-[state=open]:animate-drawer-fade-in data-[state=closed]:animate-drawer-fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className={`fixed top-0 ${side === "right" ? "right-0" : "left-0"} z-60 h-full w-4/5 max-w-90 ${slideIn} ${slideOut} ${classNames ?? ""}`}
          style={{
            background: useTheme
              ? `linear-gradient(to bottom ${side}, var(--theme-200), var(--background))`
              : "var(--background)",
          }}
        >
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Drawer };
