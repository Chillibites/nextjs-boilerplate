import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

// reads MUX_TOKEN_ID and MUX_TOKEN_SECRET from your environment
const mux = new Mux();

export async function POST() {
  try {
    // Create a new upload session in Mux.
    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        playback_policy: ["public"],
        encoding_tier: "baseline",
      },
      // Adjust cors_origin as needed for production.
      cors_origin: "*",
    });

    return NextResponse.json({
      url: upload.url,
      uploadId: upload.id,
    });
  } catch (error) {
    console.error("Error creating Mux upload session:", error);
    return NextResponse.json(
      { error: "Error creating upload" },
      { status: 500 }
    );
  }
} 