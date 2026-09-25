import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/db";
import { localStore } from "@/lib/local-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId") || "proj-1";

    // 1. Try Supabase Postgres
    const db = getAdminDb();
    let assets: Array<Record<string, unknown>> = [];

    try {
      const { data, error } = await db
        .from("assets")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        assets = data;
      }
    } catch {
      // Fallback to local store
    }

    // 2. Combine with local store
    if (assets.length === 0) {
      assets = localStore.get<Record<string, unknown>>("assets").filter((a) => a.project_id === projectId);
    }

    return NextResponse.json({
      ok: true,
      data: assets,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch assets";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
