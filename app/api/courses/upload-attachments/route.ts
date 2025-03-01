import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from "next/server";
import getSession from "@/lib/getSession";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;


  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // IMPORTANT: In production, ensure you authenticate and authorize the client!
        return {
          // Only allow zip attachments.
          allowedContentTypes: ['application/zip'],
          tokenPayload: JSON.stringify({
            // Optionally include additional information
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Optional: perform post-upload operations (e.g. updating your database)
        console.log("Attachment upload completed", blob, tokenPayload);
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
