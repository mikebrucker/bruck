"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AlbumController from "@/controllers/album";
import UserAlbumController from "@/controllers/userAlbum";
import type { UserAlbumUpdateInput } from "@/data/userAlbumSchema";
import { makeTrackId } from "@/lib/favoriteTrack";
import type { Album } from "@/types/album";
import type { UserAlbum } from "@/types/userAlbum";

const FormTabs = {
  review: "review",
  order: "order",
} as const;
type FormTab = keyof typeof FormTabs;

type UserAlbumForm = {
  trackId: string | null;
  review: string;
};

const emptyForm = (): UserAlbumForm => ({
  trackId: null,
  review: "",
});

export function AdminUserAlbumForm() {
  const { t } = useTranslation();
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [userAlbums, setUserAlbums] = useState<Array<UserAlbum>>([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState<UserAlbumForm>(emptyForm());
  const [originalForm, setOriginalForm] = useState<UserAlbumForm | null>(null);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>(FormTabs.review);

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

  const selectAlbum = (id: string) => {
    setSelectedId(id);
    const userAlbum = userAlbums.find((ua) => ua.albumId === id);
    const next: UserAlbumForm = {
      trackId: userAlbum?.trackId ?? null,
      review: userAlbum?.review ?? "",
    };
    setForm(next);
    setOriginalForm(next);
    setStatus(null);
  };

  const resetEditAlbum = () => {
    if (!originalForm) return;
    setForm(originalForm);
    setStatus(null);
  };

  const selectedAlbum = albums.find((album) => album.id === selectedId);
  const trackOptions = selectedAlbum
    ? selectedAlbum.tracks.map((track) => ({
        value: makeTrackId(track.number, track.disc),
        label: `${track.number}. ${track.title}`,
      }))
    : [];

  const selectedUserAlbum = userAlbums.find((ua) => ua.albumId === selectedId);

  const isFormTab = (value: string): value is FormTab => value in FormTabs;
  const handleTabChange = (value: string) => {
    if (!isFormTab(value)) return;
    setActiveTab(value);
  };

  const buildPayload = (): UserAlbumUpdateInput => {
    if (!originalForm) return {};
    const payload: UserAlbumUpdateInput = {};
    if (form.trackId !== originalForm.trackId) payload.trackId = form.trackId;
    if (form.review !== originalForm.review) payload.review = form.review;
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedId) return;
    setStatus(null);

    const payload = buildPayload();
    if (Object.keys(payload).length === 0) {
      setStatus({ kind: "success", text: t(($) => $.admin.status.no_changes) });
      return;
    }

    setSubmitting(true);
    try {
      const updated = await UserAlbumController.updateUserAlbum(selectedId, payload);
      setUserAlbums((prev) => {
        const index = prev.findIndex((ua) => ua.albumId === selectedId);
        if (index === -1) return [...prev, updated];
        return prev.map((ua, i) => (i === index ? updated : ua));
      });
      const next: UserAlbumForm = {
        trackId: updated.trackId,
        review: updated.review,
      };
      setForm(next);
      setOriginalForm(next);
      setStatus({ kind: "success", text: t(($) => $.admin.status.user_album_updated) });
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error ? error.message : t(($) => $.admin.error.update_user_album_failed),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col gap-4">
      <TabsList className="self-center">
        <TabsTrigger value={FormTabs.review}>{t(($) => $.admin.tab.review)}</TabsTrigger>
        <TabsTrigger value={FormTabs.order}>{t(($) => $.admin.tab.order)}</TabsTrigger>
      </TabsList>

      <TabsContent value={FormTabs.review}>
        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Select
              placeholder={
                loading
                  ? t(($) => $.admin.placeholder.loading)
                  : t(($) => $.admin.placeholder.load_existing_album)
              }
              contentClassName="border border-border"
              value={selectedId}
              disabled={loading}
              onValueChange={selectAlbum}
              options={albums.map((album) => ({
                value: album.id,
                label: `${album.artist} - ${album.album}`,
              }))}
            />
            <Button type="button" variant="outline" disabled={!selectedId} onClick={resetEditAlbum}>
              {t(($) => $.admin.button.reset)}
            </Button>
          </div>

          {selectedId ? (
            <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <FormField name="trackId">
                <FormLabel>{t(($) => $.albums.favorite_track)}</FormLabel>
                <div className="flex items-center gap-2">
                  <Select
                    placeholder={t(($) => $.admin.placeholder.no_favorite_track)}
                    contentClassName="border border-border"
                    value={form.trackId ?? ""}
                    onValueChange={(trackId) => setForm((prev) => ({ ...prev, trackId }))}
                    options={trackOptions}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!form.trackId}
                    onClick={() => setForm((prev) => ({ ...prev, trackId: null }))}
                  >
                    {t(($) => $.admin.button.clear)}
                  </Button>
                </div>
              </FormField>
              <FormField name="review">
                <FormLabel>{t(($) => $.admin.label.review)}</FormLabel>
                <FormControl asChild>
                  <Textarea
                    value={form.review}
                    onChange={(e) => setForm((prev) => ({ ...prev, review: e.target.value }))}
                  />
                </FormControl>
              </FormField>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t(($) => $.albums.honorable_mention)}
                </span>
                <span>
                  {selectedUserAlbum?.honorable
                    ? t(($) => $.admin.label.yes)
                    : t(($) => $.admin.label.no)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t(($) => $.albums.filter_rank)}</span>
                <span>{selectedUserAlbum?.rank ?? t(($) => $.admin.label.na)}</span>
              </div>

              {status ? (
                <Note
                  text={status.text}
                  className={status.kind === "error" ? "border-l-destructive" : undefined}
                />
              ) : null}

              <Button type="submit" disabled={submitting} className="self-start">
                {submitting ? t(($) => $.admin.button.saving) : t(($) => $.admin.button.save)}
              </Button>
            </Form>
          ) : (
            <>
              {status ? <Note text={status.text} /> : null}
              <Note text={t(($) => $.admin.note.select_album_to_edit)} />
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value={FormTabs.order}>
        <div />
      </TabsContent>
    </Tabs>
  );
}
