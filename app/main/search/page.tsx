import getSession from "@/lib/getSession"
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Categories } from "./_components/categories";
import { SearchInput } from "./_components/search-input"
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";


interface SearchPageProps {
  searchParams: Promise<{
    title: string;
    categoryId: string;
  }>;
  params: Promise<{
    userId: string;
  }>;
}

export default async function SearchPage({ searchParams, params }: SearchPageProps) {
  const { userId } = await params;
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const resolvedSearchParams = await searchParams;

  const courses = await getCourses({ 
    userId,
    ...resolvedSearchParams,
  });
 
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">Search Courses</h1>
        <SearchInput />
        <Categories
          items={categories.map((category) => ({
            Category: category,
          }))}
        />
        <CoursesList items={courses} />
      </div>
    </main>
  );
}
