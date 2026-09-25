import { evaluateAssetTrust, TrustCheckResult } from "./trust";
import { generateTextEmbedding } from "./embeddings";
import { getAdminDb } from "./db";
import { localStore } from "./local-store";
import { linkRelatedAssets } from "./cloudinary";

export interface AssetIngestData {
  publicId: string;
  secureUrl: string;
  projectId?: string;
  caption?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  capturedAt?: string;
  phash?: string;
  bytes?: number;
  format?: string;
  imageMetadata?: Record<string, unknown>;
}

export interface EnrichedAssetResult {
  id: string;
  publicId: string;
  projectId: string;
  secureUrl: string;
  caption: string;
  tags: string[];
  trustResult: TrustCheckResult;
  embedding: number[];
  dbPersisted: boolean;
}

/**
 * Core enrichment and persistence engine:
 * 1. Evaluates deterministic trust checks (geofence, timestamp, pHash)
 * 2. Generates semantic embeddings
 * 3. Persists to Supabase Postgres (assets + trust_records tables) with local ledger fallback
 * 4. Links related assets in Cloudinary for bidirectional traceability
 */
export async function enrichAndPersistAsset(
  data: AssetIngestData
): Promise<EnrichedAssetResult> {
  const projectId = data.projectId || "proj-1";
  const tags = data.tags || [];
  const caption =
    data.caption ||
    (tags.length > 0
      ? `Field capture depicting ${tags.join(", ")} at project site.`
      : `Verified impact field photo at site.`);

  // 1. Run deterministic trust evaluation
  const trustResult = evaluateAssetTrust({
    id: data.publicId,
    capturedAt: data.capturedAt,
    location:
      data.latitude && data.longitude
        ? { latitude: data.latitude, longitude: data.longitude }
        : null,
    phash: data.phash,
  });

  // 2. Generate 1536-dimensional vector embedding for semantic search
  const semanticText = [caption, ...tags].join(" ");
  const embedding = await generateTextEmbedding(semanticText || data.publicId);

  // 3. Persist to Postgres database via Supabase
  const db = getAdminDb();
  let dbPersisted = false;
  let assetId = `asset_${Date.now()}`;

  const assetRow = {
    project_id: projectId,
    cloudinary_public_id: data.publicId,
    secure_url: data.secureUrl,
    asset_type: "image",
    caption,
    ai_tags: tags,
    embedding,
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    captured_at: data.capturedAt || new Date().toISOString(),
    phash: data.phash || null,
    quality_score: trustResult.baseTrust,
    metadata: {
      bytes: data.bytes,
      format: data.format,
      image_metadata: data.imageMetadata,
      trust_flags: trustResult.flags,
    },
  };

  try {
    const { data: inserted, error: insertError } = await db
      .from("assets")
      .upsert(assetRow, { onConflict: "cloudinary_public_id" })
      .select()
      .single();

    if (!insertError && inserted) {
      dbPersisted = true;
      assetId = inserted.id;

      // Insert trust record
      await db.from("trust_records").upsert(
        {
          asset_id: assetId,
          geofence_ok: trustResult.geofenceOk,
          timestamp_ok: trustResult.timestampOk,
          duplicate_flag: trustResult.duplicateFlag,
          base_trust: trustResult.baseTrust,
          details: { flags: trustResult.flags },
        },
        { onConflict: "asset_id" }
      );
    } else {
      console.warn("Supabase assets upsert warning (falling back to local store):", insertError?.message);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("Supabase query failed, persisting to local store:", message);
  }

  // Always persist to local ledger store for instant retrieval & offline resilience
  localStore.upsert("assets", { ...assetRow, id: assetId }, "cloudinary_public_id");
  localStore.upsert(
    "trust_records",
    {
      asset_id: assetId,
      geofence_ok: trustResult.geofenceOk,
      timestamp_ok: trustResult.timestampOk,
      duplicate_flag: trustResult.duplicateFlag,
      base_trust: trustResult.baseTrust,
      details: { flags: trustResult.flags },
    },
    "asset_id"
  );

  // 4. Link related assets in Cloudinary for bidirectional traceability (Architecture.md §1)
  const existingAssets = localStore.get<any>("assets");
  const relatedPublicIds = existingAssets
    .filter((a) => a.cloudinary_public_id !== data.publicId && a.project_id === projectId)
    .slice(0, 5)
    .map((a) => a.cloudinary_public_id);

  if (relatedPublicIds.length > 0) {
    try {
      await linkRelatedAssets(data.publicId, relatedPublicIds);
    } catch (e: unknown) {
      // Non-fatal trace failure
      console.warn("Could not link related assets in Cloudinary:", e);
    }
  }

  return {
    id: assetId,
    publicId: data.publicId,
    projectId,
    secureUrl: data.secureUrl,
    caption,
    tags,
    trustResult,
    embedding,
    dbPersisted,
  };
}
