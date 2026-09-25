import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { evaluateAssetTrust } from "@/lib/trust";
import { generateTextEmbedding } from "@/lib/embeddings";

const EnrichSchema = z.object({
  assetId: z.string().optional(),
  publicId: z.string().min(1),
  projectId: z.string().min(1),
  secureUrl: z.string().url(),
  caption: z.string().optional(),
  tags: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capturedAt: z.string().optional(),
  phash: z.string().optional(),
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

    // 1. Run deterministic trust layer evaluation
    const trustResult = evaluateAssetTrust({
      id: data.publicId,
      capturedAt: data.capturedAt,
      location:
        data.latitude && data.longitude
          ? { latitude: data.latitude, longitude: data.longitude }
          : null,
      phash: data.phash,
    });

    // 2. Generate embedding vector for caption + tags
    const semanticText = [
      data.caption || "",
      ...(data.tags || []),
    ].join(" ");

    const embedding = await generateTextEmbedding(semanticText || data.publicId);

    return NextResponse.json({
      ok: true,
      data: {
        publicId: data.publicId,
        trustResult,
        embeddingLength: embedding.length,
        status: "enriched",
      },
    });
  } catch (error: any) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Enrichment failed" },
      { status: 500 }
    );
  }
}
