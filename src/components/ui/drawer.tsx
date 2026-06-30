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

function Drawer({ open, onClose, children, side = "right", useTheme = false, classNames }: DrawerProps) {
  const translateClass = open ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full";
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={`fixed inset-0 z-60 bg-black/75 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />
        <Dialog.Content
          aria-describedby={undefined}
          className={`fixed top-0 ${side === "right" ? "right-0" : "left-0"} z-60 h-full w-4/5 max-w-90 transition-transform duration-300 ease-in-out ${translateClass} ${classNames ?? ""}`}
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
