"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";

interface ChapterActionProps {
    disabled: boolean;  
    chapterId: string;
    courseId: string;
    isPublished: boolean;
}

export const ChapterAction = ({ chapterId, courseId, isPublished, disabled }: ChapterActionProps) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);

            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Chapter unpublished");
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter published");
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };


    const onDelete = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);
            toast.success("Chapter deleted");
            router.refresh();
            router.push(`/main/teacher/courses/${courseId}`);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="ghost"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button
                    disabled={isLoading}
                    variant="ghost"
                    size="sm"
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    );
};