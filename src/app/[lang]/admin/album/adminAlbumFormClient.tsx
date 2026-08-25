"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminAlbumFormFields } from "@/components/modules/admin/album/adminAlbumFormFields";
import { AdminAlbumJsonUpload } from "@/components/modules/admin/album/adminAlbumJsonUpload";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlbumController from "@/controllers/album";
import ArtistController from "@/controllers/artist";
import {
  albumToForm,
  buildPayload,
  buildUpdatePayload,
  emptyForm,
  emptyTrack,
  parseNumber,
} from "@/lib/albumForm";
import { toSlug } from "@/lib/slug";
import type { Album, AlbumForm, TrackForm } from "@/types/album";
import type { Artist } from "@/types/artist";

const FormTabs = {
  new: "new",
  edit: "edit",
  json: "json",
} as const;
type FormTab = keyof typeof FormTabs;

export function AdminAlbumFormClient() {
  const { t } = useTranslation();
  const [form, setForm] = useState<AlbumForm>(emptyForm());
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalForm, setOriginalForm] = useState<AlbumForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>(FormTabs.edit);

  const refreshAlbums = useCallback(async () => {
    try {
      const data = await AlbumController.getAlbums();
      setAlbums(data);
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error ? error.message : t(($) => $.admin.error.refresh_albums_failed),
      });
    }
  }, [t]);

  const refreshArtists = useCallback(async () => {
    try {
      const data = await ArtistController.getArtists();
      setArtists(data);
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error ? error.message : t(($) => $.admin.error.refresh_artists_failed),
      });
    }
  }, [t]);

  useEffect(() => {
    refreshAlbums();
    refreshArtists();
  }, [refreshAlbums, refreshArtists]);

  const sortedAlbums = useMemo(() => {
    return [...albums].sort((a, b) => {
      const artistDiff = a.artist.artist.localeCompare(b.artist.artist);
      if (artistDiff !== 0) return artistDiff;
      return a.album.localeCompare(b.album);
    });
  }, [albums]);

  useEffect(() => {
    if (editingId) return;
    const id = form.artistId && form.album ? `${form.artistId}-${toSlug(form.album)}` : "";
    setForm((prev) => (prev.id === id ? prev : { ...prev, id }));
  }, [form.artistId, form.album, editingId]);

  const isFormTab = (value: string): value is FormTab => value in FormTabs;

  const handleTabChange = (value: string) => {
    if (!isFormTab(value)) return;
    setActiveTab(value);
    if (value === FormTabs.new) {
      startNewAlbum();
    }
  };

  const set = <K extends keyof AlbumForm>(key: K, value: AlbumForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadAlbum = async (id: string) => {
    setStatus(null);
    setLoading(true);
    try {
      const album = await AlbumController.getAlbum(id);
      const loaded = albumToForm(album);
      setForm(loaded);
      setOriginalForm(loaded);
      setEditingId(id);
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error ? error.message : t(($) => $.admin.error.get_album_failed, { id }),
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewAlbum = () => {
    setEditingId(null);
    setOriginalForm(null);
    setForm(emptyForm());
    setStatus(null);
  };

  const resetEditAlbum = () => {
    if (!originalForm) return;
    setForm(originalForm);
    setStatus(null);
  };

  const fieldChanged = (key: keyof AlbumForm) =>
    Boolean(
      editingId && originalForm && JSON.stringify(originalForm[key]) !== JSON.stringify(form[key]),
    );

  const updateTrack = (index: number, patch: Partial<TrackForm>) => {
    setForm((prev) => ({
      ...prev,
      tracks: prev.tracks.map((track, i) => (i === index ? { ...track, ...patch } : track)),
    }));
  };

  const removeTrack = (index: number) => {
    setForm((prev) => ({ ...prev, tracks: prev.tracks.filter((_, i) => i !== index) }));
  };

  const addTrack = () => {
    const nextNumber =
      Math.max(0, ...form.tracks.map((track) => parseNumber(track.number) ?? 0)) + 1;
    set("tracks", [...form.tracks, { ...emptyTrack(), number: String(nextNumber) }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    if (!form.artistId) {
      setStatus({ kind: "error", text: t(($) => $.admin.error.artist_required) });
      return;
    }

    if (editingId && originalForm) {
      const payload = buildUpdatePayload(originalForm, form);
      if (Object.keys(payload).length === 0) {
        setStatus({ kind: "success", text: t(($) => $.admin.status.no_changes) });
        return;
      }

      setSubmitting(true);
      try {
        const updated = await AlbumController.updateAlbum(editingId, payload);
        setStatus({
          kind: "success",
          text: t(($) => $.admin.status.album_updated, { id: updated.id }),
        });
        setEditingId(updated.id);
        setForm((prev) => ({ ...prev, id: updated.id }));
        setOriginalForm({ ...form, id: updated.id });
        refreshAlbums();
      } catch (error) {
        setStatus({
          kind: "error",
          text:
            error instanceof Error ? error.message : t(($) => $.admin.error.update_album_failed),
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      const created = await AlbumController.createAlbum(buildPayload(form));
      setStatus({
        kind: "success",
        text: t(($) => $.admin.status.album_created, { id: created.id }),
      });
      setForm(emptyForm());
      refreshAlbums();
    } catch (error) {
      setStatus({
        kind: "error",
        text: error instanceof Error ? error.message : t(($) => $.admin.error.create_album_failed),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const albumFormFields = (
    <AdminAlbumFormFields
      form={form}
      artists={artists}
      fieldChanged={fieldChanged}
      set={set}
      updateTrack={updateTrack}
      removeTrack={removeTrack}
      addTrack={addTrack}
      status={status}
      submitting={submitting}
      editingId={editingId}
      onSubmit={handleSubmit}
    />
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col gap-4">
      <TabsList className="self-center">
        <TabsTrigger value={FormTabs.edit}>{t(($) => $.admin.tab.edit_album)}</TabsTrigger>
        <TabsTrigger value={FormTabs.new}>{t(($) => $.admin.tab.new_album)}</TabsTrigger>
        <TabsTrigger value={FormTabs.json}>{t(($) => $.admin.tab.json_album)}</TabsTrigger>
      </TabsList>

      <TabsContent value={FormTabs.edit}>
        <div className="flex items-center justify-between gap-2">
          <Select
            placeholder={
              loading
                ? t(($) => $.admin.placeholder.loading)
                : t(($) => $.admin.placeholder.load_existing_album)
            }
            contentClassName="border border-border"
            value={editingId ?? ""}
            disabled={loading}
            onValueChange={loadAlbum}
            options={sortedAlbums.map((album) => ({
              value: album.id,
              label: `${album.artist.artist} - ${album.album}`,
            }))}
          />
          <Button type="button" variant="outline" disabled={!editingId} onClick={resetEditAlbum}>
            {t(($) => $.admin.button.reset)}
          </Button>
        </div>
        {editingId ? albumFormFields : <Note text={t(($) => $.admin.note.select_album_to_edit)} />}
      </TabsContent>

      <TabsContent value={FormTabs.new}>
        {artists.length === 0 ? (
          <Note text={t(($) => $.admin.note.no_artists_yet)} />
        ) : (
          <>
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={startNewAlbum}>
                {t(($) => $.admin.button.reset)}
              </Button>
            </div>
            {albumFormFields}
          </>
        )}
      </TabsContent>

      <TabsContent value={FormTabs.json}>
        <AdminAlbumJsonUpload albums={sortedAlbums} onUploaded={refreshAlbums} />
      </TabsContent>
    </Tabs>
  );
}
