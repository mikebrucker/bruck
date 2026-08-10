"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DemoCard } from "@/components/modules/playground/demoCard";
import { DemoText } from "@/components/modules/playground/demoText";
import { SortableList } from "@/components/ui/sortableList";

type Item = { id: string; label: string };

const initialItems: Array<Item> = [
  { id: "a", label: "Between the Buried and Me" },
  { id: "b", label: "The Schoenberg Automaton" },
  { id: "c", label: "Soilwork" },
];

function SortableListDemo() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Array<Item>>(initialItems);
  const [classNames, setClassNames] = useState("w-full");

  return (
    <DemoCard
      name="SortableList"
      description={t(($) => $.playground.demos.sortable_list.description)}
      controls={
        <DemoText
          placeholder="Tailwind classNames"
          label="classNames"
          value={classNames}
          onChange={setClassNames}
          stacked
        />
      }
    >
      <SortableList
        items={items}
        onChange={setItems}
        className={classNames}
        renderItem={(track, index) => (
          <div className="flex items-center gap-2 rounded-secondary bg-card px-3 py-2 text-sm">
            <span className="font-mono text-muted-foreground">{index + 1}</span>
            {track.label}
          </div>
        )}
      />
    </DemoCard>
  );
}

export { SortableListDemo };
