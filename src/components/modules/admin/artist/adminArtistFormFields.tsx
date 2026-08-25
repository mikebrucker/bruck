"use client";

import { useTranslation } from "react-i18next";
import { AdminCreditListEditor } from "@/components/modules/admin/adminCreditListEditor";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Note } from "@/components/ui/note";
import { Textarea } from "@/components/ui/textarea";
import type { ArtistForm } from "@/types/artist";

function AdminArtistFormFields({
  form,
  fieldChanged,
  set,
  status,
  submitting,
  editingId,
  onSubmit,
}: {
  form: ArtistForm;
  fieldChanged: (key: keyof ArtistForm) => boolean;
  set: <K extends keyof ArtistForm>(key: K, value: ArtistForm[K]) => void;
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
          <FormField name="id">
            <FormLabel>{t(($) => $.admin.label.id)}</FormLabel>
            <FormControl asChild>
              <Input disabled value={form.artist ? form.id : ""} />
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
          <FormField name="location">
            <FormLabel>{t(($) => $.admin.label.location)}</FormLabel>
            <FormControl asChild>
              <Input
                className={fieldChanged("location") ? valueHasChangedClassName : undefined}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </FormControl>
          </FormField>
          <FormField name="media">
            <FormLabel>{t(($) => $.admin.label.media)}</FormLabel>
            <FormControl asChild>
              <Input
                className={fieldChanged("media") ? valueHasChangedClassName : undefined}
                value={form.media}
                onChange={(e) => set("media", e.target.value)}
              />
            </FormControl>
          </FormField>
        </div>

        <FormField name="bio">
          <FormLabel>{t(($) => $.admin.label.bio)}</FormLabel>
          <FormControl asChild>
            <Textarea
              className={fieldChanged("bio") ? valueHasChangedClassName : undefined}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
          </FormControl>
        </FormField>

        <Accordion title={t(($) => $.admin.accordion.lineup)} size="sm" defaultOpen={false}>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t(($) => $.admin.heading.members)}
              </p>
              <AdminCreditListEditor
                credits={form.members}
                onChange={(members) => set("members", members)}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {t(($) => $.admin.heading.former_members)}
              </p>
              <AdminCreditListEditor
                credits={form.formerMembers}
                onChange={(formerMembers) => set("formerMembers", formerMembers)}
              />
            </div>
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
            ? t(($) => $.admin.button.update_artist)
            : t(($) => $.admin.button.create_artist)}
        </Button>
      </fieldset>
    </Form>
  );
}

export { AdminArtistFormFields };
