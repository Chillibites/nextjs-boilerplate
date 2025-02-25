import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");

  if (!filename) {
    return NextResponse.json({ error: "Filename is missing" }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Upload the file to Vercel Blob (<4.5 MB)
  const blob = await put(filename, request.body, {
    access: "public",
  });

  return NextResponse.json(blob);
} 