import Image from "next/image";
import { Accordion } from "@/components/accordion";
import type { Album } from "@/types/album";

type AlbumCardProps = {
  album: Album;
};

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-emerald-500 rounded-lg p-6 flex flex-col gap-3 w-full transition-shadow duration-200">
      <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-x-6 gap-y-3 items-start">
        <div
          className={`${album.art?.length ? "row-span-3 md:row-span-2" : "row-span-2"} text-6xl font-bold text-emerald-500/20 w-14 text-right leading-none pt-1`}
        >
          {album.rank}
        </div>

        <div>
          <h2 className="text-xl font-bold leading-tight">{album.album}</h2>
          <p className="text-muted-foreground font-medium">{album.artist}</p>
        </div>

        {album.art?.length ? (
          <div className="flex gap-1 md:col-start-3 md:row-start-1 md:row-span-2">
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

        <div className="flex flex-wrap gap-1.5">
          <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">{album.year}</span>
          <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">{album.genre}</span>
          <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">
            {album.runtime}
          </span>
          <span className="bg-muted rounded px-1.5 py-0.5 text-xs font-medium">{album.label}</span>
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
                    className="flex gap-2 text-sm text-muted-foreground odd:bg-card rounded px-1 transition-colors"
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
