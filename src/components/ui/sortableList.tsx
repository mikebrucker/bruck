"use client";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { SortableListRow } from "@/components/ui/sortableListRow";
import { cn } from "@/lib/utils";

type SortableItem = {
  id: string | number;
};

type SortableListProps<T extends SortableItem> = {
  items: Array<T>;
  onChange: (items: Array<T>) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  itemLabel?: (item: T) => string;
};

export function SortableList<T extends SortableItem>({
  items,
  onChange,
  renderItem,
  className,
  itemLabel,
}: SortableListProps<T>) {
  const { t } = useTranslation();
  /** Screen Reader */
  const [announcement, setAnnouncement] = useState("");

  function handleDragEnd(event: DragEndEvent) {
    const next = move(items, event);
    onChange(next);

    const moved = next.find((item) => item.id === event.operation.source?.id);
    if (!moved) return;
    const position = next.indexOf(moved);
    if (items[position]?.id === moved.id) return;
    setAnnouncement(
      t(($) => $.ariaLabels.reorder_announcement, {
        item: itemLabel?.(moved) ?? String(moved.id),
        position: position + 1,
        total: next.length,
      }),
    );
  }

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div className={cn("flex flex-col gap-2", className)}>
        {items.map((item, index) => (
          <SortableListRow key={item.id} id={item.id} index={index}>
            {renderItem(item, index)}
          </SortableListRow>
        ))}
      </div>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </DragDropProvider>
  );
}
