"use client";

import { Vynil02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Loader from "@/components/modules/loader";
import { Accordion } from "@/components/ui/accordion";
import { Modal } from "@/components/ui/modal";
import type { Album, Credit } from "@/types/album";

type AlbumCardProps = {
  album: Album;
  rank?: number;
};

export default function AlbumCard({ album, rank }: AlbumCardProps) {
  const { t } = useTranslation();

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

  const art = album.art?.map((a) => (
    <div key={a}>
      <Image
        onClick={() => openModal(a)}
        src={`/${a}`}
        alt={t(($) => $.albums.cover_art, { album: album.album })}
        width={256}
        height={256}
        className="rounded-sm object-cover cursor-pointer"
      />
    </div>
  ));

  const personnelInfo = (credit: Credit) => (
    <div key={credit.name} className="odd:bg-card rounded px-2 py-1 flex items-center gap-2">
      <div className="flex-1">
        <span className="font-medium">{credit.name}</span>
        {credit.notes ? (
          <p className="text-muted-foreground italic text-xs">
            {t(($) => $.albums.notes)}: {credit.notes}
          </p>
        ) : null}
      </div>
      <span className="text-muted-foreground shrink-0">{credit.roles.join(", ")}</span>
    </div>
  );

  return (
    <div className="bg-card text-card-foreground border border-border border-l-4 border-l-theme-500 rounded-lg p-3 sm:p-4 md:p-6 flex flex-col gap-3 w-full transition-shadow duration-200">
      <div className="sm:flex sm:gap-6 sm:items-start">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 items-start sm:flex-1">
          {rank ? (
            <div className="row-span-1 sm:row-span-3 text-4xl sm:text-6xl font-bold text-theme-600 text-right leading-none pt-1 font-mono">
              {rank < 10 ? <>&nbsp;</> : ""}
              {rank}
            </div>
          ) : (
            <div className="row-span-1 sm:row-span-3 text-theme-600 pt-1 flex justify-end">
              <HugeiconsIcon icon={Vynil02Icon} className="w-10 h-10 sm:w-14 sm:h-14" />
            </div>
          )}

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

          <p className="col-span-2 sm:col-span-1 bg-accent border border-border border-l-4 border-l-theme-500 rounded-lg p-3 text-sm leading-relaxed italic">
            {album.review}
          </p>
        </div>

        <div className="hidden sm:flex shrink-0 sm:flex-col lg:flex-row gap-1">{art}</div>
      </div>

      <div className="space-y-2">
        {album.discs.map((disc) => {
          let title = disc.title ?? t(($) => $.albums.tracks);
          if (album.discs.length > 1 && !disc.title)
            title = t(($) => $.albums.disc, { number: disc.disc });

          return (
            <Accordion key={disc.disc} title={title} classNames="p-2 rounded-md bg-secondary">
              <div>
                {disc.tracks.map((track) => (
                  <div
                    key={track.number}
                    className="flex gap-2 text-sm odd:bg-card rounded px-2 py-1 transition-colors"
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

        {album.personnel ? (
          <div>
            <Accordion
              title={t(($) => $.albums.personnel)}
              classNames="p-2 rounded-md bg-secondary"
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
                        <div key={studio} className="odd:bg-card rounded px-2 py-1">
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
                      <div className="rounded px-2 py-1">{album.personnel.notes}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </Accordion>
          </div>
        ) : null}
        <Modal open={imageModalOpen} onClose={closeModal}>
          {selectedImage ? (
            <div className="relative">
              <Loader
                className="text-theme-500"
                isOpen={imageLoading}
                fullScreen
                transparentBg
                onClick={closeModal}
              />
              <Image
                onClick={closeModal}
                onLoad={() => setImageLoading(false)}
                src={`/${selectedImage}`}
                alt={t(($) => $.albums.cover_art, { album: album.album })}
                width={1024}
                height={1024}
                className="w-full h-auto cursor-pointer"
              />
            </div>
          ) : null}
        </Modal>
      </div>
    </div>
  );
}
