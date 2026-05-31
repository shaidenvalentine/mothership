import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Client-upload endpoint for build-tracker photos (Vercel Blob). The browser
 * asks here for a short-lived upload token; we only hand one out to an
 * authenticated admin. If Blob isn't configured the admin can still paste photo
 * URLs manually on the build-update form.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
        maximumSizeInBytes: 15 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      // Required by the API; nothing to persist here (the URL is saved with the
      // build update when the admin submits the form).
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
