"use client";

import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/ui/accordion";
import type { Credit } from "@/types/album";
import type { Artist } from "@/types/artist";

type ArtistCardProps = {
  artist: Artist;
};

export default function ArtistCard({ artist }: ArtistCardProps) {
  const { t } = useTranslation();

  const media = artist.media?.filter(Boolean) ?? [];

  const creditInfo = (credit: Credit) => (
    <div
      key={credit.name}
      className="odd:bg-card rounded-secondary px-2 py-1 flex items-center gap-2"
    >
      <div className="flex-1">
        <span className="font-medium">{credit.name}</span>
        {credit.notes ? (
          <p className="text-muted-foreground italic text-xs whitespace-pre-line">{credit.notes}</p>
        ) : null}
      </div>
      <span className="text-muted-foreground shrink-0">{credit.roles.join(", ")}</span>
    </div>
  );

  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-primary p-3 sm:p-4 md:p-6 flex flex-col gap-3 w-full">
      <div className="sm:flex sm:gap-6 sm:items-start">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-start sm:flex-1">
          <div className="row-span-1 sm:row-span-3 text-theme-600 pt-1 flex justify-end">
            <HugeiconsIcon icon={UserGroupIcon} className="w-10 h-10 sm:w-14 sm:h-14" />
          </div>

          <div>
            <h2 className="text-xl font-bold leading-tight">{artist.artist}</h2>
            {artist.location ? (
              <p className="text-muted-foreground font-medium">{artist.location}</p>
            ) : null}
          </div>

          {artist.bio ? (
            <p className="col-span-2 sm:col-span-1 text-sm whitespace-pre-line">{artist.bio}</p>
          ) : null}
        </div>

        {media.length ? (
          <div className="shrink-0 flex sm:flex-col lg:flex-row gap-1 justify-center">
            {media.map((file, i) => (
              <Image
                key={file}
                src={`/artists/${file}`}
                alt={t(($) => $.artists.photo, { artist: artist.artist })}
                width={256}
                height={256}
                style={{ height: "auto" }}
                priority={i === 0}
                className="w-64 h-auto rounded-secondary"
              />
            ))}
          </div>
        ) : null}
      </div>

      {artist.members?.length || artist.formerMembers?.length ? (
        <div className="space-y-2">
          {artist.members?.length ? (
            <Accordion
              title={t(($) => $.artists.members)}
              classNames="p-2 rounded-secondary bg-secondary"
            >
              <div className="text-sm">{artist.members.map(creditInfo)}</div>
            </Accordion>
          ) : null}
          {artist.formerMembers?.length ? (
            <Accordion
              title={t(($) => $.artists.former_members)}
              classNames="p-2 rounded-secondary bg-secondary"
              defaultOpen={false}
            >
              <div className="text-sm">{artist.formerMembers.map(creditInfo)}</div>
            </Accordion>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
