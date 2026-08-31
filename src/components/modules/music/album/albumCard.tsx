"use client";

import { Cancel01Icon, Vynil02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumCardModal from "@/components/modules/music/album/albumCardModal";
import AlbumStrip from "@/components/modules/music/album/albumStrip";
import ArtistCardModal from "@/components/modules/music/artist/artistCardModal";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import Loader from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { Note } from "@/components/ui/note";
import { cn } from "@/lib/utils";
import { useMusicFilterStore } from "@/stores/useMusicFilterStore";
import type { Album, Credit } from "@/types/album";
import type { Artist } from "@/types/artist";
import { MusicLists } from "@/types/settings";

type AlbumCardProps = {
  album: Album;
  isModal?: boolean;
  onClose?: () => void;
};

export default function AlbumCard({ album, isModal, onClose }: AlbumCardProps) {
  const { t } = useTranslation();
  const musicList = useMusicFilterStore((s) => s.musicList);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedMention, setSelectedMention] = useState<Album | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

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

  const openArtist = () => setSelectedArtist(album.artist);
  const closeArtist = () => setSelectedArtist(null);

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
        ? t(($) => $.music.albums.disc, { number: discIndex + 1 })
        : t(($) => $.music.albums.tracks)),
    tracks: album.tracks.filter((track) => (track.disc ?? 0) === discIndex),
  }));

  const art = album.art?.map((aa, i) => (
    <div key={aa}>
      <button type="button" onClick={() => openModal(aa)} className="cursor-pointer">
        <Image
          src={`/albums/${aa}`}
          alt={t(($) => $.music.albums.cover_art, { album: album.album })}
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
            {t(($) => $.music.albums.notes)}: {credit.notes}
          </p>
        ) : null}
      </div>
      <span className="text-muted-foreground shrink-0">{credit.roles.join(", ")}</span>
    </div>
  );

  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-primary p-3 sm:p-4 md:p-6 flex flex-col gap-3 w-full transition-shadow duration-200">
      {onClose ? (
        <div className="sticky top-0 z-20 flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={onClose}
            aria-label={t(($) => $.ariaLabels.close)}
          >
            <HugeiconsIcon icon={Cancel01Icon} />
          </Button>
        </div>
      ) : null}
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
            {musicList === MusicLists.albums ? (
              <button
                type="button"
                onClick={openArtist}
                aria-label={t(($) => $.music.artists.open_artist, { artist: album.artist.artist })}
                className="text-muted-foreground font-medium hover:text-foreground underline underline-offset-4 transition-colors cursor-pointer text-left"
              >
                {album.artist.artist}
              </button>
            ) : (
              <p className="text-muted-foreground font-medium text-left">{album.artist.artist}</p>
            )}
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
                {t(($) => $.music.albums.favorite_track)}:
              </span>
              <Chip text={favoriteTrackTitle} />
            </div>
          ) : null}

          {album.userAlbum?.review ? (
            <Note className="col-span-2 sm:col-span-1" text={album.userAlbum.review} />
          ) : null}
        </div>

        <div
          className={cn(
            "hidden sm:flex shrink-0 sm:flex-col gap-1",
            !isModal ? "lg:flex-row" : null,
          )}
        >
          {art}
        </div>
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
              title={t(($) => $.music.albums.personnel)}
              classNames="p-2 rounded-secondary bg-secondary"
              defaultOpen={false}
            >
              <div className="space-y-6 text-sm">
                {album.personnel.members ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.music.albums.members)}</p>
                    <div>{album.personnel.members.map(personnelInfo)}</div>
                  </div>
                ) : null}
                {album.personnel.guests ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.music.albums.guests)}</p>
                    <div>{album.personnel.guests.map(personnelInfo)}</div>
                  </div>
                ) : null}
                {album.personnel.production ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">
                      {t(($) => $.music.albums.production)}
                    </p>
                    <div>{album.personnel.production.map(personnelInfo)}</div>
                  </div>
                ) : null}
                {album.personnel.studios ? (
                  <div>
                    <p className="font-semibold text-lg mb-1">{t(($) => $.music.albums.studios)}</p>
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
                    <p className="font-semibold text-lg mb-1">{t(($) => $.music.albums.notes)}</p>
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
          <AlbumStrip
            albums={album.honorableMentions}
            title={
              album.honorableMentions.length === 1
                ? t(($) => $.music.albums.honorable_mention)
                : t(($) => $.music.albums.honorable_mentions)
            }
            onSelect={openMention}
          />
        ) : null}
        <Modal
          className="bg-background"
          open={imageModalOpen}
          onClose={closeModal}
          title={t(($) => $.music.albums.cover_art, { album: album.album })}
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
                className="block cursor-pointer"
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
        <AlbumCardModal album={selectedMention} onClose={closeMention} />
        {musicList === MusicLists.albums ? (
          <ArtistCardModal artist={selectedArtist} albums={[album]} onClose={closeArtist} />
        ) : null}
      </div>
    </div>
  );
}
