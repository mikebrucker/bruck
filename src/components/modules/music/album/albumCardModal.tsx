"use client";

import AlbumCard from "@/components/modules/music/album/albumCard";
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
      overlayClassName="overflow-y-auto"
      className="max-w-3xl w-full self-start my-modal-offset overflow-visible mobile-landscape:max-w-xl"
    >
      {album ? <AlbumCard album={album} isModal onClose={onClose} /> : null}
    </Modal>
  );
}
