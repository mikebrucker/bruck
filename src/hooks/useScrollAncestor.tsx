"use client";

import { useEffect, useState } from "react";

function isScrollable(element: HTMLElement) {
  const { overflowY } = window.getComputedStyle(element);
  return overflowY === "auto" || overflowY === "scroll";
}

/** Nearest scrollable ancestor of `ref`, or the document element when none scrolls. */
export function useScrollAncestor(ref: React.RefObject<HTMLElement | null>) {
  const [scrollAncestor, setScrollAncestor] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let current = ref.current?.parentElement ?? null;

    while (current) {
      if (isScrollable(current)) {
        setScrollAncestor(current);
        return;
      }
      current = current.parentElement;
    }

    setScrollAncestor(document.documentElement);
  }, [ref]);

  return scrollAncestor;
}
