"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminArtistFormFields } from "@/components/modules/admin/artist/adminArtistFormFields";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistController from "@/controllers/artist";
import {
  artistToForm,
  buildArtistPayload,
  buildArtistUpdatePayload,
  emptyArtistForm,
} from "@/lib/artistForm";
import { toSlug } from "@/lib/slug";
import type { Artist, ArtistForm } from "@/types/artist";

const FormTabs = {
  new: "new",
  edit: "edit",
} as const;
type FormTab = keyof typeof FormTabs;

export function AdminArtistFormClient() {
  const { t } = useTranslation();
  const [form, setForm] = useState<ArtistForm>(emptyArtistForm());
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [artists, setArtists] = useState<Array<Artist>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalForm, setOriginalForm] = useState<ArtistForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>(FormTabs.edit);

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
    refreshArtists();
  }, [refreshArtists]);

  useEffect(() => {
    if (editingId) return;
    const id = form.artist ? toSlug(form.artist) : "";
    setForm((prev) => (prev.id === id ? prev : { ...prev, id }));
  }, [form.artist, editingId]);

  const isFormTab = (value: string): value is FormTab => value in FormTabs;

  const handleTabChange = (value: string) => {
    if (!isFormTab(value)) return;
    setActiveTab(value);
    if (value === FormTabs.new) {
      startNewArtist();
    }
  };

  const set = <K extends keyof ArtistForm>(key: K, value: ArtistForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const loadArtist = async (id: string) => {
    setStatus(null);
    setLoading(true);
    try {
      const artist = await ArtistController.getArtist(id);
      const loaded = artistToForm(artist);
      setForm(loaded);
      setOriginalForm(loaded);
      setEditingId(id);
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : t(($) => $.admin.error.get_artist_failed, { id }),
      });
    } finally {
      setLoading(false);
    }
  };

  const startNewArtist = () => {
    setEditingId(null);
    setOriginalForm(null);
    setForm(emptyArtistForm());
    setStatus(null);
  };

  const resetEditArtist = () => {
    if (!originalForm) return;
    setForm(originalForm);
    setStatus(null);
  };

  const fieldChanged = (key: keyof ArtistForm) =>
    Boolean(
      editingId && originalForm && JSON.stringify(originalForm[key]) !== JSON.stringify(form[key]),
    );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    if (editingId && originalForm) {
      const payload = buildArtistUpdatePayload(originalForm, form);
      if (Object.keys(payload).length === 0) {
        setStatus({ kind: "success", text: t(($) => $.admin.status.no_changes) });
        return;
      }

      setSubmitting(true);
      try {
        const updated = await ArtistController.updateArtist(editingId, payload);
        setStatus({
          kind: "success",
          text: t(($) => $.admin.status.artist_updated, { id: updated.id }),
        });
        setEditingId(updated.id);
        setForm((prev) => ({ ...prev, id: updated.id }));
        setOriginalForm({ ...form, id: updated.id });
        refreshArtists();
      } catch (error) {
        setStatus({
          kind: "error",
          text:
            error instanceof Error ? error.message : t(($) => $.admin.error.update_artist_failed),
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    setSubmitting(true);
    try {
      const created = await ArtistController.createArtist(buildArtistPayload(form));
      setStatus({
        kind: "success",
        text: t(($) => $.admin.status.artist_created, { id: created.id }),
      });
      setForm(emptyArtistForm());
      refreshArtists();
    } catch (error) {
      setStatus({
        kind: "error",
        text: error instanceof Error ? error.message : t(($) => $.admin.error.create_artist_failed),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const artistFormFields = (
    <AdminArtistFormFields
      form={form}
      fieldChanged={fieldChanged}
      set={set}
      status={status}
      submitting={submitting}
      editingId={editingId}
      onSubmit={handleSubmit}
    />
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col gap-4">
      <TabsList className="self-center">
        <TabsTrigger value={FormTabs.edit}>{t(($) => $.admin.tab.edit_artist)}</TabsTrigger>
        <TabsTrigger value={FormTabs.new}>{t(($) => $.admin.tab.new_artist)}</TabsTrigger>
      </TabsList>

      <TabsContent value={FormTabs.edit}>
        <div className="flex items-center justify-between gap-2">
          <Select
            placeholder={
              loading
                ? t(($) => $.admin.placeholder.loading)
                : t(($) => $.admin.placeholder.load_existing_artist)
            }
            contentClassName="border border-border bg-card"
            value={editingId ?? ""}
            disabled={loading}
            onValueChange={loadArtist}
            options={artists.map((artist) => ({ value: artist.id, label: artist.artist }))}
          />
          <Button type="button" variant="outline" disabled={!editingId} onClick={resetEditArtist}>
            {t(($) => $.admin.button.reset)}
          </Button>
        </div>
        {editingId ? (
          artistFormFields
        ) : (
          <Note text={t(($) => $.admin.note.select_artist_to_edit)} />
        )}
      </TabsContent>

      <TabsContent value={FormTabs.new}>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={startNewArtist}>
            {t(($) => $.admin.button.reset)}
          </Button>
        </div>
        {artistFormFields}
      </TabsContent>
    </Tabs>
  );
}
