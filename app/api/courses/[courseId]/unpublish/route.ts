import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";
import { prisma } from "@/lib/prisma";


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
      const { courseId } = await params;
      const session = await getSession();
  
      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const course = await prisma.course.update({
        where: { id: courseId, userId: session.user.id },
        data: { isPublished: false },
      });

      if (!course) {
        return new NextResponse("Course not found", { status: 404 });
      }

      const unpublishedCourse = await prisma.course.update({
        where: { id: courseId, userId: session.user.id },
        data: { isPublished: false },
      });
      return NextResponse.json(unpublishedCourse);
    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}