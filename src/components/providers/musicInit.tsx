"use client";

import { useEffect } from "react";
import { useMusicFilterStore } from "@/stores/useMusicFilterStore";
import { type MusicList, MusicLists, musicLists, type View, Views, views } from "@/types/settings";

const isView = (value: string | null): value is View => views.some((view) => view === value);

const isMusicList = (value: string | null): value is MusicList =>
  musicLists.some((musicList) => musicList === value);

export function MusicInit() {
  const setView = useMusicFilterStore((s) => s.setView);
  const setMusicList = useMusicFilterStore((s) => s.setMusicList);

  useEffect(() => {
    const storedView = localStorage.getItem("view");
    setView(isView(storedView) ? storedView : Views.list);
  }, [setView]);

  useEffect(() => {
    const storedMusicList = localStorage.getItem("musicList");
    setMusicList(isMusicList(storedMusicList) ? storedMusicList : MusicLists.albums);
  }, [setMusicList]);

  return null;
}
