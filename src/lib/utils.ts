import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

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
