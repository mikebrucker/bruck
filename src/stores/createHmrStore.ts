import { create, type StateCreator, type StoreApi, type UseBoundStore } from "zustand";

declare global {
  // eslint-disable-next-line no-var
  var __hmrStoreBag: Record<string, unknown> | undefined;
}

/**
 * Wraps zustand's `create` so store state survives Fast Refresh.
 * Without this, editing a file the store module transitively imports
 * (e.g. an i18n config) makes webpack/Turbopack re-execute the store
 * module, resetting fields like `ready` to their defaults with no
 * effect left to flip them back on.
 */
export function createHmrStore<T extends object>(
  key: string,
  persistKeys: ReadonlyArray<keyof T>,
  initializer: StateCreator<T>,
): UseBoundStore<StoreApi<T>> {
  globalThis.__hmrStoreBag ??= {};
  const bag = globalThis.__hmrStoreBag;
  const cached =
    process.env.NODE_ENV !== "production" ? (bag[key] as Partial<T> | undefined) : undefined;

  const useStore = create<T>((set, get, api) => ({
    ...initializer(set, get, api),
    ...cached,
  }));

  if (process.env.NODE_ENV !== "production") {
    useStore.subscribe((state) => {
      const snapshot: Partial<T> = {};
      for (const k of persistKeys) snapshot[k] = state[k];
      bag[key] = snapshot;
    });
  }

  return useStore;
}
