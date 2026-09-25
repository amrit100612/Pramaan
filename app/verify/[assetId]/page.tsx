"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/pramaan/NavBar";
import { Stamp, StampState } from "@/components/pramaan/Stamp";

export default function PublicVerifyPage() {
  const params = useParams();
  const assetId = (params?.assetId as string) || "asset_demo_01";

  // Verifiable public receipt record
  const receipt = {
    assetId,
    publicId: "pramaan/sundarbans_mangrove_01",
    status: "verified" as StampState,
    survivalScore: 0.94,
    stateHash: "e4d9f1a8c207b36e9210",
    capturedAt: "2026-08-12 09:14:22 UTC",
    ingestedAt: "2026-08-12 09:15:01 UTC",
    verifiedAt: "2026-08-12 09:15:18 UTC",
    coordinates: "21.9497° N, 88.8998° E",
    geofenceStatus: "PASSED (Within 500m geofence radius)",
    phash: "a7f89c02e1b439f0",
    duplicateDetection: "PASSED (No prior hash collision)",
    imageUrl: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1200&q=80",
    claimedIntervention: "Tidal mudflat sapling trenches planted with Rhizophora mangle during low-tide cycle.",
    // Sequential transformation chain (Design.md: Numbering only where it's real — genuinely sequential steps)
    transformationChain: [
      {
        step: 1,
        title: "Signed Field Upload Ingestion",
        timestamp: "2026-08-12 09:14:22 UTC",
        details: "Direct authenticated upload via Cloudinary SDK. EXIF timestamp and GPS coordinates extracted.",
        hash: "b0198c4f9a",
      },
      {
        step: 2,
        title: "Perceptual Hashing & Duplicate Audit",
        timestamp: "2026-08-12 09:15:02 UTC",
        details: "pHash computed: a7f89c02e1b439f0. Compared against repository of 12,400 assets. Zero collisions.",
        hash: "c3d9a107e8",
      },
      {
        step: 3,
        title: "Cloudinary AI Vision Object Tagging",
        timestamp: "2026-08-12 09:15:08 UTC",
        details: "Detected classes: Rhizophora mangle (0.96), tidal trench (0.92), alluvial mudflat (0.98).",
        hash: "f4a81c002b",
      },
      {
        step: 4,
        title: "Jev Jury Probabilistic Evaluation",
        timestamp: "2026-08-12 09:15:18 UTC",
        details: "Atomic questions cross-examined against Evidence State. Overall survival score: 0.94.",
        hash: "e4d9f1a8c2",
      },
      {
        step: 5,
        title: "Decision Ledger Append",
        timestamp: "2026-08-12 09:15:19 UTC",
        details: "State hash and question probabilities committed to immutable Postgres ledger. Public QR issued.",
        hash: "88fa01e992",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <NavBar currentPath={`/verify/${assetId}`} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Receipt Header Banner */}
        <div className="border border-slate/40 bg-[#FDFCFA] p-6 mb-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate/30 pb-4 mb-4">
            <div>
              <span className="text-xs font-plex-mono text-slate uppercase tracking-wider block">
                PUBLIC EVIDENCE RECEIPT · NO AUTH REQUIRED
              </span>
              <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-ink mt-0.5">
                Asset Audit Dossier #{receipt.assetId}
              </h1>
            </div>
            <div className="shrink-0">
              <Stamp state={receipt.status} size="lg" animate={true} />
            </div>
          </div>

          <p className="text-xs font-plex-sans text-slate">
            This page is the tamper-evident digital receipt linked to printed report QR codes. Any donor or independent auditor can inspect the complete verification pedigree below.
          </p>
        </div>

        {/* Media & Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Photo */}
          <div className="md:col-span-7 space-y-2">
            <div className="aspect-[4/3] bg-paper-light border border-slate/40 overflow-hidden relative">
              <img
                src={receipt.imageUrl}
                alt="Verified field asset"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-ink/80 text-paper font-plex-mono text-[11px]">
                ORIGINAL DELIVERY: CLOUDINARY AUTHENTICATED
              </div>
            </div>
            <div className="text-[11px] font-plex-mono text-slate flex justify-between">
              <span>CLOUD ID: {receipt.publicId}</span>
              <span>VERIFIED: {receipt.verifiedAt}</span>
            </div>
          </div>

          {/* Core Trust Parameters */}
          <div className="md:col-span-5 space-y-3 font-plex-mono text-xs">
            <div className="p-4 bg-[#FDFCFA] border border-slate/30 space-y-3">
              <div className="font-bold text-ink border-b border-slate/20 pb-1 uppercase">
                Tamper-Evident Parameters
              </div>

              <div>
                <span className="text-slate block text-[11px]">GEOFENCE AUDIT:</span>
                <span className="font-semibold text-moss">{receipt.geofenceStatus}</span>
              </div>

              <div>
                <span className="text-slate block text-[11px]">GPS COORDINATES:</span>
                <span className="font-semibold text-ink">{receipt.coordinates}</span>
              </div>

              <div>
                <span className="text-slate block text-[11px]">PERCEPTUAL HASH (pHASH):</span>
                <span className="font-semibold text-ink">{receipt.phash}</span>
              </div>

              <div>
                <span className="text-slate block text-[11px]">DUPLICATE REUSE CHECK:</span>
                <span className="font-semibold text-moss">{receipt.duplicateDetection}</span>
              </div>

              <div>
                <span className="text-slate block text-[11px]">OVERALL SURVIVAL SCORE:</span>
                <span className="font-bold text-moss text-base">
                  {(receipt.survivalScore * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Text */}
        <div className="mb-10 p-4 bg-paper-light border-l-4 border-moss text-ink">
          <span className="text-[11px] font-plex-mono font-bold text-slate uppercase block mb-1">
            Attested Claim
          </span>
          <p className="text-base font-fraunces italic">
            &ldquo;{receipt.claimedIntervention}&rdquo;
          </p>
        </div>

        {/* NUMBERED TRANSFORMATION CHAIN (Design.md: Numbering only where it's real) */}
        <div className="border border-slate/30 bg-[#FDFCFA] p-6 space-y-6">
          <div className="border-b border-slate/20 pb-2">
            <span className="text-xs font-plex-mono text-slate uppercase tracking-wider block">
              SEQUENTIAL AUDIT TRAIL
            </span>
            <h2 className="text-xl font-fraunces font-bold text-ink">
              Asset Transformation Chain
            </h2>
          </div>

          <div className="space-y-6">
            {receipt.transformationChain.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                {/* Number mark */}
                <div className="w-8 h-8 rounded-full border-2 border-moss text-moss font-plex-mono font-bold flex items-center justify-center text-sm shrink-0 bg-paper-light">
                  {step.step}
                </div>

                {/* Details */}
                <div className="flex-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <h3 className="font-plex-sans font-semibold text-sm text-ink">
                      {step.title}
                    </h3>
                    <span className="font-plex-mono text-[11px] text-slate">
                      {step.timestamp}
                    </span>
                  </div>
                  <p className="font-plex-sans text-ink/80 mb-1 leading-relaxed">
                    {step.details}
                  </p>
                  <span className="font-plex-mono text-[10px] text-slate">
                    COMMIT HASH: {step.hash}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate/20 flex items-center justify-between text-xs font-plex-mono text-slate">
            <span>STATE SIGNATURE: {receipt.stateHash}</span>
            <Link href="/projects/proj-1" className="text-moss font-medium hover:underline">
              ← Return to Project Dossier
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
