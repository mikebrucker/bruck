"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/stores/useModalStore";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}

function Modal({ open, onClose, children, className, showClose }: ModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    // Read through getState rather than the hook: subscribing would re-render every open modal
    // whenever any other one opens or closes.
    useModalStore.getState().open();
    document.body.style.overflow = "hidden";
    return () => {
      useModalStore.getState().close();
      if (useModalStore.getState().openCount === 0) document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{ background: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
        aria-label={t(($) => $.ariaLabels.close)}
      />
      <div className={cn("relative bg-background overflow-hidden", className)}>
        {showClose ? (
          <div className="flex justify-end px-4 pt-2 pb-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={onClose}
              aria-label={t(($) => $.ariaLabels.close)}
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </Button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export { Modal };
