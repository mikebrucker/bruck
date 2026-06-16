import Image from "next/image";
import { Accordion } from "@/components/accordion";
import type { Album } from "@/types/album";

type AlbumCardProps = {
  album: Album;
};

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-emerald-500 rounded-lg p-6 flex flex-col gap-3 w-full transition-shadow duration-200">
      <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] gap-x-6 gap-y-3 items-start">
        <div className="row-span-1 sm:row-span-3 text-4xl sm:text-6xl font-bold text-emerald-600 text-right leading-none pt-1">
          {album.rank}
        </div>

        <div>
          <h2 className="text-xl font-bold leading-tight">{album.album}</h2>
          <p className="text-muted-foreground font-medium">{album.artist}</p>
        </div>

        {album.art?.length ? (
          <div className="col-span-2 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:row-span-3 flex gap-1 flex-wrap">
            {album.art.map((art) => (
              <Image
                key={art}
                src={`/${art}`}
                alt={`${album.album} cover art`}
                width={96}
                height={96}
                className="rounded-sm object-cover"
              />
            ))}
          </div>
        ) : null}

        <div className="col-span-2 sm:col-span-1 flex flex-wrap gap-1.5">
          <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">{album.year}</span>
          <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">{album.genre}</span>
          <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">
            {album.runtime}
          </span>
          <span className="bg-muted rounded px-1.5 py-0.5 text-sm font-medium">{album.label}</span>
        </div>
      </div>

      <p className="bg-accent border border-border border-l-4 border-l-emerald-500 rounded-lg p-3 text-sm leading-relaxed italic">
        {album.review}
      </p>

      <div className="space-y-1">
        {album.discs.map((disc) => {
          const title = album.discs.length === 1 ? "TRACKS" : (disc.title ?? `DISC ${disc.disc}`);
          return (
            <Accordion key={disc.disc} title={title} classNames="p-2 rounded-md bg-secondary">
              <div className="space-y-0.5">
                {disc.tracks.map((track) => (
                  <div
                    key={track.number}
                    className="flex gap-2 text-sm odd:bg-card rounded px-1 transition-colors"
                  >
                    <span className="w-5 text-right shrink-0 tabular-nums">{track.number}.</span>
                    <span className="flex-1 truncate">{track.title}</span>
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
