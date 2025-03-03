import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const mux = new Mux();

// Helper: Poll for asset until it is ready.
async function pollForAsset(
  uploadId: string,
  maxAttempts = 10,
  intervalMs = 3000
): Promise<{ assetId: string; playbackId: string }> {
  let attempts = 0;
  while (attempts < maxAttempts) {
    const upload = await mux.video.uploads.retrieve(uploadId);
    if (upload.asset_id) {
      // Retrieve the asset details.
      const asset = await mux.video.assets.retrieve(upload.asset_id);

      // Check if the asset is ready.
      if (asset.status === "ready") {
        const playbackIdObj = (asset.playback_ids || []).find(
          (p: { policy: string; id: string }) => p.policy === "public"
        );
        if (playbackIdObj && playbackIdObj.id) {
          return { assetId: upload.asset_id, playbackId: playbackIdObj.id };
        } else {
          throw new Error("Playback ID not available even though asset is ready.");
        }
      } else if (asset.status === "errored") {
        throw new Error("Asset processing errored.");
      }
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempts++;
  }
  throw new Error("Asset not ready after maximum attempts");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  // Await the params before using its values.
  const { chapterId } = await params;

  try {
    const body = await request.json();
    const { uploadId } = body;
    if (!uploadId) {
      return NextResponse.json(
        { error: "uploadId not provided" },
        { status: 400 }
      );
    }
    // Poll until the asset is created.
    const videoData = await pollForAsset(uploadId);

    // Update (or create) the MuxData record for this chapter.
    await prisma.muxData.upsert({
      where: { chapterId },
      update: {
        assetId: videoData.assetId,
        playbackId: videoData.playbackId,
      },
      create: {
        chapterId,
        assetId: videoData.assetId,
        playbackId: videoData.playbackId,
      },
    });

    // Now, save the video URL on the chapter record.
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { videoUrl: `https://stream.mux.com/${videoData.playbackId}.m3u8` },
    });

    // Return the video data to the client.
    return NextResponse.json(videoData);
  } catch (error) {
    console.error("Error updating chapter video:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 