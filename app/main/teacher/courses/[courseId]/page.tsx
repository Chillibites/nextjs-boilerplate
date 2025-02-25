import { prisma } from "@/lib/prisma";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { TitleForm } from "./_components/title-form";
interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const { courseId } = await params;
  
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    redirect("/teacher/courses");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl md:text-4xl">Course</h1>
          <span className="text-sm md:text-base text-slate-600">
            complete all fields {completionText}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 text-slate-500 text-sm md:text-base">
          <IconBadge icon={LayoutDashboard} variant="default" />
          <h2 className="text-xl">Customize your course</h2>
        </div>
        <TitleForm initialData={course} courseId={courseId} />
      </div>
    </div>
  );
}