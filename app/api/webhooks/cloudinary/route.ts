import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    // Headers sent by Cloudinary
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

    const payload = JSON.parse(rawBody);

    // Call enrichment internally or queue it
    // For demo/hackathon: payload contains public_id, secure_url, format, context, etc.
    const publicId = payload.public_id;
    const secureUrl = payload.secure_url;
    const context = payload.context?.custom;
    const projectId = context?.projectId || "default-project";

    return NextResponse.json({
      ok: true,
      message: "Notification verified and received",
      data: {
        publicId,
        secureUrl,
        projectId,
      },
    });
  } catch (error: any) {
    console.error("Cloudinary webhook processing error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Webhook processing error" },
      { status: 400 }
    );
  }
}
