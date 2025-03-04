import { Category, Course } from "@prisma/client";
import { CourseCard } from "./course-card";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  if (items.length === 0) {
    return (
      <div className="mt-10 text-center text-sm text-muted-foreground">
        No courses found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div key={item.id} className="flex justify-center">
          <div className="max-w-xs w-full">
            <CourseCard
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chaptersLength={item.chapters.length}
              price={item.price!}
              progress={item.progress}
              category={item.category?.name ?? null}
              priority={index === 0}
            />
          </div>
        </div>
      ))}
    </div>
  );
};