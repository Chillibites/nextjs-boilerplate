import { redirect } from "next/navigation"
import getSession from "@/lib/getSession"
import { prisma } from "@/lib/prisma"

interface GetProgressProps {
  userId: string
  courseId: string
}

export default async function getProgress({ userId, courseId }: GetProgressProps) {
  try {
    const session = await getSession()
    if (!session) {
      redirect("/")
    }

    const publishedChaptersInCourse = await prisma.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select:{
        id: true,
      }
    })
    
    const publishedChaptersIds = publishedChaptersInCourse.map((chapter) => chapter.id)

    const validCompletedChapters = await prisma.userProgress.count({
      where: {
        userId: userId,
        chapterId: { in: publishedChaptersIds },
        isCompleted: true,
      },
    })

    const progressPercentage = (validCompletedChapters / publishedChaptersIds.length) * 100

    return progressPercentage

  } catch (error) {
    console.log("[GET_PROGRESS]", error)
    return null
  }
}