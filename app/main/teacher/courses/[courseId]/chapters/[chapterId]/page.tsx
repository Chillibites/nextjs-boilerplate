import { redirect } from "next/navigation"
import  getSession  from "@/lib/getSession"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { LayoutDashboard } from "lucide-react"
import { IconBadge } from "@/components/icon-badge"
import { ChapterTitleForm } from "./_components/chapter-title-form"
interface ChapterIdPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

export default async function ChapterIdPage({ params }: ChapterIdPageProps) {
    const session = await getSession();
    if (!session || !session.user) {
      redirect("/");
    }
    const { id: userId } = session.user;
    const { courseId, chapterId } = await params;
    

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
            userId: userId,
        },
        include: {
            chapters: {
                where: {
                    id: chapterId,
                },
            },
        },
    })

    if (!course) {
        return redirect("/")
    }
    
    const chapter = course.chapters.find((chapter) => chapter.id === chapterId)

    if (!chapter) {
        return redirect("/")
    }
    
    const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter((Boolean)).length;

    return (
        <div>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <Link href={`/main/teacher/courses/${courseId}`}>
                            <Button variant="ghost" className="flex items-center text-sm hover:underline">
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back to chapters
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-medium">Chapter Details</h1>
                        <span className="text-sm text-muted-foreground">
                            Complete all fields {completedFields}/{totalFields}
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
                <div className="p-6">
                    <div className="flex items-center gap-x-2">
                        <IconBadge 
                        icon={LayoutDashboard}
                        />
                        <h2 className="text-xl">
                            Chapter Details
                        </h2>
                    </div>
                    <ChapterTitleForm 
                        initialData={chapter}
                        courseId={courseId}
                        chapterId={chapterId}
                    />
                </div>
            </div>
        </div>
    )
}