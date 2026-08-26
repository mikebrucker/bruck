"use client";

import { Vynil02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ArtistCard from "@/components/modules/artist/artistCard";
import { Accordion } from "@/components/ui/accordion";
import { Chip } from "@/components/ui/chip";
import Loader from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { Note } from "@/components/ui/note";
import type { Album, Credit } from "@/types/album";

type AlbumCardProps = {
  album: Album;
};

export default function AlbumCard({ album }: AlbumCardProps) {
  const { t } = useTranslation();

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedMention, setSelectedMention] = useState<Album | null>(null);
  const [artistModalOpen, setArtistModalOpen] = useState(false);

  const openModal = (url: string) => {
    setSelectedImage(url);
    setImageLoading(true);
    setImageModalOpen(true);
  };

  const closeModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
    setImageLoading(false);
  };

  const openMention = (mention: Album) => setSelectedMention(mention);
  const closeMention = () => setSelectedMention(null);

  const openArtist = () => setArtistModalOpen(true);
  const closeArtist = () => setArtistModalOpen(false);

  const favoriteTrackTitle = album.favoriteTrack
    ? `${album.favoriteTrack.number}. ${album.favoriteTrack.title}`
    : null;

  const discCount =
    album.discTitles?.length ?? Math.max(...album.tracks.map((track) => (track.disc ?? 0) + 1));

  const discs = Array.from({ length: discCount }, (_, discIndex) => ({
    discIndex,
    title:
      album.discTitles?.[discIndex] ??
      (discCount > 1
        ? t(($) => $.albums.disc, { number: discIndex + 1 })
        : t(($) => $.albums.tracks)),
    tracks: album.tracks.filter((track) => (track.disc ?? 0) === discIndex),
  }));

  const art = album.art?.map((aa, i) => (
    <div key={aa}>
      <button type="button" onClick={() => openModal(aa)} className="cursor-pointer">
        <Image
          src={`/albums/${aa}`}
          alt={t(($) => $.albums.cover_art, { album: album.album })}
          width={256}
          height={256}
          style={{ height: "auto" }}
          priority={i === 0}
          className="w-64 h-auto rounded-secondary"
        />
      </button>
    </div>
  ));

  const personnelInfo = (credit: Credit) => (
    <div
      key={credit.name}
      className="odd:bg-card rounded-secondary px-2 py-1 flex items-center gap-2"
    >
      <div className="flex-1">
        <span className="font-medium">{credit.name}</span>
        {credit.notes ? (
          <p className="text-muted-foreground italic text-xs whitespace-pre-line">
            {t(($) => $.albums.notes)}: {credit.notes}
          </p>
        ) : null}
      </div>
      <span className="text-muted-foreground shrink-0">{credit.roles.join(", ")}</span>
    </div>
  );

  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-primary p-3 sm:p-4 md:p-6 flex flex-col gap-3 w-full transition-shadow duration-200">
      <div className="sm:flex sm:gap-6 sm:items-start">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 items-start sm:flex-1 min-w-0">
          {album.userAlbum?.rank ? (
            <div className="row-span-1 sm:row-span-5 text-4xl sm:text-6xl font-bold text-theme-600 text-right leading-none pt-1 font-mono">
              {album.userAlbum.rank < 10 ? <>&nbsp;</> : ""}
              {album.userAlbum.rank}
            </div>
          ) : (
            <div className="row-span-1 sm:row-span-5 text-theme-600 pt-1 flex justify-end">
              <HugeiconsIcon icon={Vynil02Icon} className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold leading-tight">{album.album}</h2>
            <button
              type="button"
              onClick={openArtist}
              aria-label={t(($) => $.artists.open_artist, { artist: album.artist.artist })}
              className="text-muted-foreground font-medium hover:text-foreground underline underline-offset-4 transition-colors cursor-pointer text-left"
            >
              {album.artist.artist}
            </button>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-wrap gap-1.5">
            <Chip text={String(album.year)} />
            <Chip text={album.runtime} />
            {album.label.map((label) => (
              <Chip key={label} text={label} />
            ))}
          </div>
          <div className="col-span-2 sm:col-span-1 flex flex-wrap gap-1.5">
            {album.genre.map((genre) => (
              <Chip key={genre} text={genre} />
            ))}
          </div>

          <div className="col-span-2 sm:hidden flex gap-1 flex-wrap justify-center">{art}</div>

          {favoriteTrackTitle ? (
            <div className="col-span-2 sm:col-span-1 flex gap-1.5 items-center justify-center sm:justify-start">
              <span className="text-xs text-muted-foreground">
                {t(($) => $.albums.favorite_track)}:
              </span>
              <Chip text={favoriteTrackTitle} />
            </div>
          ) : null}

          {album.userAlbum?.review ? (
            <Note className="col-span-2 sm:col-span-1" text={album.userAlbum.review} />
          ) : null}
        </div>

        <div className="hidden sm:flex shrink-0 sm:flex-col lg:flex-row gap-1">{art}</div>
      </div>

      <div className="space-y-2">
        {discs.map((group) => (
          <Accordion
            key={group.discIndex}
            title={group.title}
            classNames="p-2 rounded-secondary bg-secondary"
          >
            <div>
              {group.tracks.map((track) => (
                <div
                  key={track.number}
                  className="flex flex-col gap-0 px-2 py-1 odd:bg-card rounded-secondary transition-colors"
                >
                  <div className="flex gap-2 text-sm">
                    <span className="w-5 text-right shrink-0 tabular-nums">{track.number}.</span>
                    <span className="flex-1">{track.title}</span>
                    <span className="shrink-0 tabular-nums">{track.duration}</span>
                  </div>
                  {track.notes ? (
                    <p className="text-muted-foreground italic text-xs pl-7 pr-12 whitespace-pre-line">
                      {track.notes}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </Accordion>
        ))}

        {album.personnel ? (
          <div>
            <Accordion
              title={t(($) => $.albums.personnel)}
              classNames="p-2 rounded-secondary bg-secondary"
              defaultOpen={false}
            >
              <div className="space-y-6 text-sm">
                {album.personnel.members ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.albums.members)}</p>
                    <div>{album.personnel.members.map(personnelInfo)}</div>
                  </div>
                ) : null}
                {album.personnel.guests ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.albums.guests)}</p>
                    <div>{album.personnel.guests.map(personnelInfo)}</div>
                  </div>
                ) : null}
                {album.personnel.production ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.albums.production)}</p>
                    <div>{album.personnel.production.map(personnelInfo)}</div>
                  </div>
                ) : null}
                {album.personnel.studios ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.albums.studios)}</p>
                    <div>
                      {album.personnel.studios.map((studio) => (
                        <div key={studio} className="odd:bg-card rounded-secondary px-2 py-1">
                          {studio}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {album.personnel.notes ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.albums.notes)}</p>
                    <div>
                      <div className="rounded-secondary px-2 py-1 whitespace-pre-line">
                        {album.personnel.notes}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </Accordion>
          </div>
        ) : null}
        {album.honorableMentions?.length ? (
          <div className="pt-1">
            <div className="flex flex-col bg-background p-2 rounded-primary">
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-1.5">
                {album.honorableMentions.length === 1
                  ? t(($) => $.albums.honorable_mention)
                  : t(($) => $.albums.honorable_mentions)}
              </p>
              <div className="flex gap-2 overflow-x-auto">
                {album.honorableMentions.map((mention) => {
                  const cover = mention.art?.[0];
                  return (
                    <button
                      key={mention.id}
                      type="button"
                      onClick={() => openMention(mention)}
                      className="relative w-40 h-40 shrink-0 cursor-pointer text-left"
                    >
                      {cover ? (
                        <Image
                          src={`/albums/${cover}`}
                          alt={t(($) => $.albums.cover_art, { album: mention.album })}
                          width={160}
                          height={160}
                          style={{ height: "auto" }}
                          className="w-40 h-40 rounded-secondary object-cover"
                        />
                      ) : (
                        <div className="w-40 h-40 rounded-secondary bg-card" />
                      )}
                      <div className="absolute bottom-1 left-1 right-1 flex flex-col items-start gap-1">
                        <Chip
                          text={String(mention.year)}
                          className="bg-background/70 backdrop-blur-sm text-xs tabular-nums"
                        />
                        <Chip
                          text={mention.album}
                          className="max-w-full bg-background/70 backdrop-blur-sm text-xs"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
        <Modal
          open={imageModalOpen}
          onClose={closeModal}
          title={t(($) => $.albums.cover_art, { album: album.album })}
        >
          {selectedImage ? (
            <div className="relative">
              <Loader
                className="text-theme-500"
                isOpen={imageLoading}
                fullScreen
                transparentBg
                onClick={closeModal}
              />
              <button
                type="button"
                onClick={closeModal}
                aria-label={t(($) => $.ariaLabels.close)}
                className="cursor-pointer"
              >
                <Image
                  onLoad={() => setImageLoading(false)}
                  src={`/albums/${selectedImage}`}
                  alt=""
                  width={1024}
                  height={1024}
                  style={{ height: "auto" }}
                  className="w-full max-h-screen object-contain"
                />
              </button>
            </div>
          ) : null}
        </Modal>
        <Modal
          open={selectedMention !== null}
          onClose={closeMention}
          showClose
          title={selectedMention?.album}
          className="max-w-3xl h-[80dvh] w-full rounded-primary overflow-y-auto"
        >
          {selectedMention ? (
            <div className="px-2 pb-1">
              <AlbumCard album={selectedMention} />
            </div>
          ) : null}
        </Modal>
        <Modal
          open={artistModalOpen}
          onClose={closeArtist}
          showClose
          title={album.artist.artist}
          className="max-w-3xl max-h-[80dvh] w-full rounded-primary overflow-y-auto"
        >
          <div className="px-2 pb-1">
            <ArtistCard artist={album.artist} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
