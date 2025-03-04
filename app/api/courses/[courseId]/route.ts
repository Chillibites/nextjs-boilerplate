import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma";
import getSession from "@/lib/getSession";
import type { Prisma } from "@prisma/client";

import Mux from "@mux/mux-node";

interface CoursePageProps {
    params: Promise<{
        courseId: string;
    }>;
}

const mux = new Mux();

export async function DELETE(
    req: Request,
    { params }: CoursePageProps
  ) {
    try {
      const { courseId } = await params;
      const session = await getSession();
  
      if (!session?.user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      // Delete the course and include chapters (with muxData) in the returned object.
      const deletedCourse = await prisma.course.delete({
        where: {
          id: courseId,
          userId: session.user.id,
        },
        include: {
          chapters: {
            include: {
              muxData: true,
            },
          },
        },
      });
  
      // Iterate through each chapter and delete associated Mux assets if they exist.
      for (const chapter of deletedCourse.chapters) {
        if (chapter.muxData) {
          await mux.video.assets.delete(chapter.muxData.assetId);
        }
      }
  
      return NextResponse.json(deletedCourse);
    } catch (error) {
      console.log("[COURSE_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }

export async function PATCH(
    req: Request,
    { params }: CoursePageProps
) {
    try {
        const session = await getSession();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { courseId } = await params;
        const body = await req.json();
        const { attachments, ...data } = body;

        // Use Prisma.CourseUpdateInput instead of using any
        const updateData: Prisma.CourseUpdateInput = {
            ...data,
        };

        if (attachments) {
            updateData.attachments = {
                deleteMany: {},
                create: attachments.map((att: { name: string; url: string }) => ({
                    name: att.name,
                    url: att.url,
                })),
            };
        }

        const updatedCourse = await prisma.course.update({
            where: {
                userId: session.user.id,
                id: courseId,
            },
            data: updateData,
            include: { attachments: true },
        });

        return NextResponse.json(updatedCourse);
    } catch (error) {
        console.log("[COURSES]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}