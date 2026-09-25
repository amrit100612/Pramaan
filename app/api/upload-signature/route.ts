import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateUploadSignature } from "@/lib/cloudinary";

const RequestSchema = z.object({
  projectId: z.string().min(1, "projectId is required"),
  folder: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parseResult = RequestSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { projectId, folder, tags } = parseResult.data;

    const signatureData = generateUploadSignature({
      folder: folder || `pramaan/${projectId}`,
      tags: tags || [projectId],
      context: { projectId },
    });

    return NextResponse.json({
      ok: true,
      data: signatureData,
    });
  } catch (error: any) {
    console.error("Upload signature error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
