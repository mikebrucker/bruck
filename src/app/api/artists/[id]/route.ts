import { NextResponse } from "next/server";
import { z } from "zod";
import { artistRepository, artistUpdateSchema } from "@/data/artistRepository";
import { isAuthorized } from "@/lib/auth";
import { isPgError, PgErrors } from "@/lib/pgError";

export async function GET(_request: Request, { params }: RouteContext<"/api/artists/[id]">) {
  const { id } = await params;

  const artist = await artistRepository.getById(id);
  if (!artist) {
    return NextResponse.json({ error: `Artist "${id}" not found` }, { status: 404 });
  }
  return NextResponse.json(artist);
}

export async function PATCH(request: Request, { params }: RouteContext<"/api/artists/[id]">) {
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

  const parsed = artistUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  try {
    const updated = await artistRepository.update(id, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: `Artist "${id}" not found` }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    if (isPgError(error, PgErrors.uniqueViolation)) {
      return NextResponse.json(
        { error: "An artist with this name already exists" },
        { status: 409 },
      );
    }
    console.error(`Failed to update artist "${id}"`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext<"/api/artists/[id]">) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deleted = await artistRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: `Artist "${id}" not found` }, { status: 404 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isPgError(error, PgErrors.foreignKeyViolation)) {
      return NextResponse.json(
        { error: `Artist "${id}" still has albums; delete or reassign them first` },
        { status: 409 },
      );
    }
    console.error(`Failed to delete artist "${id}"`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
