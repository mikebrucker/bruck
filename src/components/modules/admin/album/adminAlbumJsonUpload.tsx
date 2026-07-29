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
import AlbumController from "@/controllers/album";
import { albumCreateSchema, albumUpdateSchema } from "@/data/albumSchema";
import type { Album } from "@/types/album";

function AdminAlbumJsonUpload({
  albums,
  onUploaded,
}: {
  albums: Array<Album>;
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

  const extractId = (value: unknown): string | undefined => {
    if (typeof value !== "object" || value === null || !("id" in value)) return undefined;
    const { id } = value as { id: unknown };
    return typeof id === "string" ? id : undefined;
  };

  const stripId = (value: unknown): unknown => {
    if (typeof value !== "object" || value === null || !("id" in value)) return value;
    const { id: _id, ...rest } = value as { id: unknown } & Record<string, unknown>;
    return rest;
  };

  const loadAlbumJson = (id: string) => {
    const album = albums.find((a) => a.id === id);
    if (!album) return;
    const partialAlbum: Partial<Album> = album;
    delete partialAlbum.createdAt;
    delete partialAlbum.updatedAt;
    setJsonText(JSON.stringify(partialAlbum, null, 2));
    setLoadedId(id);
    setStatus(null);
  };

  const clear = () => {
    setJsonText("");
    setLoadedId(null);
    setStatus(null);
    setSelectResetKey((key) => key + 1);
  };

  const submitAlbum = async (performRequest: () => Promise<Album>, isUpdate: boolean) => {
    setSubmitting(true);
    try {
      const result = await performRequest();
      setStatus({
        kind: "success",
        text: isUpdate
          ? t(($) => $.admin.status.json_album_updated)
          : t(($) => $.admin.status.json_album_created),
      });
      if (!isUpdate) {
        setJsonText("");
        setLoadedId(null);
      } else {
        setLoadedId(result.id);
      }
      onUploaded();
    } catch (error) {
      setStatus({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : isUpdate
              ? t(($) => $.admin.error.update_album_failed)
              : t(($) => $.admin.error.create_album_failed),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const createAlbum = async (payload: unknown) => {
    const validated = albumCreateSchema.safeParse(stripId(payload));
    if (!validated.success) throw new Error(z.prettifyError(validated.error));
    await AlbumController.createAlbumRaw(validated.data);
  };

  const submitAlbums = async (payloads: Array<unknown>) => {
    setSubmitting(true);
    let created = 0;
    const errors: Array<string> = [];

    for (const [index, payload] of payloads.entries()) {
      if (index > 0) await wait(100);
      try {
        await createAlbum(payload);
        created += 1;
      } catch (error) {
        const message = error instanceof Error ? error.message : t(($) => $.admin.error.unknown);
        errors.push(`#${index + 1}: ${message}`);
      }
    }

    setSubmitting(false);

    if (errors.length > 0) {
      setStatus({
        kind: "error",
        text: t(($) => $.admin.error.json_albums_failed, {
          created,
          failed: errors.length,
          errors: errors.join(" | "),
        }),
      });
    } else {
      setStatus({
        kind: "success",
        text: t(($) => $.admin.status.json_albums_created, { created }),
      });
      setJsonText("");
      setLoadedId(null);
    }

    if (created > 0) onUploaded();
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
        setStatus({ kind: "error", text: t(($) => $.admin.error.json_not_array) });
        return;
      }
      await submitAlbums(body);
      return;
    }

    const parsedId = extractId(body);
    const isUpdate = Boolean(loadedId && parsedId === loadedId);
    const rawPayload = stripId(body);

    if (isUpdate && loadedId) {
      await submitAlbum(() => {
        const validated = albumUpdateSchema.safeParse(rawPayload);
        if (!validated.success) throw new Error(z.prettifyError(validated.error));
        return AlbumController.updateAlbumRaw(loadedId, validated.data);
      }, true);
      return;
    }

    await submitAlbum(() => {
      const validated = albumCreateSchema.safeParse(rawPayload);
      if (!validated.success) throw new Error(z.prettifyError(validated.error));
      return AlbumController.createAlbumRaw(validated.data);
    }, false);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Select
          key={selectResetKey}
          id="json-album-load"
          contentClassName="border border-border"
          placeholder={t(($) => $.admin.placeholder.select_album_json)}
          value={loadedId ?? ""}
          onValueChange={loadAlbumJson}
          options={albums.map((album) => ({
            value: album.id,
            label: `${album.artist} - ${album.album}`,
          }))}
        />
        <div className="flex items-center gap-2">
          <Toggle
            icon={SecondBracketSquareIcon}
            iconClassName="size-5"
            variant="outline"
            pressed={useArray}
            onPressedChange={setUseArray}
          >
            {t(($) => $.admin.button.useArray)}
          </Toggle>
          <Button type="button" variant="outline" onClick={clear}>
            {t(($) => $.admin.button.clear)}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <label htmlFor="json-album-input" className="text-sm font-medium text-muted-foreground">
          {t(($) => $.admin.label.album_json)}
        </label>
        <Textarea
          id="json-album-input"
          required
          rows={20}
          placeholder={t(($) => $.admin.placeholder.paste_json)}
          className="min-h-96 font-mono text-xs"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
        />
        {status ? (
          <Note
            text={status.text}
            className={status.kind === "error" ? "border-l-destructive" : undefined}
          />
        ) : null}
        <Button type="submit" disabled={submitting} className="self-start">
          {submitting
            ? t(($) => $.admin.button.uploading)
            : loadedId
              ? t(($) => $.admin.button.update_album)
              : t(($) => $.admin.button.upload)}
        </Button>
      </form>
    </div>
  );
}

export { AdminAlbumJsonUpload };
