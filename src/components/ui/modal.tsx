"use client";

import { type ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

let openModalCount = 0;

function Modal({ open, onClose, children, className }: ModalProps) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    openModalCount += 1;
    document.body.style.overflow = "hidden";
    return () => {
      openModalCount -= 1;
      if (openModalCount === 0) document.body.style.overflow = "";
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
      <div className={cn("relative bg-background overflow-hidden", className)}>{children}</div>
    </div>
  );
}

export { Modal };
