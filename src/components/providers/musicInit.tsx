"use client";

import { useEffect } from "react";
import { useAlbumFilterStore } from "@/stores/useAlbumFilterStore";
import { type View, Views, views } from "@/types/settings";

const isView = (value: string | null): value is View => views.some((view) => view === value);

export function MusicInit() {
  const setView = useAlbumFilterStore((s) => s.setView);

  useEffect(() => {
    const storedView = localStorage.getItem("view");
    setView(isView(storedView) ? storedView : Views.list);
  }, [setView]);

  return null;
}
