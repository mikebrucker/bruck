"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
  title?: string;
}

function Modal({ open, onClose, children, className, showClose, title }: ModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-60 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.75)" }}
        >
          <Dialog.Content
            aria-describedby={undefined}
            className={cn("relative bg-background overflow-hidden", className)}
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
                    <HugeiconsIcon icon={Cancel01Icon} />
                  </Button>
                </Dialog.Close>
              </div>
            ) : null}
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export { Modal };
