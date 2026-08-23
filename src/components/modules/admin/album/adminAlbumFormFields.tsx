"use client";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { AdminAlbumCreditListEditor } from "@/components/modules/admin/album/adminAlbumCreditListEditor";
import { AdminAlbumTrackEditor } from "@/components/modules/admin/album/adminAlbumTrackEditor";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Note } from "@/components/ui/note";
import type { AlbumForm, TrackForm } from "@/types/album";

function AdminAlbumFormFields({
  form,
  fieldChanged,
  set,
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
    <Form onSubmit={onSubmit} className="w-full">
      <fieldset disabled={submitting} className="flex min-w-0 flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
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
          </div>
          <div className="flex flex-col gap-3">
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
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
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

        <Button type="submit" className="self-start">
          {editingId
            ? t(($) => $.admin.button.update_album)
            : t(($) => $.admin.button.create_album)}
        </Button>
      </fieldset>
    </Form>
  );
}

export { AdminAlbumFormFields };
