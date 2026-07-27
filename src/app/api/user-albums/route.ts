import { NextResponse } from "next/server";
import { z } from "zod";
import {
  DuplicateAlbumUpdateError,
  HonorableRankedError,
  RankedHonorableError,
  userAlbumRepository,
} from "@/data/userAlbumRepository";
import { userAlbumBulkUpdateSchema } from "@/data/userAlbumSchema";
import { isAuthorized } from "@/lib/auth";

export async function GET() {
  const userAlbums = await userAlbumRepository.getAll();
  return NextResponse.json(userAlbums);
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = userAlbumBulkUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  try {
    const updated = await userAlbumRepository.applyUpdates(parsed.data.updates);
    return NextResponse.json(updated);
  } catch (error) {
    if (
      error instanceof RankedHonorableError ||
      error instanceof HonorableRankedError ||
      error instanceof DuplicateAlbumUpdateError
    ) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Failed to update user albums", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
