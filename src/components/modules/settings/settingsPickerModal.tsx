"use client";

import type { ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

interface SettingsPickerModalProps {
  open: boolean;
  onClose: () => void;
  gridClassName: string;
  children: ReactNode;
}

function SettingsPickerModal({ open, onClose, gridClassName, children }: SettingsPickerModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      showClose
      className="max-w-2xl mx-4 max-h-[80dvh] w-full rounded-primary overflow-y-auto bg-background border border-border"
    >
      <div className="px-4 pb-4">
        <div className={cn("grid gap-2", gridClassName)}>{children}</div>
      </div>
    </Modal>
  );
}

export { SettingsPickerModal };
