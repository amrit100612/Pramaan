import React from "react";
import Link from "next/link";
import { NavBar } from "@/components/pramaan/NavBar";
import { ClaimCard } from "@/components/pramaan/ClaimCard";
import { Stamp } from "@/components/pramaan/Stamp";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-paper-light text-ink flex flex-col">
      <NavBar isMarketing={true} currentPath="/" />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        {/* HERO SECTION */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-slate/40 text-slate text-xs font-plex-mono uppercase tracking-wider">
                Problem Statement 02 · Geek Room × Cloudinary
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-fraunces font-bold text-ink tracking-tight leading-[1.1]">
                Turns field media into cited proof of impact.
              </h1>

              <p className="text-lg sm:text-xl font-plex-sans text-ink/80 leading-relaxed max-w-xl">
                Pramaan automatically ingests raw photos and videos from NGO, government, and community sites. Every claim in a report is cross-examined against verifiable evidence before publication.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/projects/proj-1"
                  className="px-6 py-3 bg-moss text-paper font-plex-sans font-medium text-sm hover:bg-moss/90 transition-colors shadow-sm"
                >
                  Explore Field Ledger
                </Link>
                <Link
                  href="/verify/asset_demo_01"
                  className="px-6 py-3 border border-ink text-ink font-plex-sans font-medium text-sm hover:bg-paper transition-colors flex items-center gap-2"
                >
                  <span>Verify Sample Asset</span>
                  <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>
              </div>

              <div className="pt-4 text-xs font-plex-mono text-slate">
                Simulated example based on Sundarbans Mangrove Restoration dataset.
              </div>
            </div>

            {/* Dominant Visual: Real Claim Card */}
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
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="mb-24 py-10 border-t border-b border-slate/30">
          <div className="max-w-3xl">
            <span className="text-xs font-plex-mono text-slate uppercase tracking-wider block mb-2">
              The Problem
            </span>
            <p className="text-xl sm:text-2xl font-fraunces text-ink leading-snug">
              Field teams capture thousands of unorganized photos and videos. Donors and auditors increasingly question whether claims reflect real work or recycled media. Manual checking does not scale, leaving impact reports vulnerable to doubt.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS (Three varied treatments: Perceive, Verify, Publish) */}
        <section className="mb-24 space-y-16">
          <div>
            <span className="text-xs font-plex-mono text-slate uppercase tracking-wider block mb-2">
              How Pramaan Works
            </span>
            <h2 className="text-3xl font-fraunces font-bold text-ink">
              From raw field capture to verified public receipt.
            </h2>
          </div>

          {/* 1. Perceive */}
          <div className="p-6 bg-paper border border-slate/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-plex-mono font-bold text-moss uppercase tracking-widest">
                01 · Perceive
              </span>
              <span className="text-xs font-plex-mono text-slate">Auto-tagging + EXIF audit</span>
            </div>
            <p className="text-base font-plex-sans text-ink/80 max-w-2xl">
              Cloudinary AI Vision tags species, equipment, and terrain directly from signed field uploads. Cryptographic perceptual hashing (pHash) flags media reused across projects.
            </p>
            <div className="p-3 bg-paper-light border border-slate/20 font-plex-mono text-xs text-slate space-y-1">
              <div>GPS: 21.9497° N, 88.8998° E (Geofence OK)</div>
              <div>Detected: Rhizophora mangle, tidal mudflat, sapling trench, hand spade</div>
              <div>pHash: a7f89c02e1b439f0 · Duplicate check: Negative</div>
            </div>
          </div>

          {/* 2. Verify */}
          <div className="p-6 bg-paper border border-slate/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-plex-mono font-bold text-moss uppercase tracking-widest">
                02 · Verify
              </span>
              <span className="text-xs font-plex-mono text-slate">Jev Jury + Decision Ledger</span>
            </div>
            <p className="text-base font-plex-sans text-ink/80 max-w-2xl">
              Draft narratives are broken into atomic claims. Jev evaluates questions in parallel, outputting calibrated probabilities. Every calculation is permanently logged to an append-only ledger.
            </p>
            <div className="p-3 bg-paper-light border border-slate/20 font-plex-mono text-xs space-y-1 text-slate">
              <div className="text-ink font-semibold">DECISION LEDGER ENTRY #7092</div>
              <div>State Hash: e4d9f1a8c207b36e</div>
              <div>Question: Does visible scale contradict claimed numbers?</div>
              <div>Probability: 0.06 · Survival Threshold: Passed (0.92)</div>
            </div>
          </div>

          {/* 3. Publish */}
          <div className="p-6 bg-paper border border-slate/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-plex-mono font-bold text-moss uppercase tracking-widest">
                03 · Publish
              </span>
              <span className="text-xs font-plex-mono text-slate">Evidence Receipts & QR Verification</span>
            </div>
            <p className="text-base font-plex-sans text-ink/80 max-w-2xl">
              Generate PDF reports mapped to UN Sustainable Development Goals (SDG 13, SDG 15). Every printed claim carries a QR code pointing directly to the tamper-evident digital receipt.
            </p>
            <div className="inline-flex items-center gap-3 pt-2">
              <Stamp state="verified" size="sm" />
              <span className="text-xs font-plex-mono text-slate">
                Publicly verifiable without login or account requirement.
              </span>
            </div>
          </div>
        </section>

        {/* LIVE DEMO CALLOUT */}
        <section className="mb-20 p-8 bg-paper border-2 border-slate/40 text-ink">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-plex-mono text-moss uppercase tracking-wider block">
              Interactive Prototype
            </span>
            <h2 className="text-2xl sm:text-3xl font-fraunces font-bold">
              Test claim verification directly.
            </h2>
            <p className="text-sm font-plex-sans text-ink/80">
              Open the field ledger to run before/after change scoring, search media using natural language, or query the Cited Copilot.
            </p>
            <div className="pt-2">
              <Link
                href="/projects/proj-1"
                className="inline-block px-5 py-2.5 bg-ink text-paper font-plex-sans text-sm font-medium hover:bg-ink/90 transition-colors"
              >
                Launch Field Ledger Console →
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate/30 bg-paper py-8 text-xs font-plex-mono text-slate">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Pramaan · Geek Room × Cloudinary Hackathon · Online round 3 Oct 2026 · Offline round 11 Oct 2026
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-ink transition-colors">
              Terms (Draft)
            </Link>
            <Link href="/privacy" className="hover:text-ink transition-colors">
              Privacy (Draft)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
