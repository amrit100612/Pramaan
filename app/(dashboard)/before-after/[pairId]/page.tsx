"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/pramaan/NavBar";
import { Stamp } from "@/components/pramaan/Stamp";

interface PairPayload {
  pairId: string;
  title: string;
  beforeAsset: {
    id: string;
    publicId?: string;
    capturedAt: string;
    latitude: number;
    longitude: number;
    secureUrl: string;
    caption?: string;
  };
  afterAsset: {
    id: string;
    publicId?: string;
    capturedAt: string;
    latitude: number;
    longitude: number;
    secureUrl: string;
    caption?: string;
  };
  distanceMeters: number;
  timeDeltaDays: number;
  metrics: {
    beforeExg: number;
    afterExg: number;
    exgDelta: number;
    changeScore: number;
    confidence: number;
    summary: string;
  };
}

export default function BeforeAfterStudioPage() {
  const params = useParams();
  const pairId = (params?.pairId as string) || "pair-1";

  // Interactive slider position (0 to 100)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [loading, setLoading] = useState<boolean>(true);
  const [pair, setPair] = useState<PairPayload | null>(null);

  useEffect(() => {
    async function loadPair() {
      try {
        setLoading(true);
        const res = await fetch(`/api/pair?pairId=${encodeURIComponent(pairId)}`);
        const json = await res.json();
        if (json.ok && json.data) {
          setPair(json.data);
        }
      } catch (err) {
        console.error("Failed to load pair data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPair();
  }, [pairId]);

  // Derived or fallback data
  const beforeImg = pair?.beforeAsset.secureUrl || "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80";
  const afterImg = pair?.afterAsset.secureUrl || "https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=1000&q=80";
  const beforeDate = pair ? new Date(pair.beforeAsset.capturedAt).toLocaleDateString() : "12 May 2026";
  const afterDate = pair ? new Date(pair.afterAsset.capturedAt).toLocaleDateString() : "14 August 2026";
  const beforeExg = pair?.metrics.beforeExg ?? 0.22;
  const afterExg = pair?.metrics.afterExg ?? 0.61;
  const exgDelta = pair?.metrics.exgDelta ?? 0.39;
  const changeScore = pair?.metrics.changeScore ?? 0.78;
  const summary = pair?.metrics.summary || "Vegetation index delta analyzed with Sharp";
  const distance = pair ? `${pair.distanceMeters}m` : "12m";
  const days = pair ? `${pair.timeDeltaDays} days` : "94 days";

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <NavBar currentPath={`/before-after/${pairId}`} />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8 border-b border-slate/30 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-plex-mono text-slate uppercase">
                BEFORE/AFTER STUDIO · PAIR #{pairId.toUpperCase()}
              </span>
              <Stamp state={exgDelta >= 0.1 ? "verified" : "review"} size="sm" />
            </div>
            <h1 className="text-3xl font-fraunces font-bold text-ink">
              {pair?.title || "Sundarbans Sector 4 — Tidal Bank A-04 Regeneration"}
            </h1>
            <p className="text-xs font-plex-mono text-slate mt-1">
              {loading ? "Analyzing imagery with Sharp..." : `GPS Distance Offset: ${distance} · Time Interval: ${days}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/campaign/claim-1"
              className="px-4 py-2 bg-moss text-paper text-xs font-plex-mono font-medium hover:bg-moss/90 transition-colors"
            >
              Export to Campaign Studio →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SLIDER COMPARISON VIEW (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] bg-black overflow-hidden select-none border border-slate/40">
              {/* After Image (Background) */}
              <img
                src={afterImg}
                alt="After"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-3 right-3 z-10 px-2 py-0.5 bg-ink/80 text-paper font-plex-mono text-xs">
                AFTER: {afterDate}
              </span>

              {/* Before Image (Clipped Overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={beforeImg}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute bottom-3 left-3 z-10 px-2 py-0.5 bg-ink/80 text-paper font-plex-mono text-xs">
                  BEFORE: {beforeDate}
                </span>
              </div>

              {/* Slider Divider Bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-md"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-paper border-2 border-ink rounded-full flex items-center justify-center font-plex-mono text-[11px] font-bold text-ink shadow-sm">
                  ↔
                </div>
              </div>

              {/* Invisible range input covering image */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Before/After split slider"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-plex-mono text-slate">
              <span>← Drag slider or hover across image to compare</span>
              <span>Split: {sliderPos}%</span>
            </div>
          </div>

          {/* CHANGE METRICS & EXG BREAKDOWN (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 bg-[#FDFCFA] border border-slate/30 text-ink space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-plex-mono text-slate uppercase tracking-wider block">
                  QUANTIFIED CHANGE SCORE (V1)
                </span>
                {loading && (
                  <span className="text-[10px] font-plex-mono text-ochre animate-pulse">
                    Computing...
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-fraunces font-bold ${exgDelta >= 0 ? "text-moss" : "text-oxide"}`}>
                  {exgDelta >= 0 ? `+${(exgDelta * 100).toFixed(1)}%` : `${(exgDelta * 100).toFixed(1)}%`}
                </span>
                <span className="text-xs font-plex-mono text-slate">vegetation index delta</span>
              </div>

              <div className="h-px bg-slate/20 w-full" />

              <div className="space-y-2 text-xs font-plex-mono">
                <div className="flex justify-between">
                  <span className="text-slate">Before ExG index:</span>
                  <span className="font-semibold text-ink">{beforeExg.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">After ExG index:</span>
                  <span className="font-semibold text-moss">{afterExg.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Normalized change score:</span>
                  <span className="font-semibold text-ink">{changeScore.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-paper-light border border-slate/20 text-xs font-plex-sans text-ink/80">
                <span className="font-bold block font-plex-mono text-[11px] text-ink mb-1">
                  SHARP CANOPY ANALYSIS
                </span>
                {summary}
              </div>

              <div className="pt-2">
                <Link
                  href={pair?.afterAsset.id ? `/verify/${pair.afterAsset.id}` : "/verify/asset_demo_01"}
                  className="block text-center py-2 border border-slate/40 text-xs font-plex-mono font-medium hover:border-ink transition-colors"
                >
                  View Cryptographic Proof Receipt →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
