import { NextResponse } from "next/server";
import { z } from "zod";
import { userRepository } from "@/data/userRepository";
import { userSettingsUpdateSchema } from "@/data/userSchema";
import { isAuthorized } from "@/lib/auth";

export async function GET() {
  const user = await userRepository.get();
  return NextResponse.json(user);
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

  const parsed = userSettingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  try {
    const updated = await userRepository.updateSettings(parsed.data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update user settings", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
