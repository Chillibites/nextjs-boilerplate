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
        include: {
          chapters: {
            include: {
              muxData: true,
            },
          },
        },
        data: { isPublished: true },
      });

      if (!course) {
        return new NextResponse("Course not found", { status: 404 });
      }

      const hasPublishedChapters = course.chapters.some(
        (chapter) => chapter.isPublished
      );

      if (!hasPublishedChapters) {
        return new NextResponse("Course has no published chapters", { status: 404 });
      }

      if (!course.title || !course.description || !course.imageUrl || !course.categoryId) {
        return new NextResponse("Missing required fields", { status: 404 });
      }

      return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}