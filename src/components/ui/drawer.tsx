import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  side?: "left" | "right";
}

function Drawer({ open, onClose, children, side = "right" }: DrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-60 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <button
        type="button"
        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        style={{ background: "rgba(0,0,0,0.75)" }}
        onClick={onClose}
        aria-label="Close"
        tabIndex={open ? 0 : -1}
      />
      <div
        className={`absolute top-0 ${side === "right" ? "right-0" : "left-0"} h-full w-4/5 max-w-[360px] bg-background transition-transform duration-300 ease-in-out ${
          open
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export { Drawer };
