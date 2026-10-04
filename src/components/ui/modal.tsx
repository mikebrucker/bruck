"use client";

import {
  ArrowUpRight03Icon,
  ArrowUpRightStackIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dialog } from "radix-ui";
import { createContext, type ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  /** Applied to the overlay, e.g. `overflow-y-auto` for a modal that can outgrow the screen. */
  overlayClassName?: string;
  showClose?: boolean;
  title?: string;
}

/** Open modals around this point of the tree: 1 inside a modal, 2 inside one opened from it. */
const ModalDepthContext = createContext(0);

/** The first modal closes with an X; the second steps back up with an arrow, deeper ones a stack. */
const closeIcon = (depth: number) => {
  if (depth > 2) return ArrowUpRightStackIcon;
  if (depth > 1) return ArrowUpRight03Icon;
  return Cancel01Icon;
};

/** Close icon for a custom close button inside a modal's content. */
function useModalCloseIcon() {
  return closeIcon(useContext(ModalDepthContext));
}

function Modal({
  open,
  onClose,
  children,
  className,
  overlayClassName,
  showClose,
  title,
}: ModalProps) {
  const { t } = useTranslation();
  const depth = useContext(ModalDepthContext) + 1;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn("fixed inset-0 z-60 flex items-center justify-center", overlayClassName)}
          style={{ background: "rgba(0,0,0,0.75)" }}
        >
          <Dialog.Content
            aria-describedby={undefined}
            className={cn("relative overflow-hidden", className)}
          >
            <Dialog.Title className="sr-only">
              {title ?? t(($) => $.ariaLabels.dialog)}
            </Dialog.Title>
            {showClose ? (
              <div className="flex justify-end px-4 pt-2 pb-2">
                <Dialog.Close asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    aria-label={t(($) => $.ariaLabels.close)}
                  >
                    <HugeiconsIcon icon={closeIcon(depth)} />
                  </Button>
                </Dialog.Close>
              </div>
            ) : null}
            <ModalDepthContext.Provider value={depth}>{children}</ModalDepthContext.Provider>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Modal, useModalCloseIcon };
