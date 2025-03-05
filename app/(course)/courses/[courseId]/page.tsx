import { prisma } from "@/lib/prisma";
import getSession from "@/lib/getSession"
import { redirect } from "next/navigation";

interface CourseIdPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseIdPage({ params }: CourseIdPageProps) {
  const { courseId } = await params;
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  
  if (!course) {
    return redirect("/");
  }

  
  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}
