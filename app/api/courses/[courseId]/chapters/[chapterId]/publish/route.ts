import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
    params: Promise<{
        courseId: string;
        chapterId: string;
    }>;
}
export async function PATCH(
    req: Request,
    { params }: Params
) {
    try {
        const session = await getSession();

    if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, chapterId } = await params;

    const courseOwner = await prisma.course.findUnique({
        where: {
            id: courseId,
            userId: session.user.id,
        },
    });

    if (!courseOwner) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await prisma.chapter.findUnique({
        where: {
            id: chapterId,
        },
    });
    
    if (!chapter || !chapter.title || !chapter.description) {
        return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedChapter = await prisma.chapter.update({
        where: { id: chapterId },
        data: {
            isPublished: true,
        },
    });

    return NextResponse.json(publishedChapter);
} catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
