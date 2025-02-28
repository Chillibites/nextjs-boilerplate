import getSession from "@/lib/getSession";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        
        // Await the params promise to extract dynamic route parameters.
        const { courseId, chapterId } = await params;
        const { isFree, title, description } = await req.json();

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId: session.user.id,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await prisma.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                title: title,
                description: description,
                isFree: isFree,
            },
        });

        return NextResponse.json(chapter);
        
    } catch (error) {
        console.log("[CHAPTERS_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}