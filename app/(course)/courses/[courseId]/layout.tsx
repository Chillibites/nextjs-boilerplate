import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CourseNavbar } from "./_components/course-navbar";

const CourseLayout = async (props: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  // Do not destructure the courseId in the function signature!
  const { children, params } = props;

  // "Await" the parameters before using their properties to avoid the sync-dynamic-apis error.
  const resolvedParams = await Promise.resolve(params);
  const courseId = resolvedParams.courseId;

  // Verify user authentication if needed
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      chapters: {
        include: {
          userProgress: true,
        },
      },
    },
  });

  if (!course) {
    redirect("/");
  }

  // Fetch purchase info from the server
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: course.id,
      },
    },
  });
  const hasPurchased = Boolean(purchase);

  const progressCount = course.chapters.reduce(
    (acc, chapter) => acc + (chapter.userProgress?.length || 0),
    0
  );

  return (
    <main>
      <CourseNavbar course={course} progressCount={progressCount} hasPurchased={hasPurchased} />
      <div className="w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl mx-auto pt-10">
        {children}
      </div>
    </main>
  );
};

export default CourseLayout;
