import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `rounded-primary` / `rounded-secondary` come from custom `--radius-*` theme
 * entries, so they are not t-shirt sizes and tailwind-merge would not otherwise
 * recognize them as border-radius utilities.
 */
const twMerge = extendTailwindMerge({
  extend: { theme: { radius: ["primary", "secondary"] } },
});

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

export const distinctSorted = (values: Array<string>): Array<string> =>
  Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

export type Debounced<TArgs extends Array<unknown>> = {
  (...args: TArgs): void;
  cancel: () => void;
  flush: () => void;
};

export function debounce<TArgs extends Array<unknown>>(
  fn: (...args: TArgs) => void,
  delay: number,
): Debounced<TArgs> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: TArgs | null = null;

  const run = () => {
    timer = null;
    const args = lastArgs;
    lastArgs = null;
    if (args) fn(...args);
  };

  return Object.assign(
    (...args: TArgs) => {
      lastArgs = args;
      if (timer) clearTimeout(timer);
      timer = setTimeout(run, delay);
    },
    {
      cancel: () => {
        if (timer) clearTimeout(timer);
        timer = null;
        lastArgs = null;
      },
      flush: () => {
        if (!timer) return;
        clearTimeout(timer);
        run();
      },
    },
  );
}
