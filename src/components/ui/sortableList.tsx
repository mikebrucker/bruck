import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import type { ReactNode } from "react";
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
};

export function SortableList<T extends SortableItem>({
  items,
  onChange,
  renderItem,
  className,
}: SortableListProps<T>) {
  function handleDragEnd(event: DragEndEvent) {
    onChange(move(items, event));
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
    </DragDropProvider>
  );
}
