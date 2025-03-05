/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */

import { Chapter, Course, UserProgress } from "@prisma/client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CourseSidebarItem } from "./course-navbar-item";
import Link from "next/link";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({ course, progressCount }: CourseSidebarProps) => {
    const session = await auth();
    if (!session?.user?.id) {
        return redirect("/");
    }

    const purchase = await prisma.purchase.findUnique({
        where: {
            userId_courseId: {
                userId: session.user.id,
                courseId: course.id,
            },
        },
    });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
        <div className="p-8 sm:p-5 flex flex-col items-center border-b bg-[hsl(var(--card))]">
            <img
                src="/logo.svg"
                alt="App Logo"
                className="w-10 h-10 mb-4 rounded-full shadow-md"
            />
            <h1 className="font-bold text-xl text-center text-[hsl(var(--foreground))]">
                {course.title}
            </h1>
            {/* TODO: Add progress and check if the course is purchased */}
            
        </div>
        <div className="flex-1 w-full">
            {course.chapters.map((chapter) => (
                <CourseSidebarItem 
                    key={chapter.id} 
                    label={chapter.title}
                    id={chapter.id}
                    courseId={course.id}
                    isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                    isLocked={!chapter.isFree && !purchase}
                />
            ))}
        </div>
    </div>
  );
};
