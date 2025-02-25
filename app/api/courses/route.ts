import { auth } from "@/auth";
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
) {
    try {
        const session = await auth();
        const { title } = await req.json();

        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        const course = await prisma.course.create({
            data: {
                userId: session.user.id,
                title,
            }
        })
        return NextResponse.json(course)
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

