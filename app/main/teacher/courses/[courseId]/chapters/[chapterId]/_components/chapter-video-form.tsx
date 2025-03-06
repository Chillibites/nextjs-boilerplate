"use client";

import { useState } from "react";
import MuxUploader from "./MuxUploader";
import MuxPlayer from "@/components/MuxPlayer";

type ChapterVideoProps = {
  // When the chapter already has a video, the server can pass these in.
  initialVideoData?: {
    playbackId: string;
    assetId: string;
  };
  courseId: string;
  chapterId: string;
};

export default function ChapterVideoForm({
  initialVideoData,
  courseId,
  chapterId,
}: ChapterVideoProps) {
  // Holds the current video for the chapter (if any)
  const [videoData, setVideoData] = useState<
    { playbackId: string; assetId: string } | null
  >(initialVideoData || null);

  // When starting an upload, we need both the upload URL (for the client-side uploader)
  // and the uploadId (so we can later poll Mux for asset creation)
  const [uploadSession, setUploadSession] = useState<{
    url: string;
    uploadId: string;
  } | null>(null);
  const [uploading, setUploading] = useState(false);

  // Call our API endpoint to create a new Mux upload session.
  const startUpload = async () => {
    const res = await fetch(
      `/api/courses/${courseId}/chapters/${chapterId}/create-upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await res.json();
    if (data.url && data.uploadId) {
      setUploadSession({ url: data.url, uploadId: data.uploadId });
      setUploading(true);
    }
  };

  // When the uploader signals success,
  // call our API endpoint to poll Mux until the asset is ready
  // and retrieve its public playback-ID.
  const handleUploadSuccess = async () => {
    if (!uploadSession) return;
    const res = await fetch(
      `/api/courses/${courseId}/chapters/${chapterId}/update-video`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId: uploadSession.uploadId }),
      }
    );
    const updated = await res.json();
    if (updated.playbackId && updated.assetId) {
      // In a real app you'd update your chapter record here.
      setVideoData({
        playbackId: updated.playbackId,
        assetId: updated.assetId,
      });
      setUploading(false);
      setUploadSession(null);
    }
  };

  return (
    <div className="space-y-4">
      {videoData ? (
        <div>
          <h2 className="text-lg font-bold">Current Video</h2>
          <div className="bg-black aspect-video mb-4">
            <MuxPlayer playbackId={videoData.playbackId} className="w-full" />
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={startUpload}
          >
            Replace Video
          </button>
        </div>
      ) : (
        <div>
          <p>No video has been uploaded for this chapter.</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={startUpload}
          >
            Upload Video
          </button>
        </div>
      )}

      {uploading && uploadSession && (
        <div>
          <p className="font-mono text-sm mb-2">Uploading video…</p>
          <MuxUploader
            endpoint={uploadSession.url}
            onSuccess={handleUploadSuccess}
          />
        </div>
      )}
    </div>
  );
}