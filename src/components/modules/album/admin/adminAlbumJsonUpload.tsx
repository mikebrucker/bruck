"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/ui/note";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
    setJsonText(JSON.stringify(album, null, 2));
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
      }
      setLoadedId(result.id);
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
          value={loadedId ?? undefined}
          onValueChange={loadAlbumJson}
          options={albums.map((album) => ({
            value: album.id,
            label: `${album.artist} — ${album.album}`,
          }))}
        />
        <Button type="button" variant="outline" onClick={clear}>
          {t(($) => $.admin.button.clear)}
        </Button>
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
