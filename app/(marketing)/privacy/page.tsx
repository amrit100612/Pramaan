import React from "react";
import Link from "next/link";
import { NavBar } from "@/components/pramaan/NavBar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper-light text-ink flex flex-col">
      <NavBar isMarketing={true} currentPath="/privacy" />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="mb-8 border-b border-slate/30 pb-4">
          <div className="inline-block px-2.5 py-0.5 border border-ochre text-ochre text-xs font-plex-mono font-semibold uppercase mb-2">
            DRAFT — for review before any real user data is collected
          </div>
          <h1 className="text-3xl font-fraunces font-bold text-ink">Privacy Notice</h1>
          <p className="text-xs font-plex-mono text-slate mt-1">Last updated: 25 September 2026</p>
        </div>

        <div className="space-y-6 text-sm font-plex-sans text-ink/80 leading-relaxed">
          <p>
            This prototype privacy notice outlines the technical handling of media and metadata within Pramaan during the Geek Room × Cloudinary hackathon development window.
          </p>

          <h2 className="text-lg font-fraunces font-semibold text-ink pt-2">1. Information Processed</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-ink/80">
            <li>Field photography and video files submitted to demo projects.</li>
            <li>Embedded EXIF metadata including timestamps, GPS coordinates, and camera specifications.</li>
            <li>Perceptual hashes (pHash) calculated to detect asset duplication.</li>
            <li>Claim descriptions and evaluation probabilities logged to the Decision Ledger.</li>
          </ul>

          <h2 className="text-lg font-fraunces font-semibold text-ink pt-2">2. Processing & Storage Third Parties</h2>
          <p>
            Media files are stored on Cloudinary infrastructure with signed upload authentication. Metadata and vector embeddings reside in Supabase PostgreSQL tables. No personal tracking cookies or third-party advertising analytics are used.
          </p>

          <h2 className="text-lg font-fraunces font-semibold text-ink pt-2">3. Public Verification Pages</h2>
          <p>
            Assets designated for public report citations or QR code verification are accessible without authentication to allow independent verification by donors and judges. Sensitive personal identifiers or identifiable faces can be protected via Phase 9 Privacy Guard automation.
          </p>

          <div className="pt-6">
            <Link href="/" className="text-xs font-plex-mono text-moss hover:underline">
              ← Return to landing page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
