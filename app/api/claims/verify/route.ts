import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildEvidenceState, evaluateAssetTrust } from "@/lib/trust";
import { evaluateClaimWithJev } from "@/lib/jev";

const VerifyClaimSchema = z.object({
  claimId: z.string().min(1),
  claimText: z.string().min(3),
  citedAssets: z.array(
    z.object({
      id: z.string(),
      caption: z.string().optional(),
      capturedAt: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      phash: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })
  ),
  geofenceCenter: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = VerifyClaimSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { claimId, claimText, citedAssets, geofenceCenter } = result.data;

    // 1. Evaluate trust factors for each cited asset
    const evaluatedAssets = citedAssets.map((asset) => {
      const trustResult = evaluateAssetTrust({
        id: asset.id,
        capturedAt: asset.capturedAt,
        location:
          asset.latitude && asset.longitude
            ? { latitude: asset.latitude, longitude: asset.longitude }
            : null,
        phash: asset.phash,
      });

      return {
        id: asset.id,
        caption: asset.caption,
        capturedAt: asset.capturedAt,
        location:
          asset.latitude && asset.longitude
            ? { latitude: asset.latitude, longitude: asset.longitude }
            : null,
        tags: asset.tags,
        trustResult,
      };
    });

    // 2. Build compact Evidence State (Rules.md: compact state, few hundred tokens max)
    const evidenceState = buildEvidenceState({
      claimId,
      claimText,
      assets: evaluatedAssets,
      projectGeofenceCenter: geofenceCenter,
    });

    // 3. Run Jev Jury evaluation + deterministic verdict math
    const verdict = await evaluateClaimWithJev(evidenceState);

    // 4. Log to Decision Ledger (Rules.md §Error handling: Log every verdict's inputs/outputs)
    const ledgerEntries = verdict.answers.map((ans) => ({
      stateHash: verdict.stateHash,
      question: ans.question,
      probability: ans.probability,
      createdAt: new Date().toISOString(),
    }));

    return NextResponse.json({
      ok: true,
      data: {
        verdict,
        evidenceState,
        ledgerEntries,
      },
    });
  } catch (error: any) {
    console.error("Claim verification error:", error);
    // Fail closed rule: on unexpected error, status should fail closed
    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Claim verification failed",
        fallbackStatus: "review",
      },
      { status: 500 }
    );
  }
}
