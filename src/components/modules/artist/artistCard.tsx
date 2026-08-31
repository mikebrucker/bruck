"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useStyleStore } from "@/stores/useStyleStore";
import type { Credit } from "@/types/album";
import type { Artist } from "@/types/artist";
import { Themes } from "@/types/settings";

type ArtistCardProps = {
  artist: Artist;
  isModal?: boolean;
  onClose?: () => void;
};

export default function ArtistCard({ artist, isModal, onClose }: ArtistCardProps) {
  const { t } = useTranslation();
  const theme = useStyleStore((s) => s.theme);
  const [missing, setMissing] = useState<Array<string>>([]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

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
    className,
  }: {
    slot: keyof typeof ArtistImages;
    src: string;
    width: number;
    height: number;
    sizes?: string;
    className: string;
  }) => (
    <Image
      key={src}
      src={src}
      alt={
        slot === ArtistImages.photo
          ? t(($) => $.artists.photo, { artist: artist.artist })
          : t(($) => $.artists.logo, { artist: artist.artist })
      }
      width={width}
      height={height}
      sizes={sizes}
      style={{ height: "auto" }}
      priority
      onError={() => setMissing((prev) => [...prev, src])}
      className={className}
    />
  );

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
      {logo ? (
        <div className="flex justify-center">
          {artistImage({
            ...logo,
            width: 256,
            height: 256,
            sizes: "(min-width: 640px) 720px, 100vw",
            className: "w-full max-h-48 h-auto object-contain",
          })}
        </div>
      ) : null}
      <div className="sm:flex sm:gap-6 sm:items-start">
        <div className="flex flex-col gap-3 sm:flex-1">
          <div>
            <h2 className="text-xl font-bold leading-tight">{artist.artist}</h2>
            {artist.location ? (
              <p className="text-muted-foreground font-medium">{artist.location}</p>
            ) : null}
          </div>

          {artist.bio ? <p className="text-sm whitespace-pre-line">{artist.bio}</p> : null}
        </div>

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

      <Modal
        className="bg-background"
        open={imageModalOpen}
        onClose={closeModal}
        title={t(($) => $.artists.photo, { artist: artist.artist })}
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
    </div>
  );
}
