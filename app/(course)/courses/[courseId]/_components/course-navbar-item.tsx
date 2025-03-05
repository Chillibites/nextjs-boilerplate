"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseSidebarItemProps {
    label: string;
    id: string;
    isCompleted: boolean;
    courseId: string;
    isLocked: boolean;
}

export const CourseSidebarItem = (props: CourseSidebarItemProps) => {
    const { label, id, isCompleted, isLocked, courseId } = props;
    const pathname = usePathname();
    const router = useRouter();

    const Icon = isLocked ? Lock : (isCompleted ? CheckCircle : PlayCircle);

    const isActive = pathname?.includes(id);

    const onClick = () => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    }

    return (
        <Button
        type="button"
        aria-current={isActive ? "page" : undefined}
        onClick={onClick}
        className={cn(
            "flex justify-start gap-3 items-center w-full text-sm font-medium px-6 py-4 transition ease-in-out duration-200 rounded-md active:scale-95",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--ring))]",
            "bg-transparent",
            "text-[hsl(var(--card-foreground))]",
            "cursor-pointer",
            isLocked && "opacity-50",
            !isLocked && "hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--primary))]",
            isActive && "bg-[hsl(var(--muted))] text-[hsl(var(--primary))]"
        )}
        >
            <Icon
            size={22}
            className={cn(
                "transition-colors duration-200",
                (isActive || !isLocked) && "hover:text-[hsl(var(--primary))]",
                isActive ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--card-foreground))]"
            )}
            />
            <span 
                className="flex-1 text-left truncate" 
                title={label}
            >
                {label}
            </span>
            <div
            className={cn(
                "w-1 h-full rounded-full transition-all duration-200",
                isActive ? "bg-[hsl(var(--primary))]" : "bg-transparent"
            )}
            />
        </Button>
    )
}