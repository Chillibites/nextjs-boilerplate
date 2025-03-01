import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";
import getSession from "@/lib/getSession";
import type { Prisma } from "@prisma/client";

interface CoursePageProps {
    params: Promise<{
        courseId: string;
    }>;
}   

export async function PATCH(
    req: Request,
    { params }: CoursePageProps
) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { courseId } = await params;
        const body = await req.json();
        const { attachments, ...data } = body;

        // Use Prisma.CourseUpdateInput instead of using any
        const updateData: Prisma.CourseUpdateInput = {
            ...data,
        };

        if (attachments) {
            updateData.attachments = {
                deleteMany: {},
                create: attachments.map((att: { name: string; url: string }) => ({
                    name: att.name,
                    url: att.url,
                })),
            };
        }

        const updatedCourse = await prisma.course.update({
            where: {
                userId: session.user.id,
                id: courseId,
            },
            data: updateData,
            include: { attachments: true },
        });

        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}