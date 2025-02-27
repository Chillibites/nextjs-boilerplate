import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface ChapterPageProps {
    params: Promise<{
        courseId: string;
    }>;
}

export async function POST(
    req: Request,
    { params }: ChapterPageProps
) {
    try {
        const session = await getSession();
        const { courseId } = await params;
        const { title } = await req.json();

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId: session.user.id,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await prisma.chapter.findFirst({
            where: {
                courseId: courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await prisma.chapter.create({
            data: {
                title,
                position: newPosition,
                courseId: courseId,
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.log("[COURSE_ID_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}