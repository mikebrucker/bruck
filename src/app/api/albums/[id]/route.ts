import { NextResponse } from "next/server";
import { z } from "zod";
import { albumRepository, albumUpdateSchema } from "@/data/albumRepository";
import { isAuthorized } from "@/lib/auth";

export async function GET(_request: Request, { params }: RouteContext<"/api/albums/[id]">) {
  const { id } = await params;

  const album = await albumRepository.getById(id);
  if (!album) {
    return NextResponse.json({ error: `Album "${id}" not found` }, { status: 404 });
  }
  return NextResponse.json(album);
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/albums/[id]">) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = albumUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  try {
    const updated = await albumRepository.update(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: `Album "${id}" not found` }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error(`Failed to update album "${id}"`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext<"/api/albums/[id]">) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await albumRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: `Album "${id}" not found` }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(`Failed to delete album "${id}"`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
