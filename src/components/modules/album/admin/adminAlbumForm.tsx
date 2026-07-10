"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AlbumController from "@/controllers/album";
import UserAlbumController from "@/controllers/userAlbum";
import { toSlug } from "@/lib/album";
import type { Album } from "@/types/album";
import type { UserAlbum } from "@/types/userAlbum";
import { AdminAlbumFormFields } from "./adminAlbumFormFields";
import {
  albumToForm,
  buildPayload,
  buildUpdatePayload,
  parseNumber,
} from "./adminAlbumFormMapping";
import type { AlbumForm, TrackForm } from "./adminAlbumFormTypes";
import { emptyForm, emptyTrack } from "./adminAlbumFormTypes";
import { AdminAlbumJsonUpload } from "./adminAlbumJsonUpload";

const FormTabs = {
  new: "new",
  edit: "edit",
  json: "json",
} as const;
type FormTab = keyof typeof FormTabs;

export function AdminAlbumForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<AlbumForm>(emptyForm());
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [userAlbums, setUserAlbums] = useState<Array<UserAlbum>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalForm, setOriginalForm] = useState<AlbumForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>(FormTabs.new);

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

  const refreshUserAlbums = useCallback(async () => {
    try {
      const data = await UserAlbumController.getUserAlbums();
      setUserAlbums(data);
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error ? error.message : t(($) => $.admin.error.refresh_favorites_failed),
      });
    }
  }, [t]);

  useEffect(() => {
    refreshAlbums();
    refreshUserAlbums();
  }, [refreshAlbums, refreshUserAlbums]);

  const sortedAlbums = useMemo(() => {
    const userAlbumByAlbumId = new Map(userAlbums.map((ua) => [ua.albumId, ua]));
    return [...albums].sort((a, b) => {
      const rankA = userAlbumByAlbumId.get(a.id)?.rank;
      const rankB = userAlbumByAlbumId.get(b.id)?.rank;
      if (rankA != null && rankB != null) return rankA - rankB;
      if (rankA != null) return -1;
      if (rankB != null) return 1;
      return `${a.artist} ${a.album}`.localeCompare(`${b.artist} ${b.album}`);
    });
  }, [albums, userAlbums]);

  useEffect(() => {
    if (editingId) return;
    const id = form.artist && form.album ? `${toSlug(form.artist)}-${toSlug(form.album)}` : "";
    setForm((prev) => (prev.id === id ? prev : { ...prev, id }));
  }, [form.artist, form.album, editingId]);

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

    if (editingId && originalForm) {
      const payload = buildUpdatePayload(originalForm, form);
      if (Object.keys(payload).length === 0) {
        setStatus({ kind: "success", text: t(($) => $.admin.status.no_changes) });
        return;
      }

      setSubmitting(true);
      try {
        await AlbumController.updateAlbum(editingId, payload);
        setStatus({
          kind: "success",
          text: t(($) => $.admin.status.album_updated, { id: form.id }),
        });
        setOriginalForm(form);
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
      await AlbumController.createAlbum(buildPayload(form));
      setStatus({ kind: "success", text: t(($) => $.admin.status.album_created, { id: form.id }) });
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
      <TabsList>
        <TabsTrigger value={FormTabs.new}>{t(($) => $.admin.tab.new_album)}</TabsTrigger>
        <TabsTrigger value={FormTabs.edit}>{t(($) => $.admin.tab.edit_album)}</TabsTrigger>
        <TabsTrigger value={FormTabs.json}>{t(($) => $.admin.tab.json_album)}</TabsTrigger>
      </TabsList>

      <TabsContent value={FormTabs.new}>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={startNewAlbum}>
            {t(($) => $.admin.button.reset)}
          </Button>
        </div>
        {albumFormFields}
      </TabsContent>

      <TabsContent value={FormTabs.edit}>
        <div className="flex items-center justify-between gap-2">
          <Select
            placeholder={
              loading
                ? t(($) => $.admin.placeholder.loading)
                : t(($) => $.admin.placeholder.load_existing_album)
            }
            contentClassName="border border-border"
            value={editingId ?? undefined}
            disabled={loading}
            onValueChange={loadAlbum}
            options={sortedAlbums.map((album) => ({
              value: album.id,
              label: `${album.artist} — ${album.album}`,
            }))}
          />
          <Button type="button" variant="outline" disabled={!editingId} onClick={resetEditAlbum}>
            {t(($) => $.admin.button.reset)}
          </Button>
        </div>
        {editingId ? albumFormFields : <Note text={t(($) => $.admin.note.select_album_to_edit)} />}
      </TabsContent>

      <TabsContent value={FormTabs.json}>
        <AdminAlbumJsonUpload albums={sortedAlbums} onUploaded={refreshAlbums} />
      </TabsContent>
    </Tabs>
  );
}
