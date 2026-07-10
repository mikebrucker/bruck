import { AlbumsClient } from "@/app/[lang]/music/albumsClient";
import { albumRepository } from "@/data/albumRepository";
import { userAlbumRepository } from "@/data/userAlbumRepository";

export default async function AlbumsPage() {
  const [albums, userAlbums] = await Promise.all([
    albumRepository.getAll(),
    userAlbumRepository.getAll(),
  ]);

  const albumById = new Map(albums.map((album) => [album.id, album]));

  const rankedAlbums = userAlbums
    .filter((userAlbum) => userAlbum.rank !== null)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
    .map((userAlbum) => albumById.get(userAlbum.albumId))
    .filter((album) => album !== undefined);

  const honorableMentionAlbums = userAlbums
    .filter((userAlbum) => userAlbum.honorable)
    .map((userAlbum) => albumById.get(userAlbum.albumId))
    .filter((album) => album !== undefined)
    .map((album) => ({ album, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ album }) => album);

  return (
    <AlbumsClient
      rankedAlbums={rankedAlbums}
      honorableMentionAlbums={honorableMentionAlbums}
      userAlbums={userAlbums}
    />
  );
}
