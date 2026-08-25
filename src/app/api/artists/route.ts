import { NextResponse } from "next/server";
import { z } from "zod";
import { artistCreateSchema, artistRepository } from "@/data/artistRepository";
import { isAuthorized } from "@/lib/auth";
import { isPgError, PgErrors } from "@/lib/pgError";

export async function GET() {
  const artists = await artistRepository.getAll();
  return NextResponse.json(artists);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = artistCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  try {
    const created = await artistRepository.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (isPgError(error, PgErrors.uniqueViolation)) {
      return NextResponse.json(
        { error: "An artist with this name already exists" },
        { status: 409 },
      );
    }
    console.error("Failed to create artist", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
