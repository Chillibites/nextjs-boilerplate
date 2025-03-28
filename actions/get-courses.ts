import { Category, Course } from "@prisma/client";

import getProgress from "@/actions/get-progress";
import { prisma } from "@/lib/prisma";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";


type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async ({ userId, title, categoryId }: GetCourses ): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const session = await getSession();
        if (!session?.user) {
            redirect("/")
        }

        const courses = await prisma.course.findMany({
            where: {
                isPublished: true,
                title: { contains: title },
                categoryId,
            },
            include: {
                category: true,
                chapters: { where: {
                     isPublished: true,
                     },
                     select: {
                        id: true,
                     }
             },
             purchases: {
                where : {
                    userId,
                }
             }
            },
            orderBy: {
                createdAt: "desc",
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async (course) => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null,
                    };
                }

        const progressPercentage = await getProgress({ userId, courseId: course.id });
            return {
            ...course,
                progress: progressPercentage,
                };
            })
        );

        return coursesWithProgress;
        
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}