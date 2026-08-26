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
      showClose
      title={album?.album}
      className="max-w-3xl h-[80dvh] w-full rounded-primary overflow-y-auto"
    >
      {album ? (
        <div className="px-2 pb-1">
          <AlbumCard album={album} isModal />
        </div>
      ) : null}
    </Modal>
  );
}
