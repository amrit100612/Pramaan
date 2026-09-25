import React from "react";
import Link from "next/link";
import { NavBar } from "@/components/pramaan/NavBar";
import { ClaimCard } from "@/components/pramaan/ClaimCard";
import { Stamp } from "@/components/pramaan/Stamp";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-[#F6F2EA] text-[#1F2A24] flex flex-col font-plex-sans selection:bg-[#3F6B4F] selection:text-[#EDE6D6]">
      <NavBar isMarketing={true} currentPath="/" />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full space-y-24">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 border border-[#1F2A24]/15 rounded-xs text-xs font-plex-mono text-[#6B7268] uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#3F6B4F] animate-pulse" />
              <span>Verifiable Proof of Impact Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-fraunces font-bold text-[#1F2A24] tracking-tight leading-[1.12]">
              Turns raw field media into cited proof of impact.
            </h1>

            <p className="text-lg sm:text-xl font-plex-sans text-[#1F2A24]/80 leading-relaxed max-w-xl">
              Pramaan automatically ingests, verifies, and audits photos and videos from NGO and sustainability projects. Every impact claim is cross-examined against perceptual evidence before publication.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects/proj-1"
                className="px-6 py-3.5 bg-[#1F2A24] text-[#EDE6D6] font-plex-sans font-semibold text-sm rounded-xs hover:bg-[#1F2A24]/90 transition-all shadow-sm hover:shadow"
              >
                Launch Field Ledger →
              </Link>
              <Link
                href="/verify/asset_demo_01"
                className="px-6 py-3.5 bg-white border border-[#1F2A24]/20 text-[#1F2A24] font-plex-sans font-semibold text-sm rounded-xs hover:bg-black/5 transition-all flex items-center gap-2 shadow-2xs"
              >
                <span>Audit Sample Receipt</span>
                <span className="text-xs">↗</span>
              </Link>
            </div>

            <div className="flex items-center gap-3 pt-3 text-xs font-plex-mono text-[#6B7268]">
              <span className="font-semibold text-[#1F2A24]">Demo Dataset:</span>
              <span>Sundarbans Tidal Mangrove Belt (4,500 Saplings)</span>
            </div>
          </div>

          {/* Interactive Evidence Voucher Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ClaimCard
              title="Sundarbans Zone C Reforestation"
              claimText="4,500 red mangrove saplings successfully planted along the tidal canal buffer."
              status="verified"
              survivalScore={0.92}
              answers={[
                { label: "mangrove sapling activity corroborated", probability: 0.94 },
                { label: "tidal wetland environment consistent", probability: 0.91 },
                { label: "scale contradicts reported count", probability: 0.06, isContradiction: true },
              ]}
              stateHash="e4d9f1a8c207b36e"
              timestamp="2026-09-25 11:42 UTC"
              citedAssetCount={3}
            />
          </div>
        </section>

        {/* PROBLEM BANNER */}
        <section className="bg-white/60 border border-[#1F2A24]/15 p-8 rounded-xs shadow-2xs">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-plex-mono text-[#3F6B4F] font-bold uppercase tracking-wider block">
              The Accountability Dilemma
            </span>
            <h2 className="text-2xl sm:text-3xl font-fraunces font-bold text-[#1F2A24] leading-snug">
              Donors and auditors can no longer afford to simply &ldquo;trust the caption.&rdquo;
            </h2>
            <p className="text-base font-plex-sans text-[#1F2A24]/80 leading-relaxed">
              Field teams capture thousands of unorganized photos. Without automated perceptual verification, claims of trees planted or communities assisted remain vulnerable to accidental reuse, misrepresentation, or greenwashing accusations.
            </p>
          </div>
        </section>

        {/* 3-STEP PIPELINE: PERCEIVE, VERIFY, PUBLISH */}
        <section className="space-y-8">
          <div>
            <span className="text-xs font-plex-mono text-[#6B7268] uppercase tracking-wider block mb-1">
              End-to-End Pipeline
            </span>
            <h2 className="text-3xl font-fraunces font-bold text-[#1F2A24]">
              How Pramaan Verifies Impact
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Perceive */}
            <div className="bg-white/80 border border-[#1F2A24]/15 p-6 rounded-xs space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1F2A24]/10 pb-2">
                  <span className="font-plex-mono text-xs font-bold text-[#3F6B4F] uppercase tracking-widest">
                    01 · Perceive
                  </span>
                  <span className="text-[11px] font-plex-mono text-[#6B7268]">Cloudinary AI</span>
                </div>
                <h3 className="font-fraunces font-bold text-xl text-[#1F2A24]">
                  Smart Field Ingestion
                </h3>
                <p className="text-xs font-plex-sans text-[#1F2A24]/80 leading-relaxed">
                  Automated tagging of species, soil type, and equipment. Extracts EXIF timestamps, GPS coordinates, and computes cryptographic perceptual hashes (pHash) to detect duplicate photos.
                </p>
              </div>

              <div className="bg-[#EDE6D6]/70 p-3 rounded-xs font-plex-mono text-[11px] text-[#6B7268] space-y-1 border border-[#1F2A24]/10">
                <div>GPS: 21.9497° N, 88.8998° E</div>
                <div>Geofence: PASSED (±12m drift)</div>
                <div>pHash collision: NEGATIVE</div>
              </div>
            </div>

            {/* Step 2: Verify */}
            <div className="bg-white/80 border border-[#1F2A24]/15 p-6 rounded-xs space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1F2A24]/10 pb-2">
                  <span className="font-plex-mono text-xs font-bold text-[#3F6B4F] uppercase tracking-widest">
                    02 · Verify
                  </span>
                  <span className="text-[11px] font-plex-mono text-[#6B7268]">Jev Jury</span>
                </div>
                <h3 className="font-fraunces font-bold text-xl text-[#1F2A24]">
                  Probabilistic Evaluation
                </h3>
                <p className="text-xs font-plex-sans text-[#1F2A24]/80 leading-relaxed">
                  Narrative claims are parsed into atomic assertions. Jev evaluates corroboration probabilities in parallel. Results are permanently written to an immutable Decision Ledger.
                </p>
              </div>

              <div className="bg-[#EDE6D6]/70 p-3 rounded-xs font-plex-mono text-[11px] text-[#6B7268] space-y-1 border border-[#1F2A24]/10">
                <div className="text-[#1F2A24] font-semibold">LEDGER ENTRY #7092</div>
                <div>Corroboration: 0.94 probability</div>
                <div>Survival Threshold: PASSED (92%)</div>
              </div>
            </div>

            {/* Step 3: Publish */}
            <div className="bg-white/80 border border-[#1F2A24]/15 p-6 rounded-xs space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#1F2A24]/10 pb-2">
                  <span className="font-plex-mono text-xs font-bold text-[#3F6B4F] uppercase tracking-widest">
                    03 · Publish
                  </span>
                  <span className="text-[11px] font-plex-mono text-[#6B7268]">Public Receipts</span>
                </div>
                <h3 className="font-fraunces font-bold text-xl text-[#1F2A24]">
                  Defensible Reports & QR
                </h3>
                <p className="text-xs font-plex-sans text-[#1F2A24]/80 leading-relaxed">
                  Every published claim and social campaign asset carries an indelible QR code linking to an immutable digital audit receipt. Anyone can independently verify authenticity without an account.
                </p>
              </div>

              <div className="bg-[#EDE6D6]/70 p-3 rounded-xs font-plex-mono text-[11px] text-[#6B7268] space-y-1 border border-[#1F2A24]/10 flex items-center justify-between">
                <span>Receipt: /verify/asset_demo_01</span>
                <Stamp state="verified" size="sm" />
              </div>
            </div>
          </div>
        </section>

        {/* QUICK NAVIGATION / CONSOLE DISCOVERY */}
        <section className="bg-[#1F2A24] text-[#EDE6D6] p-8 sm:p-10 rounded-xs shadow-md">
          <div className="max-w-3xl space-y-5">
            <span className="text-xs font-plex-mono text-[#3F6B4F] uppercase tracking-widest block font-bold">
              Interactive Tools
            </span>
            <h2 className="text-3xl sm:text-4xl font-fraunces font-bold leading-tight">
              Explore the live verification console.
            </h2>
            <p className="text-sm font-plex-sans text-[#EDE6D6]/80 leading-relaxed">
              Browse the field contact sheet, search evidence using natural language, inspect vegetative change using the ExG slider, or query the Cited Copilot.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Link
                href="/projects/proj-1"
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 text-center text-xs font-plex-mono rounded-xs transition-colors"
              >
                📁 Ledger Gallery
              </Link>
              <Link
                href="/search"
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 text-center text-xs font-plex-mono rounded-xs transition-colors"
              >
                🔍 Semantic Search
              </Link>
              <Link
                href="/before-after/pair-1"
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 text-center text-xs font-plex-mono rounded-xs transition-colors"
              >
                ↔ Before/After Studio
              </Link>
              <Link
                href="/copilot"
                className="p-3 bg-white/10 hover:bg-white/20 border border-white/15 text-center text-xs font-plex-mono rounded-xs transition-colors"
              >
                💬 Cited Copilot
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1F2A24]/15 bg-[#EDE6D6] py-8 text-xs font-plex-mono text-[#6B7268]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Pramaan · Verifiable Proof of Impact Platform
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-[#1F2A24] transition-colors">
              Terms (Draft)
            </Link>
            <Link href="/privacy" className="hover:text-[#1F2A24] transition-colors">
              Privacy (Draft)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
