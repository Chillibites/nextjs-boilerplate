import { prisma } from "@/lib/prisma";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { LayoutDashboard, ListChecks, CircleDollarSign } from "lucide-react";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
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

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between bg-white dark:bg-card p-4 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl md:text-4xl font-bold">Course Setup</h1>
          <span className="text-sm md:text-base text-muted-foreground">
            Complete all required fields {completionText}
          </span>
        </div>
        <div className="bg-secondary/80 rounded-full px-3 py-1">
          {completedFields === totalFields ? (
            <span className="text-sm font-medium text-primary">Complete</span>
          ) : (
            <span className="text-sm font-medium text-amber-500">In Progress</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center gap-x-2 mb-4 pb-2 border-b">
            <IconBadge icon={LayoutDashboard} variant="default" />
            <h2 className="text-xl font-semibold">Customize your course</h2>
          </div>
          
          <div className="space-y-6 bg-white dark:bg-card p-4 rounded-lg shadow-sm">
            <TitleForm initialData={course} courseId={courseId} />
            <DescriptionForm initialData={course} courseId={courseId} />
            <ImageForm initialData={course} courseId={courseId} />
            <CategoryForm 
              initialData={course} 
              courseId={courseId} 
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))} 
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-x-2 mb-4 pb-2 border-b">
              <IconBadge icon={ListChecks} variant="default" />
              <h2 className="text-xl font-semibold">Course chapters</h2>
            </div>
            <div className="flex flex-col gap-y-4 min-h-[150px] items-center justify-center text-muted-foreground">
              TODO: Show list of chapters
            </div>
          </div>
          
          <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-x-2 mb-4 pb-2 border-b">
              <IconBadge icon={CircleDollarSign} variant="default" />
              <h2 className="text-xl font-semibold">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={courseId} />
          </div>
        </div>
      </div>
    </div>
  );
}