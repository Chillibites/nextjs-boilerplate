import getSession from "@/lib/getSession";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
    params: Promise<{
        courseId: string;
    }>;
}

export async function PUT(
    req: Request,
    { params }: Params
) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        // Await the params promise to extract dynamic route parameters.
        const { courseId } = await params;
        const { list } = await req.json();

        const courseOwner = await prisma.course.findUnique({
            where: {
                id: courseId,
                userId: session.user.id,
            },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        for (const item of list) {
            await prisma.chapter.update({
                where: { id: item.id },
                data: { position: item.position },
            });
        }

        return NextResponse.json({ message: "Chapters reordered" });
        
    } catch (error) {
        console.log("[CHAPTERS_REORDER]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}