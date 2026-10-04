"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useModalCloseIcon } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type MusicCardModalLayoutProps = {
  /** Frame of every stacked section (background, border, radius): the card's own list frame. */
  sectionClassName: string;
  heading: ReactNode;
  onClose?: () => void;
  /** Stacked under the description. Each item brings its own section frame, e.g. an accordion. */
  footer?: ReactNode;
  /** The description: at most half the screen tall, scrolling on its own past that. */
  children: ReactNode;
};

/**
 * Modal format of a music card as stacked sections: heading and close button on top, then the
 * description and footer sections. The modal grows with them and scrolls on its overlay: the header
 * holds the spot it starts at (`modal-offset`) while the sections slide under it and on up to the
 * top of the screen. That takes a modal that starts at that offset and does not clip
 * (`self-start my-modal-offset overflow-visible`) on an overlay that scrolls.
 */
export function MusicCardModalLayout({
  sectionClassName,
  heading,
  onClose,
  footer,
  children,
}: MusicCardModalLayoutProps) {
  const { t } = useTranslation();
  const closeIcon = useModalCloseIcon();

  return (
    <div>
      <div className={cn(sectionClassName, "sticky top-modal-offset z-10 flex overflow-hidden")}>
        <div className="flex-1 min-w-0 px-3 py-2 sm:px-4 sm:py-3 md:px-6">{heading}</div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-auto w-14 rounded-none border-l border-border focus-visible:ring-inset"
            onClick={onClose}
            aria-label={t(($) => $.ariaLabels.close)}
          >
            <HugeiconsIcon icon={closeIcon} className="size-5" />
          </Button>
        ) : null}
      </div>
      <div
        className={cn(
          sectionClassName,
          "max-h-[50dvh] overflow-y-auto flex flex-col gap-3 p-3 sm:p-4 md:p-6",
        )}
      >
        {children}
      </div>
      {footer}
    </div>
  );
}
