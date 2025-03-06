import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { Attachment, Chapter, Course, UserProgress } from "@prisma/client";
interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
}

export const getChapter = async ({ userId, courseId, chapterId }: GetChapterProps) => {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return null;
        }

        const purchase = await prisma.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        

        const course = await prisma.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
            select: {
                id: true,
                price: true,
            },
        });

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
        });

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        }
        
        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapterId: Chapter | null = null;

        if (purchase) {
            attachments = await prisma.attachment.findMany({
                where: {
                    courseId: courseId,
                },
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await prisma.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                },
            });

            nextChapterId = await prisma.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter.position,
                    },
                },
                orderBy: {
                    position: "asc",
                },
            });
        }

        const userProgress = await prisma.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });
        
        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapterId,
            userProgress,
            purchase,
        }
        
    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: [],
            nextChapterId: null,
            userProgress: null,
            purchase: null,
        }
    }
}