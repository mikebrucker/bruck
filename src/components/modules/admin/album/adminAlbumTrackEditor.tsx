"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { AdminAlbumCreditListEditor } from "@/components/modules/admin/album/adminAlbumCreditListEditor";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TrackForm } from "@/types/album";

function AdminAlbumTrackEditor({
  track,
  index,
  onChange,
  onRemove,
}: {
  track: TrackForm;
  index: number;
  onChange: (patch: Partial<TrackForm>) => void;
  onRemove: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Accordion
      title={track.title || t(($) => $.admin.accordion.track_fallback, { number: index + 1 })}
      size="sm"
      defaultOpen={false}
      classNames="bg-card rounded-primary"
    >
      <div className="flex flex-col gap-2 px-2 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Input
            variant="secondary"
            placeholder={t(($) => $.admin.placeholder.number)}
            aria-label={t(($) => $.admin.placeholder.number)}
            type="number"
            value={track.number}
            onChange={(e) => onChange({ number: e.target.value })}
          />
          <Input
            variant="secondary"
            placeholder={t(($) => $.admin.placeholder.title)}
            aria-label={t(($) => $.admin.placeholder.title)}
            className="col-span-2"
            value={track.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
          <Input
            variant="secondary"
            placeholder={t(($) => $.admin.placeholder.duration)}
            aria-label={t(($) => $.admin.placeholder.duration)}
            value={track.duration}
            onChange={(e) => onChange({ duration: e.target.value })}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Input
            variant="secondary"
            placeholder={t(($) => $.admin.placeholder.disc)}
            aria-label={t(($) => $.admin.placeholder.disc)}
            type="number"
            value={track.disc}
            onChange={(e) => onChange({ disc: e.target.value })}
          />
          <label
            htmlFor={`track-${index}-instrumental`}
            className="flex items-center gap-2 text-sm"
          >
            <Checkbox
              id={`track-${index}-instrumental`}
              checked={track.instrumental}
              onCheckedChange={(checked) => onChange({ instrumental: checked === true })}
            />
            {t(($) => $.admin.label.instrumental)}
          </label>
        </div>
        <Textarea
          variant="secondary"
          placeholder={t(($) => $.admin.placeholder.notes)}
          aria-label={t(($) => $.admin.placeholder.notes)}
          value={track.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
        <p className="text-sm font-medium text-muted-foreground">
          {t(($) => $.admin.heading.track_personnel)}
        </p>
        <AdminAlbumCreditListEditor
          variant="secondary"
          credits={track.personnel}
          onChange={(personnel) => onChange({ personnel })}
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="self-start"
          onClick={onRemove}
        >
          <HugeiconsIcon icon={Delete02Icon} className="size-4" />
          {t(($) => $.admin.button.remove_track)}
        </Button>
      </div>
    </Accordion>
  );
}

export { AdminAlbumTrackEditor };
