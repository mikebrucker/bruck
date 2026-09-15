"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  /** Runs on the action button, before the dialog closes itself. */
  onAction: () => void;
  title: string;
  text: string;
  actionLabel: string;
  cancelLabel: string;
  className?: string;
}

/**
 * A question that has to be answered before going on: unlike `Modal`, a click beside
 * it does not dismiss it, and focus starts on cancel rather than on the action.
 */
function AlertDialog({
  open,
  onClose,
  onAction,
  title,
  text,
  actionLabel,
  cancelLabel,
  className,
}: AlertDialogProps) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out motion-reduce:animate-none">
          <AlertDialogPrimitive.Content
            className={cn(
              "mx-4 flex w-full max-w-md flex-col gap-4 rounded-primary border border-border bg-background p-4 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 motion-reduce:animate-none",
              className,
            )}
          >
            <AlertDialogPrimitive.Title className="text-lg font-semibold text-foreground">
              {title}
            </AlertDialogPrimitive.Title>
            <AlertDialogPrimitive.Description className="text-sm text-muted-foreground">
              {text}
            </AlertDialogPrimitive.Description>
            <div className="flex justify-end gap-2">
              <div className="flex-1 xs:flex-none">
                <AlertDialogPrimitive.Cancel asChild>
                  <Button
                    className="min-w-30 w-full xs:w-auto"
                    type="button"
                    variant="outline"
                    size="lg"
                  >
                    {cancelLabel}
                  </Button>
                </AlertDialogPrimitive.Cancel>
              </div>
              <div className="flex-1 xs:flex-none">
                <AlertDialogPrimitive.Action asChild>
                  <Button
                    className="min-w-30 w-full xs:w-auto"
                    type="button"
                    variant="destructive"
                    size="lg"
                    onClick={onAction}
                  >
                    {actionLabel}
                  </Button>
                </AlertDialogPrimitive.Action>
              </div>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Overlay>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

export { AlertDialog };
