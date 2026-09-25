import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary SDK using server-side environment variables
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

export interface SignedUploadParams {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder?: string;
  tags?: string;
  context?: string;
  eager?: string;
}

/**
 * Generates signed upload params for direct client upload to Cloudinary.
 * Complies with Rules.md (uses Cloudinary Node SDK utils, no hand-rolled signing).
 */
export function generateUploadSignature(options: {
  folder?: string;
  tags?: string[];
  context?: Record<string, string>;
  eager?: string;
}): SignedUploadParams {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const apiKey = process.env.CLOUDINARY_API_KEY || "";
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";

  const paramsToSign: Record<string, unknown> = {
    timestamp,
  };

  if (options.folder) paramsToSign.folder = options.folder;
  if (options.tags && options.tags.length > 0) paramsToSign.tags = options.tags.join(",");
  if (options.eager) paramsToSign.eager = options.eager;
  if (options.context) {
    paramsToSign.context = Object.entries(options.context)
      .map(([k, v]) => `${k}=${v}`)
      .join("|");
  }

  // Use the Cloudinary SDK utility for signing
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder: options.folder,
    tags: options.tags?.join(","),
    context: paramsToSign.context as string | undefined,
    eager: options.eager,
  };
}

/**
 * Verify Cloudinary webhook notification signature.
 * Cloudinary signature format: SHA1/SHA256(raw_body + timestamp + api_secret)
 */
export function verifyWebhookSignature(
  rawBody: string,
  timestampHeader: string,
  signatureHeader: string
): boolean {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret || !timestampHeader || !signatureHeader) return false;

  // Check freshness (within 7200 seconds / 2 hours)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const requestTimestamp = parseInt(timestampHeader, 10);
  if (isNaN(requestTimestamp) || Math.abs(currentTimestamp - requestTimestamp) > 7200) {
    return false;
  }

  return cloudinary.utils.verifyNotificationSignature(
    rawBody,
    requestTimestamp,
    signatureHeader,
    7200
  );
}

/**
 * Links a derived/transformed asset back to its original asset in Cloudinary
 * (bidirectional relationship, up to 10 items)
 */
export async function linkRelatedAssets(
  publicId: string,
  relatedPublicIds: string[]
): Promise<void> {
  if (relatedPublicIds.length === 0) return;
  try {
    // Cloudinary Admin API: add_related_assets
    await cloudinary.api.add_related_assets(publicId, relatedPublicIds);
  } catch (err) {
    console.error("Cloudinary add_related_assets error:", err);
    // Non-fatal trace failure
  }
}
