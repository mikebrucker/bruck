"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import UserAlbumController from "@/controllers/userAlbum";
import type { UserAlbumUpdateInput } from "@/data/userAlbumSchema";
import { makeTrackId } from "@/lib/favoriteTrack";
import { cn } from "@/lib/utils";
import type { Album } from "@/types/album";
import type { UserAlbum } from "@/types/userAlbum";

type UserAlbumForm = {
  trackId: string | null;
  review: string;
};

type Status = { kind: "success" | "error"; text: string };

const formFromUserAlbum = (userAlbum: UserAlbum | undefined): UserAlbumForm => ({
  trackId: userAlbum?.trackId ?? null,
  review: userAlbum?.review ?? "",
});

const buildPayload = (form: UserAlbumForm, originalForm: UserAlbumForm): UserAlbumUpdateInput => {
  const payload: UserAlbumUpdateInput = {};
  if (form.trackId !== originalForm.trackId) payload.trackId = form.trackId;
  if (form.review !== originalForm.review) payload.review = form.review;
  return payload;
};

export function AdminUserAlbumEditForm({
  album,
  userAlbum,
  onSaved,
  className,
  variant = "default",
}: {
  album: Album;
  userAlbum: UserAlbum | undefined;
  onSaved: (updated: UserAlbum) => void;
  className?: string;
  variant?: "default" | "outline";
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<UserAlbumForm>(() => formFromUserAlbum(userAlbum));
  const [originalForm, setOriginalForm] = useState<UserAlbumForm>(() =>
    formFromUserAlbum(userAlbum),
  );
  const [status, setStatus] = useState<Status | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toastId = useRef(0);

  const showStatus = (next: Status) => {
    toastId.current += 1;
    setStatus(next);
    setToastOpen(true);
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify(originalForm);
  const trackOptions = album.tracks.map((track) => ({
    value: makeTrackId(track.number, track.disc),
    label: `${track.number}. ${track.title}`,
  }));

  const resetForm = () => {
    setForm(originalForm);
    setToastOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToastOpen(false);

    const payload = buildPayload(form, originalForm);
    if (Object.keys(payload).length === 0) {
      showStatus({ kind: "success", text: t(($) => $.admin.status.no_changes) });
      return;
    }

    setSubmitting(true);
    try {
      const updated = await UserAlbumController.updateUserAlbum(album.id, payload);
      const next: UserAlbumForm = {
        trackId: updated.trackId,
        review: updated.review,
      };
      setForm(next);
      setOriginalForm(next);
      showStatus({
        kind: "success",
        text: t(($) => $.admin.status.user_album_updated, {
          album: album.album ?? t(($) => $.admin.label.na),
        }),
      });
      onSaved(updated);
    } catch (error) {
      showStatus({
        kind: "error",
        text:
          error instanceof Error ? error.message : t(($) => $.admin.error.update_user_album_failed),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {album.art?.map((aa) => (
            <Image
              key={aa}
              src={`/${aa}`}
              alt={t(($) => $.albums.cover_art, { album: album.album })}
              width={64}
              height={64}
              className="w-16 h-16 rounded-sm object-cover shrink-0"
            />
          ))}
        </div>
        {!album.art || album.art.length === 0 ? (
          <div className="w-16 h-16 rounded-sm bg-card shrink-0" />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{album.album}</p>
          <p className="text-sm text-muted-foreground truncate">{album.artist}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {userAlbum?.rank ? (
              <Chip text={`${t(($) => $.albums.filter_rank)}: ${userAlbum.rank}`} />
            ) : null}
            <Chip
              text={`${t(($) => $.albums.honorable_mention)}: ${
                userAlbum?.honorable ? t(($) => $.admin.label.yes) : t(($) => $.admin.label.no)
              }`}
            />
          </div>
        </div>
      </div>

      <Form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
        <FormField name="trackId">
          <FormLabel>{t(($) => $.albums.favorite_track)}</FormLabel>
          <div className="flex items-center gap-2">
            <Select
              variant={variant}
              contentClassName={cn("border border-border", variant === "outline" ? "bg-input" : "")}
              placeholder={t(($) => $.admin.placeholder.no_favorite_track)}
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
              className="min-h-20"
              variant={variant}
              value={form.review}
              onChange={(e) => setForm((prev) => ({ ...prev, review: e.target.value }))}
            />
          </FormControl>
        </FormField>

        {status ? (
          <Toast
            key={toastId.current}
            open={toastOpen}
            onOpenChange={setToastOpen}
            text={status.text}
            variant={status.kind === "error" ? "error" : "default"}
          />
        ) : null}

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            variant={variant}
            className={hasChanges ? "bg-theme-700/30 shadow-[0_0_5px_var(--color-theme-800)]" : ""}
            disabled={submitting || !hasChanges}
          >
            {submitting ? t(($) => $.admin.button.saving) : t(($) => $.admin.button.save)}
          </Button>
          <Button type="button" variant="outline" disabled={!hasChanges} onClick={resetForm}>
            {t(($) => $.admin.button.reset)}
          </Button>
        </div>
      </Form>
    </div>
  );
}
