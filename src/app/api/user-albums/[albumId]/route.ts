import { NextResponse } from "next/server";
import { z } from "zod";
import {
  HonorableRankedError,
  RankedHonorableError,
  userAlbumRepository,
} from "@/data/userAlbumRepository";
import { userAlbumUpdateSchema } from "@/data/userAlbumSchema";
import { isAuthorized } from "@/lib/auth";
import type { UserAlbum } from "@/types/userAlbum";

export async function PATCH(
  request: Request,
  { params }: RouteContext<"/api/user-albums/[albumId]">,
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { albumId } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = userAlbumUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  try {
    let updated: UserAlbum | null = null;
    if (parsed.data.trackId !== undefined) {
      updated = await userAlbumRepository.setTrackId(albumId, parsed.data.trackId);
    }
    if (parsed.data.review !== undefined) {
      updated = await userAlbumRepository.setReview(albumId, parsed.data.review);
    }
    if (parsed.data.honorable !== undefined) {
      updated = await userAlbumRepository.setHonorable(albumId, parsed.data.honorable);
    }
    if (parsed.data.rank !== undefined) {
      updated = await userAlbumRepository.setRank(albumId, parsed.data.rank);
    }
    if (!updated) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof RankedHonorableError || error instanceof HonorableRankedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(`Failed to update user album "${albumId}"`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
