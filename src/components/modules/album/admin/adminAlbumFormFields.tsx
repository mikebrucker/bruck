"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminAlbumCreditListEditor } from "./adminAlbumCreditListEditor";
import type { AlbumForm, TrackForm } from "./adminAlbumFormTypes";
import { AdminAlbumTrackEditor } from "./adminAlbumTrackEditor";

function AdminAlbumFormFields({
  form,
  fieldChanged,
  set,
  favoriteTrackIndex,
  selectFavoriteTrack,
  updateTrack,
  removeTrack,
  addTrack,
  status,
  submitting,
  editingId,
  onSubmit,
}: {
  form: AlbumForm;
  fieldChanged: (key: keyof AlbumForm) => boolean;
  set: <K extends keyof AlbumForm>(key: K, value: AlbumForm[K]) => void;
  favoriteTrackIndex: number;
  selectFavoriteTrack: (value: string) => void;
  updateTrack: (index: number, patch: Partial<TrackForm>) => void;
  removeTrack: (index: number) => void;
  addTrack: () => void;
  status: { kind: "success" | "error"; text: string } | null;
  submitting: boolean;
  editingId: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const { t } = useTranslation();
  const valueHasChangedClassName =
    "border-theme-500 ring-1 ring-theme-500/50 focus-visible:border-theme-500 focus-visible:ring-theme-500/50";

  return (
    <Form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField name="id">
          <FormLabel>{t(($) => $.admin.label.id)}</FormLabel>
          <FormControl asChild>
            <Input disabled value={form.artist && form.album ? form.id : ""} />
          </FormControl>
        </FormField>
        <FormField name="artist">
          <FormLabel>{t(($) => $.admin.label.artist)}</FormLabel>
          <FormControl asChild>
            <Input
              required
              className={fieldChanged("artist") ? valueHasChangedClassName : undefined}
              value={form.artist}
              onChange={(e) => set("artist", e.target.value)}
            />
          </FormControl>
        </FormField>
        <FormField name="album">
          <FormLabel>{t(($) => $.admin.label.album)}</FormLabel>
          <FormControl asChild>
            <Input
              required
              className={fieldChanged("album") ? valueHasChangedClassName : undefined}
              value={form.album}
              onChange={(e) => set("album", e.target.value)}
            />
          </FormControl>
        </FormField>
        <FormField name="year">
          <FormLabel>{t(($) => $.admin.label.year)}</FormLabel>
          <FormControl asChild>
            <Input
              required
              type="number"
              className={fieldChanged("year") ? valueHasChangedClassName : undefined}
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
            />
          </FormControl>
        </FormField>
        <FormField name="label">
          <FormLabel>{t(($) => $.admin.label.label)}</FormLabel>
          <FormControl asChild>
            <Input
              required
              className={fieldChanged("label") ? valueHasChangedClassName : undefined}
              value={form.label}
              onChange={(e) => set("label", e.target.value)}
            />
          </FormControl>
        </FormField>
        <FormField name="genre">
          <FormLabel>{t(($) => $.admin.label.genre)}</FormLabel>
          <FormControl asChild>
            <Input
              required
              className={fieldChanged("genre") ? valueHasChangedClassName : undefined}
              value={form.genre}
              onChange={(e) => set("genre", e.target.value)}
            />
          </FormControl>
        </FormField>
        <FormField name="runtime">
          <FormLabel>{t(($) => $.admin.label.runtime)}</FormLabel>
          <FormControl asChild>
            <Input
              required
              className={fieldChanged("runtime") ? valueHasChangedClassName : undefined}
              value={form.runtime}
              onChange={(e) => set("runtime", e.target.value)}
            />
          </FormControl>
        </FormField>
        <div className="flex flex-col gap-1">
          <label htmlFor="favorite-track" className="text-sm font-medium text-muted-foreground">
            {t(($) => $.admin.label.favorite_track)}
          </label>
          <Select
            id="favorite-track"
            className={fieldChanged("favoriteTrack") ? valueHasChangedClassName : ""}
            contentClassName="border-border border"
            placeholder={t(($) => $.admin.placeholder.select_track)}
            value={favoriteTrackIndex >= 0 ? String(favoriteTrackIndex + 1) : "0"}
            onValueChange={selectFavoriteTrack}
            options={[
              { value: "0", label: t(($) => $.admin.option.none) },
              ...form.tracks.map((track, index) => ({
                value: String(index + 1),
                label: `${track.number || index + 1}. ${track.title || t(($) => $.admin.option.untitled)}`,
              })),
            ]}
          />
        </div>
        <FormField name="favoriteDisc">
          <FormLabel>{t(($) => $.admin.label.favorite_disc)}</FormLabel>
          <FormControl asChild>
            <Input disabled value={form.favoriteDisc ? Number(form.favoriteDisc) + 1 : 1} />
          </FormControl>
        </FormField>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <FormField name="discTitles">
          <FormLabel>{t(($) => $.admin.label.disc_titles)}</FormLabel>
          <FormControl asChild>
            <Input
              className={fieldChanged("discTitles") ? valueHasChangedClassName : undefined}
              value={form.discTitles}
              onChange={(e) => set("discTitles", e.target.value)}
            />
          </FormControl>
        </FormField>
        <FormField name="art">
          <FormLabel>{t(($) => $.admin.label.art)}</FormLabel>
          <FormControl asChild>
            <Input
              className={fieldChanged("art") ? valueHasChangedClassName : undefined}
              value={form.art}
              onChange={(e) => set("art", e.target.value)}
            />
          </FormControl>
        </FormField>
        <FormField name="review">
          <FormLabel>{t(($) => $.admin.label.review)}</FormLabel>
          <FormControl asChild>
            <Textarea
              required
              className={fieldChanged("review") ? valueHasChangedClassName : undefined}
              value={form.review}
              onChange={(e) => set("review", e.target.value)}
            />
          </FormControl>
        </FormField>
      </div>

      <Accordion title={t(($) => $.admin.accordion.tracks)} size="sm">
        <div className="flex flex-col gap-2">
          {form.tracks.map((track, index) => (
            <AdminAlbumTrackEditor
              // biome-ignore lint/suspicious/noArrayIndexKey: list has no stable id, reordering not supported
              key={index}
              track={track}
              index={index}
              onChange={(patch) => updateTrack(index, patch)}
              onRemove={() => removeTrack(index)}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={addTrack}
          >
            <HugeiconsIcon icon={Add01Icon} className="size-4" />
            {t(($) => $.admin.button.add_track)}
          </Button>
        </div>
      </Accordion>

      <Accordion title={t(($) => $.admin.accordion.personnel)} size="sm" defaultOpen={false}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {t(($) => $.admin.heading.members)}
            </p>
            <AdminAlbumCreditListEditor
              credits={form.personnel.members}
              onChange={(members) => set("personnel", { ...form.personnel, members })}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {t(($) => $.admin.heading.guests)}
            </p>
            <AdminAlbumCreditListEditor
              credits={form.personnel.guests}
              onChange={(guests) => set("personnel", { ...form.personnel, guests })}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {t(($) => $.admin.heading.production)}
            </p>
            <AdminAlbumCreditListEditor
              credits={form.personnel.production}
              onChange={(production) => set("personnel", { ...form.personnel, production })}
            />
          </div>
          <FormField name="studios">
            <FormLabel>{t(($) => $.admin.label.studios)}</FormLabel>
            <FormControl asChild>
              <Input
                value={form.personnel.studios}
                onChange={(e) => set("personnel", { ...form.personnel, studios: e.target.value })}
              />
            </FormControl>
          </FormField>
          <FormField name="personnelNotes">
            <FormLabel>{t(($) => $.admin.label.personnel_notes)}</FormLabel>
            <FormControl asChild>
              <Input
                value={form.personnel.notes}
                onChange={(e) => set("personnel", { ...form.personnel, notes: e.target.value })}
              />
            </FormControl>
          </FormField>
        </div>
      </Accordion>

      {status ? (
        <Note
          text={status.text}
          className={status.kind === "error" ? "border-l-destructive" : undefined}
        />
      ) : null}

      <Button type="submit" disabled={submitting} className="self-start">
        {submitting
          ? t(($) => $.admin.button.saving)
          : editingId
            ? t(($) => $.admin.button.update_album)
            : t(($) => $.admin.button.create_album)}
      </Button>
    </Form>
  );
}

export { AdminAlbumFormFields };
