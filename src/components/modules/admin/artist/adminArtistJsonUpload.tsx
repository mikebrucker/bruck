"use client";

import { SecondBracketSquareIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import ArtistController from "@/controllers/artist";
import { artistCreateSchema, artistUpdateSchema } from "@/data/artistSchema";
import type { Artist } from "@/types/artist";

function AdminArtistJsonUpload({
  artists,
  onUploaded,
}: {
  artists: Array<Artist>;
  onUploaded: () => void;
}) {
  const { t } = useTranslation();
  const [jsonText, setJsonText] = useState("");
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectResetKey, setSelectResetKey] = useState(0);
  const [useArray, setUseArray] = useState(false);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const hasId = (value: unknown): value is { id: unknown } =>
    typeof value === "object" && value !== null && "id" in value;

  const extractId = (value: unknown): string | undefined => {
    if (!hasId(value)) return undefined;
    return typeof value.id === "string" ? value.id : undefined;
  };

  const stripId = (value: unknown): unknown => {
    if (!hasId(value)) return value;
    const { id: _id, ...rest } = value;
    return rest;
  };

  const loadArtistJson = (id: string) => {
    const artist = artists.find((a) => a.id === id);
    if (!artist) return;
    const { createdAt: _createdAt, updatedAt: _updatedAt, ...payload } = artist;
    setJsonText(JSON.stringify(payload, null, 2));
    setLoadedId(id);
    setStatus(null);
  };

  const clear = () => {
    setJsonText("");
    setLoadedId(null);
    setStatus(null);
    setSelectResetKey((key) => key + 1);
  };

  const submitArtist = async (performRequest: () => Promise<Artist>, isUpdate: boolean) => {
    setSubmitting(true);
    try {
      const result = await performRequest();
      setStatus({
        kind: "success",
        text: isUpdate
          ? t(($) => $.admin.status.json_artist_updated)
          : t(($) => $.admin.status.json_artist_created),
      });
      if (!isUpdate) {
        setJsonText("");
        setLoadedId(null);
      } else {
        setLoadedId(result.id);
      }
      onUploaded();
    } catch (error) {
      const fallbackMessage = isUpdate
        ? t(($) => $.admin.error.update_artist_failed)
        : t(($) => $.admin.error.create_artist_failed);
      setStatus({
        kind: "error",
        text: error instanceof Error ? error.message : fallbackMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  /** Updates when the payload carries an id matching an existing artist, otherwise creates. */
  const saveArtist = async (payload: unknown): Promise<"created" | "updated"> => {
    const id = extractId(payload);
    const body = stripId(payload);

    if (id && artists.some((artist) => artist.id === id)) {
      const validated = artistUpdateSchema.safeParse(body);
      if (!validated.success) throw new Error(z.prettifyError(validated.error));
      await ArtistController.updateArtist(id, validated.data);
      return "updated";
    }

    const validated = artistCreateSchema.safeParse(body);
    if (!validated.success) throw new Error(z.prettifyError(validated.error));
    await ArtistController.createArtist(validated.data);
    return "created";
  };

  const submitArtists = async (payloads: Array<unknown>) => {
    setSubmitting(true);
    let created = 0;
    let updated = 0;
    const errors: Array<string> = [];

    for (const [index, payload] of payloads.entries()) {
      if (index > 0) await wait(100);
      try {
        const outcome = await saveArtist(payload);
        if (outcome === "updated") updated += 1;
        else created += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : t(($) => $.admin.error.unknown);
        errors.push(`#${index + 1}: ${message}`);
      }
    }

    setSubmitting(false);

    if (errors.length > 0) {
      setStatus({
        kind: "error",
        text: t(($) => $.admin.error.json_artists_failed, {
          created,
          failed: errors.length,
          errors: errors.join(" | "),
        }),
      });
    } else {
      setStatus({
        kind: "success",
        text: t(($) => $.admin.status.json_artists_saved, { created, updated }),
      });
      setJsonText("");
      setLoadedId(null);
    }

    if (created > 0 || updated > 0) onUploaded();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    let body: unknown;
    try {
      body = JSON.parse(jsonText);
    } catch {
      setStatus({ kind: "error", text: t(($) => $.admin.error.invalid_json) });
      return;
    }

    if (useArray) {
      if (!Array.isArray(body)) {
        setStatus({ kind: "error", text: t(($) => $.admin.error.json_not_artist_array) });
        return;
      }
      await submitArtists(body);
      return;
    }

    const parsedId = extractId(body);
    const isUpdate = Boolean(parsedId && artists.some((artist) => artist.id === parsedId));
    const rawPayload = stripId(body);

    if (isUpdate && parsedId) {
      await submitArtist(() => {
        const validated = artistUpdateSchema.safeParse(rawPayload);
        if (!validated.success) throw new Error(z.prettifyError(validated.error));
        return ArtistController.updateArtist(parsedId, validated.data);
      }, true);
      return;
    }

    await submitArtist(() => {
      const validated = artistCreateSchema.safeParse(rawPayload);
      if (!validated.success) throw new Error(z.prettifyError(validated.error));
      return ArtistController.createArtist(validated.data);
    }, false);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Select
          key={selectResetKey}
          id="json-artist-load"
          contentClassName="border border-border"
          placeholder={t(($) => $.admin.placeholder.select_artist_json)}
          value={loadedId ?? ""}
          disabled={submitting}
          onValueChange={loadArtistJson}
          options={artists.map((artist) => ({ value: artist.id, label: artist.artist }))}
        />
        <div className="flex items-center gap-2">
          <Toggle
            icon={SecondBracketSquareIcon}
            iconClassName="size-5"
            variant="outline"
            pressed={useArray}
            disabled={submitting}
            onPressedChange={setUseArray}
          >
            {t(($) => $.admin.button.useArray)}
          </Toggle>
          <Button type="button" variant="outline" disabled={submitting} onClick={clear}>
            {t(($) => $.admin.button.clear)}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <label htmlFor="json-artist-input" className="text-sm font-medium text-muted-foreground">
          {t(($) => $.admin.label.artist_json)}
        </label>
        <Textarea
          id="json-artist-input"
          required
          rows={20}
          placeholder={t(($) => $.admin.placeholder.paste_artist_json)}
          className="min-h-96 font-mono text-xs"
          value={jsonText}
          disabled={submitting}
          onChange={(e) => setJsonText(e.target.value)}
        />
        {status ? (
          <Note
            text={status.text}
            className={status.kind === "error" ? "border-l-destructive" : undefined}
          />
        ) : null}
        <Button type="submit" disabled={submitting} className="self-start">
          {loadedId ? t(($) => $.admin.button.update_artist) : t(($) => $.admin.button.upload)}
        </Button>
      </form>
    </div>
  );
}

export { AdminArtistJsonUpload };
