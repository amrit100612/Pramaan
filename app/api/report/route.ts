import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ReportSchema = z.object({
  projectId: z.string().min(1),
  projectTitle: z.string().min(1),
  sdgTags: z.array(z.string()).optional(),
  claims: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      status: z.enum(["verified", "review", "contradicted", "processing"]),
      survivalScore: z.number(),
      stateHash: z.string(),
      citedAssets: z.array(z.string()),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = ReportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }

    const { projectId, projectTitle, sdgTags, claims } = result.data;
    const reportId = `rep_${Date.now()}`;
    const generatedAt = new Date().toISOString();

    // Summary stats for report receipt
    const verifiedCount = claims.filter((c) => c.status === "verified").length;
    const reviewCount = claims.filter((c) => c.status === "review").length;
    const contradictedCount = claims.filter((c) => c.status === "contradicted").length;

    const receiptUrl = `/verify/report-${reportId}`;

    return NextResponse.json({
      ok: true,
      data: {
        reportId,
        projectTitle,
        projectId,
        sdgTags: sdgTags || ["SDG 13: Climate Action", "SDG 15: Life on Land"],
        generatedAt,
        summary: {
          totalClaims: claims.length,
          verifiedCount,
          reviewCount,
          contradictedCount,
        },
        receiptUrl,
      },
    });
  } catch (error: any) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Failed to generate report" },
      { status: 500 }
    );
  }
}
