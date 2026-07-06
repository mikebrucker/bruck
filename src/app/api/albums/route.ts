import { NextResponse } from "next/server";
import { z } from "zod";
import { albumCreateSchema, albumRepository } from "@/data/albumRepository";
import { isAuthorized } from "@/lib/auth";

export async function GET() {
  const albums = await albumRepository.getAll();
  return NextResponse.json(albums);
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

  const parsed = albumCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  const existing = await albumRepository.getById(parsed.data.id);
  if (existing) {
    return NextResponse.json(
      { error: `Album "${parsed.data.id}" already exists` },
      { status: 409 },
    );
  }

  try {
    const created = await albumRepository.create(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error(`Failed to create album "${parsed.data.id}"`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
