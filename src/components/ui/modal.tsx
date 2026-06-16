import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{ background: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative bg-background overflow-hidden">{children}</div>
    </div>
  );
}

export { Modal };
