import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateTextEmbedding } from "@/lib/embeddings";
import { getAdminDb } from "@/lib/db";
import { localStore } from "@/lib/local-store";

const SearchQuerySchema = z.object({
  query: z.string().min(1, "Search query is required"),
  projectId: z.string().optional().default("proj-1"),
  limit: z.number().optional().default(10),
});

/**
 * Computes cosine similarity between two unit vectors (dot product)
 */
function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const len = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? Math.max(0, Math.min(1, (dotProduct / denom + 1) / 2)) : 0;
}

export interface AssetCandidate {
  id?: string;
  project_id?: string;
  cloudinary_public_id: string;
  caption?: string;
  ai_tags?: string[];
  secure_url?: string;
  embedding?: number[];
  quality_score?: number;
  phash?: string;
  latitude?: number;
  longitude?: number;
  captured_at?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = SearchQuerySchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { query, projectId, limit } = parseResult.data;

    // 1. Generate real 1536-dimensional embedding for query text
    const queryEmbedding = await generateTextEmbedding(query);

    // 2. Fetch assets from database
    const db = getAdminDb();
    let candidates: AssetCandidate[] = [];

    try {
      const { data: remoteData, error } = await db
        .from("assets")
        .select("*")
        .eq("project_id", projectId);

      if (!error && remoteData && remoteData.length > 0) {
        candidates = remoteData;
      }
    } catch {
      // Fallback to local store
    }

    // Combine with local store assets
    const localAssets = localStore.get<AssetCandidate>("assets").filter((a) => a.project_id === projectId);
    for (const la of localAssets) {
      if (!candidates.some((c) => c.cloudinary_public_id === la.cloudinary_public_id)) {
        candidates.push(la);
      }
    }

    // 3. Compute cosine similarity against all asset embeddings
    const rankedResults = candidates
      .map((asset) => {
        let similarity = 0.5;
        if (asset.embedding && Array.isArray(asset.embedding)) {
          similarity = computeCosineSimilarity(queryEmbedding, asset.embedding);
        } else {
          // Keyword match fallback if asset embedding is missing
          const text = [asset.caption, ...(asset.ai_tags || [])].join(" ").toLowerCase();
          const qWords = query.toLowerCase().split(/\s+/);
          const matches = qWords.filter((w) => text.includes(w)).length;
          similarity = matches > 0 ? 0.6 + (matches / qWords.length) * 0.35 : 0.4;
        }

        const trustScore = asset.quality_score ?? 0.9;
        const status =
          trustScore >= 0.75
            ? "verified"
            : trustScore <= 0.4
            ? "contradicted"
            : "review";

        return {
          id: asset.id,
          publicId: asset.cloudinary_public_id,
          title: asset.caption || asset.cloudinary_public_id,
          caption: asset.caption || "Verified field photograph",
          project: "Sundarbans Sector 4",
          capturedAt: asset.captured_at?.slice(0, 10) || "2026-08-12",
          similarity: Math.round(similarity * 100) / 100,
          trustScore,
          status,
          thumbnailUrl: asset.secure_url,
          tags: asset.ai_tags || [],
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return NextResponse.json({
      ok: true,
      data: {
        query,
        count: rankedResults.length,
        results: rankedResults,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Search error";
    console.error("Semantic search error:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
