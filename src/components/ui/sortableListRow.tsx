"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type SortableListRowProps = {
  id: string | number;
  index: number;
  children: ReactNode;
};

export function SortableListRow({ id, index, children }: SortableListRowProps) {
  const { t } = useTranslation();
  const { ref, handleRef, isDragging } = useSortable({ id, index });

  return (
    <div ref={ref} className={cn("flex items-center gap-2", isDragging ? "opacity-50" : null)}>
      <button
        ref={handleRef}
        type="button"
        className="shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label={t(($) => $.ariaLabels.drag_to_reorder)}
      >
        <HugeiconsIcon icon={DragDropVerticalIcon} className="size-8" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
