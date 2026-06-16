import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/accordion";
import type { Album } from "@/types/album";

type AlbumCardProps = {
  album: Album;
};

export default function AlbumCard({ album }: AlbumCardProps) {
  const { t } = useTranslation();

  const art = album.art?.map((a) => (
    <div key={a}>
      <Image
        src={`/${a}`}
        alt={t(($) => $.albums.cover_art, { album: album.album })}
        width={256}
        height={256}
        className="rounded-sm object-cover"
      />
    </div>
  ));

  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-emerald-500 rounded-lg p-6 flex flex-col gap-3 w-full transition-shadow duration-200">
      <div className="sm:flex sm:gap-6 sm:items-start">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-start sm:flex-1">
          <div className="row-span-1 sm:row-span-3 text-4xl sm:text-6xl font-bold text-emerald-600 text-right leading-none pt-1">
            {album.rank}
          </div>

          <div>
            <h2 className="text-xl font-bold leading-tight">{album.album}</h2>
            <p className="text-muted-foreground font-medium">{album.artist}</p>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-wrap gap-1.5">
            <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">{album.year}</span>
            <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">
              {album.genre}
            </span>
            <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">
              {album.runtime}
            </span>
            <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">
              {album.label}
            </span>
          </div>

          <div className="col-span-2 sm:hidden flex gap-1 flex-wrap">{art}</div>

          <p className="col-span-2 sm:col-span-1 bg-accent border border-border border-l-4 border-l-emerald-500 rounded-lg p-3 text-sm leading-relaxed italic">
            {album.review}
          </p>
        </div>

        <div className="hidden sm:flex shrink-0 sm:flex-col lg:flex-row gap-1">{art}</div>
      </div>

      <div className="space-y-1">
        {album.discs.map((disc) => {
          let title = disc.title ?? t(($) => $.albums.tracks);
          if (album.discs.length > 1 && !disc.title)
            title = t(($) => $.albums.disc, { number: disc.disc });
          return (
            <Accordion key={disc.disc} title={title} classNames="p-2 rounded-md bg-secondary">
              <div className="space-y-0.5">
                {disc.tracks.map((track) => (
                  <div
                    key={track.number}
                    className="flex gap-2 text-sm odd:bg-card rounded px-1 transition-colors"
                  >
                    <span className="w-5 text-right shrink-0 tabular-nums">{track.number}.</span>
                    <span className="flex-1">{track.title}</span>
                    <span className="shrink-0 tabular-nums">{track.duration}</span>
                  </div>
                ))}
              </div>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
