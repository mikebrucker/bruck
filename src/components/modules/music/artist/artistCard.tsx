"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import AlbumCardModal from "@/components/modules/music/album/albumCardModal";
import AlbumStrip from "@/components/modules/music/album/albumStrip";
import { MusicCardModalLayout } from "@/components/modules/music/musicCardModalLayout";
import { Accordion } from "@/components/ui/accordion";
import Loader from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { artistAlbums } from "@/lib/album";
import { cn } from "@/lib/utils";
import { useMusicFilterStore } from "@/stores/useMusicFilterStore";
import { useStyleStore } from "@/stores/useStyleStore";
import type { Album, Credit } from "@/types/album";
import type { Artist } from "@/types/artist";
import { MusicLists, Themes } from "@/types/settings";

type ArtistCardProps = {
  artist: Artist;
  albums?: Array<Album>;
  rank?: number;
  isModal?: boolean;
  onClose?: () => void;
};

export default function ArtistCard({ artist, albums, rank, isModal, onClose }: ArtistCardProps) {
  const { t } = useTranslation();
  const theme = useStyleStore((s) => s.resolvedTheme);
  const musicList = useMusicFilterStore((s) => s.musicList);
  const [missing, setMissing] = useState<Array<string>>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const discography = useMemo(() => artistAlbums(albums ?? [], artist.id), [albums, artist.id]);

  const openAlbum = (album: Album) => setSelectedAlbum(album);
  const closeAlbum = () => setSelectedAlbum(null);

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

  const ArtistImages = {
    logo: "logo",
    "logo-light": "logo-light",
    photo: "photo",
  } as const;

  const images = Object.values(ArtistImages)
    .map((slot) => ({ slot, src: `/artists/${artist.id}-${slot}.webp` }))
    .filter(({ src }) => !missing.includes(src));

  const darkLogo = images.find(({ slot }) => slot === ArtistImages.logo);
  const lightLogo = images.find(({ slot }) => slot === ArtistImages["logo-light"]);
  const logo = theme === Themes.light ? (lightLogo ?? darkLogo) : darkLogo;
  const photos = images.filter(({ slot }) => slot === ArtistImages.photo);

  const artistImage = ({
    slot,
    src,
    width,
    height,
    sizes,
    unoptimized,
    className,
  }: {
    slot: keyof typeof ArtistImages;
    src: string;
    width: number;
    height: number;
    sizes?: string;
    unoptimized?: boolean;
    className: string;
  }) => (
    <Image
      key={src}
      src={src}
      alt={
        slot === ArtistImages.photo
          ? t(($) => $.music.artists.photo, { artist: artist.artist })
          : t(($) => $.music.artists.logo, { artist: artist.artist })
      }
      width={width}
      height={height}
      sizes={sizes}
      unoptimized={unoptimized}
      style={{ height: "auto" }}
      priority
      onError={() => setMissing((prev) => [...prev, src])}
      className={className}
    />
  );

  // Modal accordions are card-colored sections themselves, so rows stripe with secondary there.
  const stripe = isModal ? "odd:bg-secondary" : "odd:bg-card";

  const creditInfo = (credit: Credit) => (
    <div
      key={credit.name}
      className={cn("rounded-secondary px-2 py-1 flex items-center gap-2", stripe)}
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

  const frame =
    "bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-primary w-full";

  // Padding plus the trigger's own `p-2` lines the title up with the header and description.
  const accordionClassName = isModal
    ? cn(frame, "p-1 sm:p-2 md:px-4")
    : "p-2 rounded-secondary bg-secondary hc:border hc:border-border";

  const heading = (
    <>
      <h2 className="text-xl font-bold leading-tight">{artist.artist}</h2>
      {artist.location ? (
        <p className="text-muted-foreground font-medium">{artist.location}</p>
      ) : null}
    </>
  );

  // The modal format pins the heading in its header instead.
  const identity = isModal ? null : (
    <div className="flex items-start gap-4">
      {rank ? (
        <div className="text-4xl sm:text-6xl font-bold text-theme-600 text-right leading-none pt-1 font-mono shrink-0">
          {rank < 10 ? <>&nbsp;</> : ""}
          {rank}
        </div>
      ) : null}
      <div className="min-w-0">{heading}</div>
    </div>
  );

  const description = (
    <>
      {logo ? (
        <div className="flex justify-center">
          {artistImage({
            ...logo,
            width: 256,
            height: 256,
            unoptimized: true,
            className: "w-auto max-w-full max-h-48 h-auto",
          })}
        </div>
      ) : null}
      <div className="flex gap-3 flex-col sm:flex-row sm:gap-6 sm:items-start">
        {identity || artist.bio ? (
          <div className="flex flex-col gap-3 sm:flex-1">
            {identity}
            {artist.bio ? <p className="text-sm whitespace-pre-line">{artist.bio}</p> : null}
          </div>
        ) : null}

        {photos.length ? (
          <div
            className={cn(
              "shrink-0 flex sm:flex-col gap-2 justify-center",
              !isModal ? "lg:flex-row" : null,
            )}
          >
            {photos.map((photo) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => openModal(photo.src)}
                className="cursor-pointer"
              >
                {artistImage({
                  ...photo,
                  width: 256,
                  height: 256,
                  className: "w-64 h-auto rounded-secondary",
                })}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );

  const hasMembers = Boolean(artist.members?.length || artist.formerMembers?.length);

  const accordions = (
    <>
      {artist.members?.length ? (
        <Accordion
          title={t(($) => $.music.artists.members)}
          classNames={accordionClassName}
          defaultOpen={!isModal}
        >
          <div className="text-sm">{artist.members.map(creditInfo)}</div>
        </Accordion>
      ) : null}
      {artist.formerMembers?.length ? (
        <Accordion
          title={t(($) => $.music.artists.former_members)}
          classNames={accordionClassName}
          defaultOpen={false}
        >
          <div className="text-sm">{artist.formerMembers.map(creditInfo)}</div>
        </Accordion>
      ) : null}
    </>
  );

  const albumStrip =
    discography.length && musicList === MusicLists.artists ? (
      <>
        <AlbumStrip
          albums={discography}
          title={t(($) => $.music.artists.albums)}
          onSelect={openAlbum}
        />
        <AlbumCardModal album={selectedAlbum} onClose={closeAlbum} />
      </>
    ) : null;

  const imageModal = (
    <Modal
      className="bg-background"
      open={imageModalOpen}
      onClose={closeModal}
      title={t(($) => $.music.artists.photo, { artist: artist.artist })}
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
              src={selectedImage}
              alt=""
              width={1024}
              height={1024}
              sizes="100vw"
              style={{ height: "auto" }}
              className="w-full max-h-screen object-contain"
            />
          </button>
        </div>
      ) : null}
    </Modal>
  );

  if (isModal) {
    return (
      <MusicCardModalLayout
        sectionClassName={frame}
        heading={heading}
        onClose={onClose}
        footer={hasMembers ? accordions : null}
      >
        {description}
        {albumStrip}
        {imageModal}
      </MusicCardModalLayout>
    );
  }

  return (
    <div className={cn(frame, "p-3 sm:p-4 md:p-6 flex flex-col gap-3")}>
      {description}
      {hasMembers ? <div className="space-y-2">{accordions}</div> : null}
      {albumStrip}
      {imageModal}
    </div>
  );
}
