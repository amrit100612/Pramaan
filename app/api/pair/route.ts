import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateDistanceMeters } from "@/lib/trust";

const PairRequestSchema = z.object({
  projectId: z.string().min(1),
  radiusMeters: z.number().optional().default(150), // default 150m radius
  assets: z.array(
    z.object({
      id: z.string(),
      capturedAt: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      secureUrl: z.string(),
    })
  ).min(2, "At least two assets needed to form candidate pairs"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = PairRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { assets, radiusMeters } = result.data;
    const candidatePairs: Array<{
      beforeAsset: any;
      afterAsset: any;
      distanceMeters: number;
      timeDeltaDays: number;
    }> = [];

    // Sort assets chronologically
    const sorted = [...assets].sort(
      (a, b) => new Date(a.capturedAt).getTime() - new Date(b.capturedAt).getTime()
    );

    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i];
        const b = sorted[j];

        const dist = calculateDistanceMeters(
          { latitude: a.latitude, longitude: a.longitude },
          { latitude: b.latitude, longitude: b.longitude }
        );

        if (dist <= radiusMeters) {
          const timeA = new Date(a.capturedAt).getTime();
          const timeB = new Date(b.capturedAt).getTime();
          const timeDeltaDays = Math.round((timeB - timeA) / (1000 * 60 * 60 * 24));

          candidatePairs.push({
            beforeAsset: a,
            afterAsset: b,
            distanceMeters: Math.round(dist),
            timeDeltaDays,
          });
        }
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        pairsFound: candidatePairs.length,
        candidatePairs,
      },
    });
  } catch (error: any) {
    console.error("Pairing error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Pairing calculation failed" },
      { status: 500 }
    );
  }
}
