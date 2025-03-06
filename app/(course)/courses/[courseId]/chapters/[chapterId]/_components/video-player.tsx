"use client";

import { Lock } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MuxPlayer from "@/components/MuxPlayer";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    playbackId: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    isLocked: boolean;
    completeOnEnd: boolean;
    title: string;
}

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    const handleEnded = () => {
        // Log chapterId to demonstrate usage
        console.log("Video ended for chapter:", chapterId);
        // If the chapter is complete on end and a next chapter exists, navigate to it.
        if (completeOnEnd && nextChapterId) {
            router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
    };

    return (
        <div className="relative aspect-video">
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-orange-600">
                    <Lock className="h-8 w-8 text-secondary" />
                    <p className="text-sm text-secondary">This chapter is locked</p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    playbackId={playbackId}
                    title={title}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={handleEnded}
                    style={{ aspectRatio: "16/9" }}
                    autoPlay
                    className={cn(!isReady && "hidden")}
                />
            )}
        </div>
    );
};