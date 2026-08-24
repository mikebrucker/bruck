import { useState } from "react";
import "./myRangeComponent.css";
import { cn } from "@/lib/utils";

export function MyRangeComponent({ range, min }: { range: number; min: number }) {
  const totalRange = range > 0 && range > min ? range : 1;
  const [selected, setSelected] = useState(min >= 0 ? min : 0);
  const up = () => {
    if (selected < totalRange) setSelected(selected + 1);
  };
  const down = () => {
    if (selected > min) setSelected(selected - 1);
  };

  return (
    <div>
      <button className="[all:revert]" type="button" onClick={down}>
        -
      </button>
      {[...Array(totalRange)].map((_, i) => (
        <span
          className={cn(
            "[all:revert] tech-int-span",
            selected === i + 1 ? "tech-int-highlight" : null,
          )}
          // biome-ignore lint/suspicious/noArrayIndexKey: index is fine here
          key={i}
        ></span>
      ))}
      <button className="[all:revert]" type="button" onClick={up}>
        +
      </button>
    </div>
  );
}

// const styleElement = document.createElement("style");
// styleElement.textContent = style;
// document.head.appendChild(styleElement);

// document.body.innerHTML = "<div id='root'></div>";
// const root = createRoot(document.getElementById("root"));
// root.render(<RangeComponent range={5} min={1} />);
