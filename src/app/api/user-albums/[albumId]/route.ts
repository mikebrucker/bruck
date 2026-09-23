import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AlbumNotFoundError,
  HonorableRankedError,
  RankedHonorableError,
  userAlbumRepository,
} from "@/data/userAlbumRepository";
import { userAlbumUpdateSchema } from "@/data/userAlbumSchema";
import { isAuthorized } from "@/lib/auth";

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
    const [updated] = await userAlbumRepository.applyUpdates([{ albumId, ...parsed.data }]);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof AlbumNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof RankedHonorableError || error instanceof HonorableRankedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error(`Failed to update user album "${albumId}"`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
