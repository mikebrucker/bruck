"use client";

import AlbumCard from "@/components/modules/album/albumCard";
import { Modal } from "@/components/ui/modal";
import type { Album } from "@/types/album";

type AlbumCardModalProps = {
  album: Album | null;
  onClose: () => void;
};

export default function AlbumCardModal({ album, onClose }: AlbumCardModalProps) {
  return (
    <Modal
      open={album !== null}
      onClose={onClose}
      title={album?.album}
      className="max-w-3xl h-[80dvh] w-full rounded-primary overflow-y-auto"
    >
      {album ? <AlbumCard album={album} isModal onClose={onClose} /> : null}
    </Modal>
  );
}
