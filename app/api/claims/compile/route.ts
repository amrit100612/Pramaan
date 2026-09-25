import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CompileSchema = z.object({
  draftText: z.string().min(3, "draftText is required"),
  projectId: z.string().optional(),
});

export interface AtomicClaim {
  id: string;
  originalText: string;
  category: "activity" | "scale" | "environment" | "timeline";
  extractedClaim: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = CompileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { draftText } = result.data;

    // Split draft text into sentences or statements
    const sentences = draftText
      .split(/[.!?\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    const atomicClaims: AtomicClaim[] = sentences.map((sentence, idx) => {
      let category: AtomicClaim["category"] = "activity";
      const lower = sentence.toLowerCase();

      if (/\d+|hectares|trees|saplings|litres|km|sqm|tons/i.test(lower)) {
        category = "scale";
      } else if (/river|forest|mangrove|soil|desert|monsoon|site|village|wetland/i.test(lower)) {
        category = "environment";
      } else if (/before|after|august|september|october|year|month|during/i.test(lower)) {
        category = "timeline";
      }

      return {
        id: `claim_${Date.now()}_${idx + 1}`,
        originalText: sentence,
        category,
        extractedClaim: sentence,
      };
    });

    return NextResponse.json({
      ok: true,
      data: {
        totalClaims: atomicClaims.length,
        claims: atomicClaims,
      },
    });
  } catch (error: any) {
    console.error("Claim compilation error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to compile claims" },
      { status: 500 }
    );
  }
}
