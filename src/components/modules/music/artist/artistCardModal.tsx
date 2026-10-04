"use client";

import ArtistCard from "@/components/modules/music/artist/artistCard";
import { Modal } from "@/components/ui/modal";
import type { Album } from "@/types/album";
import type { Artist } from "@/types/artist";

type ArtistCardModalProps = {
  artist: Artist | null;
  albums?: Array<Album>;
  onClose: () => void;
};

export default function ArtistCardModal({ artist, albums, onClose }: ArtistCardModalProps) {
  return (
    <Modal
      open={artist !== null}
      onClose={onClose}
      title={artist?.artist}
      overlayClassName="overflow-y-auto"
      className="max-w-3xl w-full self-start my-modal-offset overflow-visible mobile-landscape:max-w-xl"
    >
      {artist ? <ArtistCard artist={artist} albums={albums} isModal onClose={onClose} /> : null}
    </Modal>
  );
}
