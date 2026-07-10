import { NextResponse } from "next/server";
import { userAlbumRepository } from "@/data/userAlbumRepository";

export async function GET() {
  const userAlbums = await userAlbumRepository.getAll();
  return NextResponse.json(userAlbums);
}
