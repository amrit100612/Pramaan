import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyWebhookSignature } from "@/lib/cloudinary";
import { enrichAndPersistAsset } from "@/lib/enrichment";

// Rules.md §Use: Validate every external input with zod before touching it
const CloudinaryWebhookSchema = z.object({
  notification_type: z.string().optional(),
  public_id: z.string().min(1, "public_id is required"),
  secure_url: z.string().url().optional(),
  url: z.string().url().optional(),
  bytes: z.number().optional(),
  format: z.string().optional(),
  resource_type: z.string().optional().default("image"),
  created_at: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()]).optional(),
  context: z
    .object({
      custom: z
        .object({
          projectId: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  image_metadata: z.record(z.string(), z.unknown()).optional(),
  phash: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Headers sent by Cloudinary
    const signature = req.headers.get("x-cld-signature");
    const timestamp = req.headers.get("x-cld-timestamp");

    // Per System-Design.md §3: Must verify signature before parsing body for anything else!
    if (!signature || !timestamp) {
      return NextResponse.json(
        { ok: false, error: "Missing Cloudinary signature or timestamp headers" },
        { status: 401 }
      );
    }

    const rawBody = await req.text();

    const isValid = verifyWebhookSignature(rawBody, timestamp, signature);
    if (!isValid) {
      console.warn("Invalid Cloudinary webhook signature rejected");
      return NextResponse.json(
        { ok: false, error: "Invalid webhook notification signature" },
        { status: 401 }
      );
    }

    // 2. Validate with Zod before using (Rules.md)
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Malformed JSON body" },
        { status: 400 }
      );
    }

    const parseResult = CloudinaryWebhookSchema.safeParse(parsedJson);
    if (!parseResult.success) {
      return NextResponse.json(
        { ok: false, error: parseResult.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const payload = parseResult.data;
    const publicId = payload.public_id;
    const secureUrl = payload.secure_url || payload.url || "";
    const projectId = payload.context?.custom?.projectId || "proj-1";

    // Extract tags
    let tagsList: string[] = [];
    if (Array.isArray(payload.tags)) {
      tagsList = payload.tags;
    } else if (typeof payload.tags === "string") {
      tagsList = payload.tags.split(",").map((t) => t.trim());
    }

    // Extract GPS coordinates if present in EXIF
    let latitude: number | undefined;
    let longitude: number | undefined;
    if (payload.image_metadata) {
      const lat = payload.image_metadata.GPSLatitude || payload.image_metadata.latitude;
      const lon = payload.image_metadata.GPSLongitude || payload.image_metadata.longitude;
      if (typeof lat === "number") latitude = lat;
      if (typeof lon === "number") longitude = lon;
    }

    // 3. ACTUALLY trigger enrichment and write row to Postgres assets table (Priority 1)
    const enrichedAsset = await enrichAndPersistAsset({
      publicId,
      secureUrl,
      projectId,
      tags: tagsList,
      latitude,
      longitude,
      capturedAt: payload.created_at,
      phash: payload.phash,
      bytes: payload.bytes,
      format: payload.format,
      imageMetadata: payload.image_metadata,
    });

    return NextResponse.json({
      ok: true,
      message: "Webhook processed, enriched, and recorded to assets table",
      data: enrichedAsset,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Webhook processing error";
    console.error("Cloudinary webhook processing error:", message);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 400 }
    );
  }
}
