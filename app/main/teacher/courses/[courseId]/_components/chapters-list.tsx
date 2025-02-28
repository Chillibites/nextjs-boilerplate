"use client";

import { Chapter } from "@prisma/client";
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChaptersListProps {
    items: Chapter[];
    onEdit: (id: string) => void;
    onReorder: (updateData: { id: string; position: number }[]) => void;
}

export const ChaptersList = ({
    items,
    onEdit,
    onReorder,
}: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setChapters(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        // Create a reordered copy of chapters.
        const reorderedChapters = Array.from(chapters);
        const [reorderedItem] = reorderedChapters.splice(result.source.index, 1);
        reorderedChapters.splice(result.destination.index, 0, reorderedItem);

        setChapters(reorderedChapters);
        onReorder(
            reorderedChapters.map((item, index) => ({
                id: item.id,
                position: index,
            }))
        );
    };

    if (!isMounted) return null;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                        role="list"
                    >
                        {chapters.map((chapter, index) => (
                            <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                {(provided, snapshot) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={cn(
                                            "bg-slate-100 border border-gray-200 rounded-lg shadow-sm transition duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                                            chapter.isPublished 
                                                ? "bg-green-500 hover:bg-green-600 text-white"
                                                : "",
                                            snapshot.isDragging && "opacity-75"
                                        )}
                                        role="listitem"
                                        aria-roledescription="Draggable chapter item"
                                        aria-label={`Chapter: ${chapter.title} ${
                                            chapter.isPublished ? "Published" : "Draft"
                                        }${chapter.isFree ? " - Free chapter" : ""}`}
                                    >
                                        <div className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    title="Drag to reorder"
                                                    {...provided.dragHandleProps}
                                                    className="focus:outline-none"
                                                    aria-label="Drag to reorder"
                                                >
                                                    <Grip className="h-5 w-5 text-gray-500 cursor-move" />
                                                </button>
                                                <span className="font-semibold text-gray-800">
                                                    {chapter.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {chapter.isFree && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        aria-label="Free chapter"
                                                    >
                                                        Free
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    className={cn(
                                                        chapter.isPublished && "bg-slate-500 hover:bg-slate-600 text-white"
                                                    )}
                                                    aria-label={chapter.isPublished ? "Published" : "Draft"}
                                                >
                                                    {chapter.isPublished ? "Published" : "Draft"}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    aria-label={`Edit chapter: ${chapter.title}`}
                                                    onClick={() => onEdit(chapter.id)}
                                                >
                                                    <Pencil className="h-5 w-5 text-gray-500 hover:text-blue-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}