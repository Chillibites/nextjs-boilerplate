
import { redirect } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import getSession from "@/lib/getSession"
import { prisma } from "@/lib/prisma";

interface TeacherCoursesPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function TeacherCoursesPage({
  params,
}: TeacherCoursesPageProps) {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const { userId } = await params

  const courses = await prisma.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    
    </div>
  );
}
