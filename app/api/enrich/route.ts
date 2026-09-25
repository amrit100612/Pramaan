import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enrichAndPersistAsset } from "@/lib/enrichment";

const EnrichSchema = z.object({
  assetId: z.string().optional(),
  publicId: z.string().min(1, "publicId is required"),
  projectId: z.string().optional().default("proj-1"),
  secureUrl: z.string().url("Valid secureUrl is required"),
  caption: z.string().optional(),
  tags: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capturedAt: z.string().optional(),
  phash: z.string().optional(),
  bytes: z.number().optional(),
  format: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = EnrichSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const data = result.data;

    // Run core enrichment and database persistence
    const enriched = await enrichAndPersistAsset({
      publicId: data.publicId,
      secureUrl: data.secureUrl,
      projectId: data.projectId,
      caption: data.caption,
      tags: data.tags,
      latitude: data.latitude,
      longitude: data.longitude,
      capturedAt: data.capturedAt,
      phash: data.phash,
      bytes: data.bytes,
      format: data.format,
    });

    return NextResponse.json({
      ok: true,
      data: enriched,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Enrichment failed";
    console.error("Enrichment error:", message);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
