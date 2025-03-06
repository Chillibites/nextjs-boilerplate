import getSession from "@/lib/getSession"
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
interface ChapterIdPageProps {
  params: Promise<{
    courseId: string;
    chapterId: string;
  }>;
}

export default async function ChapterPage({ params }: ChapterIdPageProps) {
  const { courseId, chapterId } = await params;
  const session = await getSession()
  if (!session?.user?.id) {
    redirect("/")
  }

  const chapterData = await getChapter({
    userId: session.user.id,
    courseId,
    chapterId,
  });

  if (!chapterData) {
    return redirect("/");
  }

  const { chapter, course, muxData, attachments, nextChapterId, userProgress, purchase } = chapterData;

  if (!chapter || !course) {
    return redirect("/");
  }

  if (!muxData?.playbackId) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to continue."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapter.id}
            title={chapter.title}
            courseId={course.id}
            nextChapterId={nextChapterId?.id}
            playbackId={muxData.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="p-4">
              <h2 className="text-2xl font-bold">{chapter.title}</h2>
              {purchase ? (
                <div className="flex items-center gap-2 text-slate-500">
                  {/* TODO: Add courseProgressButton */}
                </div>
              ) : (
                <div>
                  {/* TODO: Add courseEnrollButton */}
                </div>
              )}
            </div>
            <Separator />
            <div>
              <Preview
                value={chapter.description!}
              />
            </div>
            {!!attachments.length && (
              <div className="p-4">
                <h2 className="text-2xl font-bold">Attachments</h2>
                <div className="flex flex-col gap-2">
                  {attachments.map((attachment) => (
                    <a
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    >
                      <File />
                      <p className="line-clamp-1">{attachment.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}