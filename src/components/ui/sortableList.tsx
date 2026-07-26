import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { DragDropVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
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

type SortableListRowProps = {
  id: string | number;
  index: number;
  children: ReactNode;
};

function SortableListRow({ id, index, children }: SortableListRowProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index });

  return (
    <div ref={ref} className={cn("flex items-center gap-2", isDragging ? "opacity-50" : null)}>
      <button
        ref={handleRef}
        type="button"
        className="shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <HugeiconsIcon icon={DragDropVerticalIcon} className="size-8" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
