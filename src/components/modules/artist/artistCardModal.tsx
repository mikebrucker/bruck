"use client";

import ArtistCard from "@/components/modules/artist/artistCard";
import { Modal } from "@/components/ui/modal";
import type { Artist } from "@/types/artist";

type ArtistCardModalProps = {
  artist: Artist | null;
  onClose: () => void;
};

export default function ArtistCardModal({ artist, onClose }: ArtistCardModalProps) {
  return (
    <Modal
      open={artist !== null}
      onClose={onClose}
      title={artist?.artist}
      className="max-w-3xl max-h-[80dvh] w-full rounded-primary overflow-y-auto"
    >
      {artist ? <ArtistCard artist={artist} isModal onClose={onClose} /> : null}
    </Modal>
  );
}
