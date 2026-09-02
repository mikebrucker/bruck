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

/**
 * Narrows an arbitrary string to a key of an option map. Radix `onValueChange`
 * handlers hand back a plain `string`, so this is what turns that back into the
 * component's own literal union without a type assertion.
 */
export function isKeyOf<TValue extends string>(
  options: Record<TValue, TValue>,
  value: string,
): value is TValue {
  return Object.keys(options).includes(value);
}

export const distinctSorted = (values: Array<string>): Array<string> =>
  Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));

/** Fisher-Yates shuffle returning a new array; the input is left untouched. */
export const shuffle = <TValue>(values: Array<TValue>): Array<TValue> => {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

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
