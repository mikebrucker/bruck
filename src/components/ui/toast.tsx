"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toast as ToastPrimitive } from "radix-ui";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "pointer-events-auto flex items-start gap-3 rounded-primary border border-border border-l-4 bg-accent p-3 text-sm leading-relaxed shadow-lg outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=end]:animate-out data-[swipe=end]:fade-out",
  {
    variants: {
      variant: {
        default: "border-l-theme-500",
        error: "border-l-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ToastProps = VariantProps<typeof toastVariants> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  duration?: number;
  className?: string;
};

function Toast({
  open,
  onOpenChange,
  text,
  variant = "default",
  duration = 5000,
  className,
}: ToastProps) {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        data-slot="toast"
        data-variant={variant}
        className={cn(toastVariants({ variant, className }))}
      >
        <ToastPrimitive.Description className="min-w-0 flex-1 italic">
          {text}
        </ToastPrimitive.Description>
        <ToastPrimitive.Close
          aria-label={t(($) => $.ariaLabels.close)}
          className="shrink-0 cursor-pointer rounded-secondary text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" aria-hidden="true" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="pointer-events-none fixed bottom-0 right-0 z-9999 flex max-w-[calc(100vw-2rem)] w-96 flex-col gap-2 p-4 outline-none" />
    </ToastPrimitive.Provider>,
    document.body,
  );
}

export { Toast };
