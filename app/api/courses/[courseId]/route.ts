import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";
import getSession from "@/lib/getSession";

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

        const values = await req.json();
        const { courseId } = await params;

        const course = await prisma.course.update({
            where: {
                userId: session.user.id,
                id: courseId,
            },
            data: {
                ...values,
            }
        })
        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}