import { redirect } from "next/navigation"
import  getSession  from "@/lib/getSession"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Eye, Video } from "lucide-react"
import { LayoutDashboard } from "lucide-react"
import { IconBadge } from "@/components/icon-badge"
import { ChapterTitleForm } from "./_components/chapter-title-form"
import { ChapterDescriptionForm } from "./_components/chapter-description-form"
import { ChapterAccessForm } from "./_components/chapter-access-form"
import ChapterVideoForm from "./_components/chapter-video-form"
import { PrismaClient } from "@prisma/client"
import Banner from "@/components/banner"
import { ChapterAction } from "@/app/main/teacher/courses/[courseId]/_components/chapter-action"
const prismaClient = new PrismaClient()

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
                where: { id: chapterId },
            },
        },
    });

    if (!course) {
        return redirect("/");
    }
    
    const chapter = course.chapters.find((chapter) => chapter.id === chapterId);
    if (!chapter) {
        return redirect("/");
    }
    
    const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    // Query the chapter along with its related muxData (if available)
    const prismaChapter = await prismaClient.chapter.findUnique({
        where: { id: chapterId },
        include: { muxData: true },
    });

    // If there is associated muxData, we extract the playbackId and assetId.
    const initialVideoData = prismaChapter?.muxData
        ? {
            playbackId: prismaChapter.muxData.playbackId,
            assetId: prismaChapter.muxData.assetId,
        }
        : null;

    const completionPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

    const isCompleted = completionPercentage === 100;


    return (
        <div className="max-w-5xl mx-auto p-6">
        {!chapter.isPublished && (
            <aside
            role="alert"
            aria-label="Unpublished Chapter Warning"
            className="mb-4"
            >
            <Banner
                label="This chapter is not published. It will not be visible to the students."
                variant="warning"
            />
            </aside>
        )}
        <main className="bg-background text-foreground min-h-screen rounded-lg shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="mb-8">
                    <nav aria-label="Back Navigation" className="mb-4">
                        <Link href={`/main/teacher/courses/${courseId}`}>
                            <Button 
                                variant="ghost" 
                                className="flex items-center text-sm hover:underline focus:outline-none focus:ring"
                                aria-label="Back to chapters"
                            >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back to chapters
                            </Button>
                        </Link>
                    </nav>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="flex items-center gap-x-2">
                            <progress
                                value={completedFields}
                                max={totalFields}
                                className="h-2 w-32 rounded overflow-hidden"
                                aria-valuenow={completedFields}
                                aria-valuemin={0}
                                aria-valuemax={totalFields}
                                aria-label="Completion progress"
                            />
                            <span className="text-sm text-muted-foreground">
                                Complete all fields {completedFields}/{totalFields}
                            </span>
                        </div>
                        <p className="sr-only" aria-live="polite">
                            Completion progress: {completedFields} out of {totalFields} fields complete.
                        </p>
                    </div>
                    <ChapterAction
                        chapterId={chapterId}
                        courseId={courseId}
                        isPublished={chapter.isPublished}
                        disabled={!isCompleted}
                    />
                    <h1 className="text-3xl font-bold mt-6">Chapter Details</h1>
                </header>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <section aria-labelledby="forms-section" className="space-y-6">
                        <article className="p-6 bg-card rounded-lg shadow hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={LayoutDashboard} aria-label="Chapter Details Icon" />
                                <h2 id="chapter-details-section" className="text-xl font-semibold">
                                    Chapter Details
                                </h2>
                            </div>
                            <ChapterTitleForm 
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </article>
                        
                        <article className="p-6 bg-card rounded-lg shadow hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={LayoutDashboard} aria-label="Chapter Description Icon" />
                                <h2 id="chapter-description-section" className="text-xl font-semibold">
                                    Chapter Description
                                </h2>
                            </div>
                            <ChapterDescriptionForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </article>
                        
                        <article className="p-6 bg-card rounded-lg shadow hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={Eye} aria-label="Access Settings Icon" />
                                <h2 id="chapter-access-section" className="text-xl font-semibold">
                                    Access Settings
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={courseId}
                                chapterId={chapterId}
                            />
                        </article>
                    </section>

                    <section aria-labelledby="add-video-section">
                        <article className="p-6 bg-card rounded-lg shadow hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-x-2 mb-4">
                                <IconBadge icon={Video} aria-label="Add Video Icon" />
                                <h2 id="add-video-section" className="text-xl font-semibold">
                                    Add a Video
                                </h2>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Upload or select a video to add to this chapter.
                            </p>
                            <ChapterVideoForm
                                courseId={courseId}
                                chapterId={chapterId}
                                initialVideoData={initialVideoData || undefined}
                            />
                        </article>
                    </section>
                </div>
            </div>
        </main>
        </div>
    );
}