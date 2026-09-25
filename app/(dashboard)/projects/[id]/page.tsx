"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/pramaan/NavBar";
import { Stamp, StampState } from "@/components/pramaan/Stamp";

interface AssetItem {
  id: string;
  publicId: string;
  title: string;
  location: string;
  capturedAt: string;
  trustScore: number;
  status: StampState;
  tags: string[];
  thumbnailUrl: string;
  phash: string;
  gps: string;
}

const DEMO_ASSETS: AssetItem[] = [
  {
    id: "asset_demo_01",
    publicId: "pramaan/sundarbans_mangrove_01",
    title: "Canal Bank Sapling Trench A-04",
    location: "Sundarbans Sector 4",
    capturedAt: "2026-08-12 09:14 UTC",
    trustScore: 0.94,
    status: "verified",
    tags: ["Rhizophora", "mangrove", "sapling trench", "mudflat"],
    thumbnailUrl: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=600&q=80",
    phash: "a7f89c02e1b439f0",
    gps: "21.9497° N, 88.8998° E",
  },
  {
    id: "asset_demo_02",
    publicId: "pramaan/sundarbans_mangrove_02",
    title: "Tidal Sluice Gate Buffer Bed",
    location: "Sundarbans Sector 4",
    capturedAt: "2026-08-14 14:32 UTC",
    trustScore: 0.91,
    status: "verified",
    tags: ["Avicennia", "tidal buffer", "volunteer team"],
    thumbnailUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    phash: "f1b82c04e9a34110",
    gps: "21.9482° N, 88.9012° E",
  },
  {
    id: "asset_demo_03",
    publicId: "pramaan/sundarbans_mangrove_03",
    title: "High Tide Line Seedling Density",
    location: "Sundarbans Sector 2",
    capturedAt: "2026-09-02 08:20 UTC",
    trustScore: 0.58,
    status: "review",
    tags: ["coastal ridge", "seedling bed"],
    thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    phash: "b2c938f1a0e457d1",
    gps: "21.9540° N, 88.8820° E (320m drift)",
  },
  {
    id: "asset_demo_04",
    publicId: "pramaan/sundarbans_mangrove_04",
    title: "Reused Stock Photo Flagged",
    location: "Unverified Location",
    capturedAt: "2024-03-10 11:00 UTC",
    trustScore: 0.18,
    status: "contradicted",
    tags: ["nursery stock", "reused photo"],
    thumbnailUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
    phash: "a7f89c02e1b439f0", // duplicate phash of asset 1
    gps: "No GPS in EXIF header",
  },
];

export default function ProjectGalleryPage() {
  const params = useParams();
  const projectId = (params?.id as string) || "proj-1";
  const [assets, setAssets] = useState<AssetItem[]>(DEMO_ASSETS);
  const [filter, setFilter] = useState<string>("all");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const filteredAssets = assets.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setUploadStatus("Obtaining signed parameters from /api/upload-signature...");

    setTimeout(() => {
      setUploadStatus("Simulating direct upload & perceptual analysis...");
      setTimeout(() => {
        const newAsset: AssetItem = {
          id: `asset_${Date.now()}`,
          publicId: `pramaan/upload_${Date.now().toString().slice(-4)}`,
          title: "Fresh Field Ingest #409",
          location: "Sundarbans Sector 4",
          capturedAt: new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
          trustScore: 0.93,
          status: "verified",
          tags: ["Rhizophora", "sapling", "field-inspect"],
          thumbnailUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80",
          phash: "c3d9a107e8b24491",
          gps: "21.9495° N, 88.8996° E",
        };
        setAssets([newAsset, ...assets]);
        setIsUploading(false);
        setUploadStatus("Asset ingested, tagged, and recorded to ledger!");
        setTimeout(() => setUploadStatus(null), 4000);
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <NavBar currentPath={`/projects/${projectId}`} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Project Header / Ledger Title */}
        <div className="border-b border-slate/30 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-plex-mono text-slate uppercase">
                PROJECT DOSSIER: {projectId.toUpperCase()}
              </span>
              <span className="text-xs font-plex-mono px-2 py-0.5 bg-paper-light border border-slate/30 text-ink">
                SDG 13 · SDG 15
              </span>
            </div>
            <h1 className="text-3xl font-fraunces font-bold text-ink">
              Sundarbans Coastal Mangrove Belt
            </h1>
            <p className="text-sm font-plex-sans text-slate mt-1 max-w-2xl">
              Tidal canal sapling counts, GPS geofenced perimeter (21.9497° N, 88.8998° E ± 500m), tamper-evident perceptual hashes.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulatedUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-ink text-paper text-xs font-plex-mono font-medium hover:bg-ink/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="text-sm">+</span>
              <span>{isUploading ? "Ingesting..." : "Smart Ingest Media"}</span>
            </button>
            <Link
              href="/copilot"
              className="px-4 py-2 border border-slate/40 text-ink text-xs font-plex-mono hover:bg-paper-light transition-colors"
            >
              Ask Copilot
            </Link>
          </div>
        </div>

        {uploadStatus && (
          <div className="mb-6 p-3 bg-paper-light border border-moss text-ink text-xs font-plex-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-moss animate-pulse" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between border-b border-slate/20 pb-3 mb-6 font-plex-mono text-xs text-slate">
          <div className="flex items-center gap-2">
            <span>Filter by state:</span>
            {(["all", "verified", "review", "contradicted"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-2 py-0.5 border text-xs uppercase cursor-pointer ${
                  filter === s
                    ? "bg-ink text-paper border-ink"
                    : "border-slate/30 text-slate hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div>Total Assets: {filteredAssets.length} recorded</div>
        </div>

        {/* CONTACT SHEET GALLERY (Design.md §Layout) */}
        <div className="border border-slate/30 bg-[#FDFCFA]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate/30">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="flex flex-col group">
                {/* Photo frame */}
                <div className="relative aspect-video bg-paper-light overflow-hidden border-b border-slate/30">
                  <img
                    src={asset.thumbnailUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Stamp state={asset.status} size="sm" />
                  </div>
                </div>

                {/* Ledger Line (Design.md: ledger line, not a caption chip) */}
                <div className="p-3.5 flex-1 flex flex-col justify-between text-xs font-plex-sans">
                  <div>
                    <h3 className="font-semibold text-ink line-clamp-1 mb-1">
                      {asset.title}
                    </h3>
                    <div className="font-plex-mono text-[11px] text-slate space-y-0.5">
                      <div>LOC: {asset.location}</div>
                      <div>GPS: {asset.gps}</div>
                      <div>DATE: {asset.capturedAt}</div>
                      <div>pHASH: {asset.phash.slice(0, 10)}…</div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate/20 flex items-center justify-between font-plex-mono text-[11px]">
                    <span className="text-slate">
                      Trust: <span className="font-bold text-ink">{(asset.trustScore * 100).toFixed(0)}%</span>
                    </span>
                    <Link
                      href={`/verify/${asset.id}`}
                      className="text-moss font-semibold hover:underline"
                    >
                      Receipt →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
