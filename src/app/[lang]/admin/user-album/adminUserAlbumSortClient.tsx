"use client";

import {
  ChampionIcon,
  CommentRemove01Icon,
  Layers02Icon,
  MusicNote01Icon,
  SoftwareUninstallIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminUserAlbumEditForm } from "@/components/modules/admin/userAlbum/adminUserAlbumEditForm";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Collapsible } from "@/components/ui/collapsible";
import Loader from "@/components/ui/loader";
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
import { debounce } from "@/lib/utils";
import type { Album } from "@/types/album";
import type { OrderPatch, OrderUpdate, UserAlbum } from "@/types/userAlbum";

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

/** Sort key for artist names: leading "The " is ignored. */
const artistSortKey = (artist: string) => artist.replace(/^the\s+/i, "");

export function AdminUserAlbumSortClient() {
  const { t } = useTranslation();
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [userAlbums, setUserAlbums] = useState<Array<UserAlbum>>([]);
  const [selectedId, setSelectedId] = useState("");
  const [allMode, setAllMode] = useState(true);
  const [noReviewOnly, setNoReviewOnly] = useState(false);
  const [noTrackOnly, setNoTrackOnly] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [_saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>(FormTabs.order);

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

  /** Albums shown on the review tab, narrowed by the "no review" / "no track" toggles. */
  const reviewAlbums = useMemo(() => {
    if (!noReviewOnly && !noTrackOnly) return sortedAlbums;
    return sortedAlbums.filter((album) => {
      const ua = userAlbums.find((u) => u.albumId === album.id);
      if (noReviewOnly && ua?.review) return false;
      if (noTrackOnly && ua?.trackId) return false;
      return true;
    });
  }, [sortedAlbums, userAlbums, noReviewOnly, noTrackOnly]);

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
        const artistDiff = artistSortKey(a.album.artist).localeCompare(
          artistSortKey(b.album.artist),
        );
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

  const nextAvailableRank = useMemo(
    () =>
      userAlbums.reduce((max, ua) => (ua.rank !== null && ua.rank > max ? ua.rank : max), 0) + 1,
    [userAlbums],
  );

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
    queueUpdates([{ albumId, rank: nextAvailableRank, honorable: false }]);
  };

  const handleUnrank = (albumId: string) => {
    const rank = rankOf(albumId);
    if (rank === null) return;
    const updates: Array<OrderUpdate> = [{ albumId, rank: null }];
    for (const ua of userAlbums) {
      if (ua.rank !== null && ua.rank > rank) {
        updates.push({ albumId: ua.albumId, rank: ua.rank - 1 });
      }
    }
    queueUpdates(updates);
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

  const toggleClassName =
    "border border-border data-[state=on]:border data-[state=on]:border-theme-900 data-[state=on]:bg-theme-900 data-[state=on]:shadow-[0_0_5px_var(--color-theme-800)] transition-colors duration-300";

  const toggleAllMode = (pressed: boolean) => {
    setAllMode(pressed);
    if (pressed) setSelectedId("");
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full grow flex flex-col gap-4"
    >
      <TabsList className="self-center">
        <TabsTrigger value={FormTabs.order}>{t(($) => $.admin.tab.order)}</TabsTrigger>
        <TabsTrigger value={FormTabs.review}>{t(($) => $.admin.tab.review)}</TabsTrigger>
      </TabsList>

      <TabsContent value={FormTabs.order} className="grow">
        <div className="w-full mx-auto grow flex flex-col gap-6">
          {status ? (
            <div className="max-w-xl w-full mx-auto">
              <Note text={status.text} />
            </div>
          ) : null}
          {loading ? (
            <div className="flex grow w-full items-center justify-center">
              <Loader className="text-theme-500" isOpen />
            </div>
          ) : (
            <>
              <Collapsible
                title={t(($) => $.admin.label.reorder)}
                collapsedHeight={96}
                duration={500}
                defaultOpen
                className="max-w-xl w-full mx-auto"
                triggerClassName="text-muted-foreground font-medium bg-card rounded-primary mb-4"
                contentClassName="gap-6 pr-3"
              >
                <SortableList
                  items={orderRows}
                  onChange={handleReorder}
                  renderItem={(item, index) => {
                    const cover = item.album.art?.[0];
                    return (
                      <div className="flex items-center gap-3">
                        {cover ? (
                          <Image
                            src={`/albums/${cover}`}
                            alt={t(($) => $.albums.cover_art, { album: item.album.album })}
                            width={64}
                            height={64}
                            style={{ height: "auto" }}
                            className="w-16 h-16 rounded-secondary object-contain shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-secondary bg-card shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.album.album}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {item.album.artist}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-theme-600 tabular-nums shrink-0">
                          {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          aria-label={t(($) => $.admin.button.unrank)}
                          className="shrink-0 px-2"
                          onClick={() => handleUnrank(item.id)}
                        >
                          <HugeiconsIcon
                            icon={SoftwareUninstallIcon}
                            className="size-6 text-red-700"
                          />
                          <span className="hidden sm:inline-block">
                            {t(($) => $.admin.button.unrank)}
                          </span>
                        </Button>
                      </div>
                    );
                  }}
                />
              </Collapsible>

              <div className="max-w-5xl w-full mx-auto flex flex-col gap-2">
                <div className="flex items-center p-2 font-medium text-muted-foreground bg-card rounded-primary">
                  <span>{t(($) => $.albums.unranked_albums)}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-3">
                  {honorableRows.map((item) => {
                    const cover = item.album.art?.[0];
                    const honorable =
                      userAlbums.find((ua) => ua.albumId === item.id)?.honorable ?? false;
                    const artistAlreadyRanked = orderRows.some(
                      (row) => row.album.artist === item.album.artist,
                    );
                    const switchId = `honorable-${item.id}`;
                    return (
                      <div
                        key={item.id}
                        className="relative flex flex-col gap-16 p-3 rounded-primary border border-border bg-card overflow-hidden"
                      >
                        {cover ? (
                          <>
                            <Image
                              src={`/albums/${cover}`}
                              alt=""
                              aria-hidden
                              fill
                              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                              className="object-cover blur pointer-events-none select-none"
                            />
                            <Image
                              src={`/albums/${cover}`}
                              alt={t(($) => $.albums.cover_art, { album: item.album.album })}
                              fill
                              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                              className="object-contain"
                            />
                          </>
                        ) : null}

                        <div className="relative flex items-start justify-between gap-2">
                          {artistAlreadyRanked ? (
                            <Tooltip
                              trigger={
                                <span className="shrink-0">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-lg"
                                    disabled
                                    aria-label={t(($) => $.admin.button.rank)}
                                    className="pointer-events-none bg-background/50 backdrop-blur-sm px-2"
                                  >
                                    <HugeiconsIcon icon={ChampionIcon} className="size-6" />
                                  </Button>
                                </span>
                              }
                            >
                              {t(($) => $.admin.tooltip.artist_already_ranked)}
                            </Tooltip>
                          ) : (
                            <Button
                              type="button"
                              variant="ghost"
                              size="lg"
                              aria-label={t(($) => $.admin.button.rank)}
                              className="shrink-0 bg-background/50 backdrop-blur-sm px-2"
                              onClick={() => handleRank(item.id)}
                            >
                              <HugeiconsIcon
                                icon={ChampionIcon}
                                className="size-6 -mr-1.5 text-amber-400"
                              />
                              <span className="text-xl">+{nextAvailableRank}</span>
                            </Button>
                          )}
                          <div className="shrink-0 flex flex-col gap-1 items-center bg-background/50 backdrop-blur-sm text-foreground rounded-secondary p-2">
                            <label
                              htmlFor={switchId}
                              className="text-2xs text-foreground cursor-pointer "
                            >
                              {t(($) => $.albums.honorable)}
                            </label>
                            <Switch
                              id={switchId}
                              checked={honorable}
                              onCheckedChange={(checked) => handleHonorableChange(item.id, checked)}
                            />
                          </div>
                        </div>

                        <div className="relative min-w-0 flex flex-col items-start gap-1">
                          <Chip
                            text={item.album.album}
                            className="block max-w-full truncate bg-background/70 text-foreground backdrop-blur-sm"
                          />
                          <Chip
                            text={item.album.artist}
                            className="block max-w-full truncate bg-background/70 text-foreground backdrop-blur-sm"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value={FormTabs.review} className="grow">
        <div className="w-full grow flex flex-col gap-4">
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
              options={reviewAlbums.map((album) => ({
                value: album.id,
                label: `${album.artist} - ${album.album}`,
              }))}
            />
            <Toggle
              className={toggleClassName}
              icon={Layers02Icon}
              pressed={allMode}
              disabled={loading}
              onPressedChange={toggleAllMode}
            >
              {t(($) => $.admin.toggle.all)}
            </Toggle>
            <Toggle
              className={toggleClassName}
              icon={CommentRemove01Icon}
              pressed={noReviewOnly}
              disabled={loading}
              onPressedChange={setNoReviewOnly}
            >
              {t(($) => $.admin.toggle.no_review)}
            </Toggle>
            <Toggle
              className={toggleClassName}
              icon={MusicNote01Icon}
              pressed={noTrackOnly}
              disabled={loading}
              onPressedChange={setNoTrackOnly}
            >
              {t(($) => $.admin.toggle.no_track)}
            </Toggle>
          </div>

          {loading ? (
            <div className="flex grow w-full items-center justify-center">
              <Loader className="text-theme-500" isOpen />
            </div>
          ) : allMode ? (
            <div className="flex flex-col">
              {reviewAlbums.map((album, index) => {
                const striped = index % 2 === 0;
                return (
                  <div key={album.id} className={`rounded-primary p-3 ${striped ? "bg-card" : ""}`}>
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
    </Tabs>
  );
}
