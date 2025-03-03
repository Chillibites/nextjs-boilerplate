import getSession from "@/lib/getSession";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

interface Params {
    params: Promise<{
        courseId: string;
        chapterId: string;
    }>;
}

export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { courseId, chapterId } = await params;
        const session = await getSession();
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

        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
        });

        if (!chapter) {
            return new NextResponse("Chapter not found", { status: 404 });
        }

        const videoUrl = chapter.videoUrl;

        const deletedChapter = await prisma.chapter.delete({
            where: {
                id: chapterId,
            },
        });

        if (videoUrl) {
            const existingMuxData = await prisma.muxData.findUnique({
                where: {
                    id: videoUrl,
                },
            });

            if (existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await prisma.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }
        }

        const publishedChaptersInCourse = await prisma.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
        });

        if (publishedChaptersInCourse.length === 0) {
            await prisma.course.update({
                where: { id: courseId },
                data: { isPublished: false },
            });
        }
        return NextResponse.json(deletedChapter);
    } catch (error) {
        console.log("[CHAPTERS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
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