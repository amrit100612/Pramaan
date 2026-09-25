"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/pramaan/NavBar";
import { Stamp } from "@/components/pramaan/Stamp";

type FormatType = "instagram_square" | "story_9_16" | "linkedin_banner";

export default function CampaignStudioPage() {
  const params = useParams();
  const claimId = (params?.claimId as string) || "claim-1";

  const [format, setFormat] = useState<FormatType>("instagram_square");
  const [showQr, setShowQr] = useState<boolean>(true);
  const [includeBilingual, setIncludeBilingual] = useState<boolean>(true);

  const claimData = {
    title: "Sundarbans Mangrove Buffer Restored",
    stat: "4,500 Rhizophora Saplings Verified",
    claimText: "Tidal buffer restoration confirmed by field photos & ExG index (+39.2% canopy increase).",
    bilingualCaption: "সুন্দরবন উপকূলীয় খাঁড়িতে ৪৫০০ ম্যানগ্রোভ চারা রোপণ সম্পন্ন। Pramaan দ্বারা যাচাইকৃত প্রমাণ।",
    assetUrl: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1200&q=80",
    verifyUrl: "/verify/asset_demo_01",
    stateHash: "e4d9f1a8c207b36e",
  };

  const aspectMap = {
    instagram_square: "aspect-square max-w-md",
    story_9_16: "aspect-[9/16] max-w-xs",
    linkedin_banner: "aspect-[16/9] max-w-xl",
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <NavBar currentPath={`/campaign/${claimId}`} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8 border-b border-slate/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-plex-mono text-slate uppercase">
                CAMPAIGN STUDIO · CLAIM #{claimId.toUpperCase()}
              </span>
              <Stamp state="verified" size="sm" />
            </div>
            <h1 className="text-3xl font-fraunces font-bold text-ink">
              Verified Social Asset Generator
            </h1>
            <p className="text-xs font-plex-mono text-slate mt-1">
              Auto-generate publication-ready assets anchored to immutable evidence receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Asset exported to Cloudinary media library with verified QR overlay!")}
              className="px-5 py-2 bg-moss text-paper text-xs font-plex-mono font-medium hover:bg-moss/90 transition-colors cursor-pointer"
            >
              Export Render to Cloudinary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* RENDER CANVAS PREVIEW (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="text-xs font-plex-mono text-slate mb-3 w-full flex justify-between">
              <span>CANVAS PREVIEW ({format.toUpperCase()})</span>
              <span>STATE HASH: {claimData.stateHash}</span>
            </div>

            {/* Simulated Generated Card */}
            <div
              className={`relative w-full ${aspectMap[format]} bg-ink text-paper overflow-hidden shadow-lg border-4 border-paper-light flex flex-col justify-between p-6`}
            >
              {/* Background with Cloudinary generative styling */}
              <img
                src={claimData.assetUrl}
                alt="Source field photo"
                className="absolute inset-0 w-full h-full object-cover opacity-50 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

              {/* Top Bar with Stamp */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-plex-mono tracking-widest uppercase text-paper/80 block">
                    PRAMAAN VERIFIED IMPACT
                  </span>
                  <span className="text-xs font-plex-mono text-paper/60">
                    Sundarbans Sector 4 · 2026
                  </span>
                </div>
                <Stamp state="verified" size="sm" />
              </div>

              {/* Content overlay */}
              <div className="relative z-10 space-y-2 mt-auto">
                <div className="text-2xl font-fraunces font-bold text-paper leading-tight">
                  {claimData.stat}
                </div>
                <p className="text-xs font-plex-sans text-paper/90 leading-snug">
                  {claimData.claimText}
                </p>

                {includeBilingual && (
                  <p className="text-xs font-plex-sans text-ochre/90 pt-1 border-t border-paper/20">
                    {claimData.bilingualCaption}
                  </p>
                )}

                {/* QR code and receipt verification tag */}
                {showQr && (
                  <div className="pt-2 flex items-center justify-between text-[10px] font-plex-mono text-paper/80 border-t border-paper/20 mt-2">
                    <div className="flex items-center gap-2">
                      {/* Simulated QR Code box */}
                      <div className="w-10 h-10 bg-white p-1 flex items-center justify-center">
                        <div className="w-full h-full bg-black flex flex-wrap gap-0.5 p-0.5">
                          <div className="w-2 h-2 bg-white" />
                          <div className="w-1 h-2 bg-white" />
                          <div className="w-2 h-1 bg-white" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">SCAN TO INDEPENDENTLY AUDIT</div>
                        <div>Receipt: pramaan.org/verify/{claimData.stateHash.slice(0, 8)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CONTROLS (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 bg-[#FDFCFA] border border-slate/30 text-ink space-y-5">
              <span className="text-xs font-plex-mono text-slate uppercase tracking-wider block">
                FORMAT & PUBLISHING CONTROLS
              </span>

              {/* Format selection */}
              <div>
                <label className="text-xs font-plex-mono text-slate block mb-2">
                  Target Channel Aspect Ratio:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "instagram_square", label: "1:1 Square" },
                      { id: "story_9_16", label: "9:16 Story" },
                      { id: "linkedin_banner", label: "16:9 Banner" },
                    ] as const
                  ).map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={`p-2 border text-xs font-plex-mono text-center cursor-pointer ${
                        format === f.id
                          ? "bg-ink text-paper border-ink"
                          : "border-slate/30 text-slate hover:text-ink"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate/20">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-plex-sans">
                  <input
                    type="checkbox"
                    checked={showQr}
                    onChange={(e) => setShowQr(e.target.checked)}
                    className="accent-moss"
                  />
                  <span>Attach verifiable tamper-evident QR code overlay</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-plex-sans">
                  <input
                    type="checkbox"
                    checked={includeBilingual}
                    onChange={(e) => setIncludeBilingual(e.target.checked)}
                    className="accent-moss"
                  />
                  <span>Generate bilingual local caption (Bengali / English)</span>
                </label>
              </div>

              {/* Cloudinary Generative Transform parameters */}
              <div className="p-3 bg-paper-light border border-slate/20 text-xs font-plex-mono text-slate space-y-1">
                <div className="text-ink font-semibold">CLOUDINARY PIPELINE TRANSFORMS:</div>
                <div>e_gen_background_replace</div>
                <div>c_fill,g_auto,w_1080,h_1080</div>
                <div>l_qr_code,w_120,g_south_east</div>
              </div>

              <div className="pt-2">
                <Link
                  href="/verify/asset_demo_01"
                  className="block text-center py-2.5 bg-paper border border-slate/40 text-xs font-plex-mono text-ink hover:border-moss hover:text-moss transition-colors"
                >
                  Verify Target Digital Receipt →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
