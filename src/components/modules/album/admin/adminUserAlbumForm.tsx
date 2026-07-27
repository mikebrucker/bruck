"use client";

import { ChampionIcon, Layers02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { SortableList } from "@/components/ui/sortableList";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip } from "@/components/ui/tooltip";
import AlbumController from "@/controllers/album";
import UserAlbumController from "@/controllers/userAlbum";
import type { UserAlbumBulkUpdateItem } from "@/data/userAlbumSchema";
import { applyPatches, mergeUserAlbums } from "@/lib/userAlbum";
import { cn, debounce } from "@/lib/utils";
import type { Album } from "@/types/album";
import type { OrderPatch, OrderUpdate, UserAlbum } from "@/types/userAlbum";
import { AdminUserAlbumEditForm } from "./adminUserAlbumEditForm";

const FormTabs = {
  review: "review",
  order: "order",
} as const;
type FormTab = keyof typeof FormTabs;

type OrderRow = {
  id: string;
  album: Album;
};

const SAVE_DELAY_MS = 300;

export function AdminUserAlbumForm() {
  const { t } = useTranslation();
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [userAlbums, setUserAlbums] = useState<Array<UserAlbum>>([]);
  const [selectedId, setSelectedId] = useState("");
  const [allMode, setAllMode] = useState(true);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>(FormTabs.review);

  const pendingRef = useRef<Map<string, OrderPatch>>(new Map());
  const flushRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const chainRef = useRef<Promise<void>>(Promise.resolve());

  const sortedAlbums = useMemo(() => {
    const groupOf = (album: Album) => {
      const ua = userAlbums.find((u) => u.albumId === album.id);
      if (ua?.rank !== null && ua?.rank !== undefined) return 0;
      if (!ua?.honorable) return 1;
      return 2;
    };
    return [...albums].sort((a, b) => {
      const groupDiff = groupOf(a) - groupOf(b);
      if (groupDiff !== 0) return groupDiff;
      const rankA = userAlbums.find((u) => u.albumId === a.id)?.rank;
      const rankB = userAlbums.find((u) => u.albumId === b.id)?.rank;
      if (rankA !== null && rankA !== undefined && rankB !== null && rankB !== undefined) {
        return rankA - rankB;
      }
      return a.id.localeCompare(b.id);
    });
  }, [albums, userAlbums]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [albumsData, userAlbumsData] = await Promise.all([
        AlbumController.getAlbums(),
        UserAlbumController.getUserAlbums(),
      ]);
      setAlbums(albumsData);
      setUserAlbums(userAlbumsData);
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error ? error.message : t(($) => $.admin.error.refresh_albums_failed),
      });
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const orderRows = useMemo<Array<OrderRow>>(
    () =>
      userAlbums
        .filter((ua) => ua.rank !== null)
        .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
        .map((ua) => albums.find((album) => album.id === ua.albumId))
        .filter((album): album is Album => album !== undefined)
        .map((album) => ({ id: album.id, album })),
    [albums, userAlbums],
  );

  const honorableRows = useMemo<Array<OrderRow>>(() => {
    const rankedIds = new Set(orderRows.map((row) => row.id));
    const rankedArtists = new Set(orderRows.map((row) => row.album.artist));
    return albums
      .filter((album) => !rankedIds.has(album.id))
      .map((album) => ({ id: album.id, album }))
      .sort((a, b) => {
        const rankedDiff =
          Number(rankedArtists.has(a.album.artist)) - Number(rankedArtists.has(b.album.artist));
        if (rankedDiff !== 0) return rankedDiff;
        const artistDiff = a.album.artist.localeCompare(b.album.artist);
        if (artistDiff !== 0) return artistDiff;
        return a.album.album.localeCompare(b.album.album);
      });
  }, [albums, orderRows]);

  const flush = async () => {
    const updates: Array<UserAlbumBulkUpdateItem> = Array.from(
      pendingRef.current,
      ([albumId, patch]) => ({ albumId, ...patch }),
    );
    pendingRef.current.clear();
    if (updates.length === 0) return;

    setSaving(true);
    try {
      const saved = await UserAlbumController.updateUserAlbums(updates);
      // Rows queued again while this request was in flight keep their optimistic value.
      const settled = saved.filter((ua) => !pendingRef.current.has(ua.albumId));
      setUserAlbums((prev) => mergeUserAlbums(prev, settled));
    } catch (error) {
      setStatus({
        kind: "error",
        text: error instanceof Error ? error.message : t(($) => $.admin.error.save_order_failed),
      });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    flushRef.current = flush;
  });

  const [debouncedFlush] = useState(() =>
    debounce(() => {
      chainRef.current = chainRef.current.then(() => flushRef.current()).catch(() => {});
    }, SAVE_DELAY_MS),
  );

  useEffect(() => () => debouncedFlush.flush(), [debouncedFlush]);

  const queueUpdates = (updates: Array<OrderUpdate>) => {
    if (updates.length === 0) return;
    setUserAlbums((prev) => applyPatches(prev, updates));
    for (const { albumId, ...patch } of updates) {
      pendingRef.current.set(albumId, { ...pendingRef.current.get(albumId), ...patch });
    }
    debouncedFlush();
  };

  const rankOf = (albumId: string) => userAlbums.find((ua) => ua.albumId === albumId)?.rank ?? null;

  const handleReorder = (next: Array<OrderRow>) => {
    queueUpdates(
      next
        .map((row, index) => ({ albumId: row.id, rank: index + 1 }))
        .filter((update) => rankOf(update.albumId) !== update.rank),
    );
  };

  const handleHonorableChange = (albumId: string, honorable: boolean) => {
    const rank = rankOf(albumId);
    if (!honorable || rank === null) {
      queueUpdates([{ albumId, honorable }]);
      return;
    }
    const updates: Array<OrderUpdate> = [{ albumId, rank: null, honorable: true }];
    for (const ua of userAlbums) {
      if (ua.rank !== null && ua.rank > rank) {
        updates.push({ albumId: ua.albumId, rank: ua.rank - 1 });
      }
    }
    queueUpdates(updates);
  };

  const handleRank = (albumId: string) => {
    const maxRank = userAlbums.reduce(
      (max, ua) => (ua.rank !== null && ua.rank > max ? ua.rank : max),
      0,
    );
    queueUpdates([{ albumId, rank: maxRank + 1, honorable: false }]);
  };

  const selectedAlbum = sortedAlbums.find((album) => album.id === selectedId);

  const isFormTab = (value: string): value is FormTab => value in FormTabs;
  const handleTabChange = (value: string) => {
    if (!isFormTab(value)) return;
    if (activeTab === FormTabs.order && value !== FormTabs.order) debouncedFlush.flush();
    setActiveTab(value);
  };

  const applyUserAlbumUpdate = (updated: UserAlbum) => {
    setUserAlbums((prev) => {
      const index = prev.findIndex((ua) => ua.albumId === updated.albumId);
      if (index === -1) return [...prev, updated];
      return prev.map((ua, i) => (i === index ? updated : ua));
    });
  };

  const toggleAllMode = (pressed: boolean) => {
    setAllMode(pressed);
    if (pressed) setSelectedId("");
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col gap-4">
      <TabsList className="self-center">
        <TabsTrigger value={FormTabs.review}>{t(($) => $.admin.tab.review)}</TabsTrigger>
        <TabsTrigger value={FormTabs.order}>{t(($) => $.admin.tab.order)}</TabsTrigger>
      </TabsList>

      <TabsContent value={FormTabs.review}>
        <div className="w-full flex flex-col gap-4">
          {status ? <Note text={status.text} /> : null}
          <div className="flex items-center gap-2">
            <Select
              placeholder={
                loading
                  ? t(($) => $.admin.placeholder.loading)
                  : t(($) => $.admin.placeholder.load_existing_album)
              }
              contentClassName="border border-border"
              value={selectedId}
              disabled={loading || allMode}
              onValueChange={setSelectedId}
              options={sortedAlbums.map((album) => ({
                value: album.id,
                label: `${album.artist} - ${album.album}`,
              }))}
            />
            <Toggle
              className={cn(
                "border border-border data-[state=on]:bg-theme-900 transition-colors duration-300",
                allMode
                  ? "border-primary bg-primary/10 shadow-[0_0_5px_var(--color-theme-800)]"
                  : "border-border",
              )}
              icon={Layers02Icon}
              pressed={allMode}
              disabled={loading}
              onPressedChange={toggleAllMode}
            >
              {t(($) => $.admin.toggle.all)}
            </Toggle>
          </div>

          {allMode ? (
            <div className="flex flex-col">
              {sortedAlbums.map((album, index) => {
                const striped = index % 2 === 0;
                return (
                  <div key={album.id} className={`rounded-lg p-3 ${striped ? "bg-card" : ""}`}>
                    <AdminUserAlbumEditForm
                      variant={striped ? "outline" : "default"}
                      album={album}
                      userAlbum={userAlbums.find((ua) => ua.albumId === album.id)}
                      onSaved={applyUserAlbumUpdate}
                    />
                  </div>
                );
              })}
            </div>
          ) : selectedAlbum ? (
            <AdminUserAlbumEditForm
              key={selectedId}
              album={selectedAlbum}
              userAlbum={userAlbums.find((ua) => ua.albumId === selectedId)}
              onSaved={applyUserAlbumUpdate}
            />
          ) : (
            <Note text={t(($) => $.admin.note.select_album_to_edit)} />
          )}
        </div>
      </TabsContent>

      <TabsContent value={FormTabs.order}>
        <div className="max-w-xl w-full mx-auto flex flex-col gap-6">
          {status ? <Note text={status.text} /> : null}
          <div className="flex items-center p-2 text-sm font-medium text-muted-foreground bg-card rounded-lg">
            <span className="w-27 shrink-0 text-left">
              {saving ? t(($) => $.admin.status.saving) : t(($) => $.admin.label.reorder)}
            </span>
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <span>{t(($) => $.admin.label.album)}</span>
              <span>{t(($) => $.albums.honorable_mention)}</span>
            </div>
          </div>
          <SortableList
            items={orderRows}
            onChange={handleReorder}
            renderItem={(item, index) => {
              const cover = item.album.art?.[0];
              const honorable = userAlbums.find((ua) => ua.albumId === item.id)?.honorable ?? false;
              return (
                <div className="flex items-center gap-3">
                  {cover ? (
                    <Image
                      src={`/${cover}`}
                      alt={t(($) => $.albums.cover_art, { album: item.album.album })}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-sm object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-sm bg-card shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{item.album.album}</p>
                    <p className="text-sm text-muted-foreground truncate">{item.album.artist}</p>
                  </div>
                  <span className="text-lg font-bold text-theme-600 tabular-nums shrink-0">
                    {index + 1}
                  </span>
                  <Switch
                    checked={honorable}
                    onCheckedChange={(checked) => handleHonorableChange(item.id, checked)}
                    aria-label={t(($) => $.albums.honorable_mention)}
                  />
                </div>
              );
            }}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-2 text-sm font-medium text-muted-foreground bg-card rounded-lg">
              <span>{t(($) => $.albums.unranked_albums)}</span>
              <span>{t(($) => $.albums.honorable_mention)}</span>
            </div>

            {honorableRows.map((item) => {
              const cover = item.album.art?.[0];
              const honorable = userAlbums.find((ua) => ua.albumId === item.id)?.honorable ?? false;
              const artistAlreadyRanked = orderRows.some(
                (row) => row.album.artist === item.album.artist,
              );
              return (
                <div key={item.id} className="flex items-center gap-2 sm:gap-4">
                  {artistAlreadyRanked ? (
                    <Tooltip
                      trigger={
                        <span>
                          <Button
                            type="button"
                            variant="outline"
                            disabled
                            className="pointer-events-none"
                          >
                            <HugeiconsIcon icon={ChampionIcon} className="size-5" />
                            {t(($) => $.admin.button.rank)}
                          </Button>
                        </span>
                      }
                    >
                      {t(($) => $.admin.tooltip.artist_already_ranked)}
                    </Tooltip>
                  ) : (
                    <Button
                      type="button"
                      className="border-border"
                      onClick={() => handleRank(item.id)}
                    >
                      <HugeiconsIcon icon={ChampionIcon} className="size-5 text-amber-400" />
                      {t(($) => $.admin.button.rank)}
                    </Button>
                  )}
                  <div className="min-w-0 flex-1 flex items-center gap-3">
                    {cover ? (
                      <Image
                        src={`/${cover}`}
                        alt={t(($) => $.albums.cover_art, { album: item.album.album })}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-sm object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-sm bg-card shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{item.album.album}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.album.artist}</p>
                    </div>
                  </div>
                  <Switch
                    checked={honorable}
                    onCheckedChange={(checked) => handleHonorableChange(item.id, checked)}
                    aria-label={t(($) => $.albums.honorable_mention)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
