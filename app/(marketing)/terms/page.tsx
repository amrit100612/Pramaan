import React from "react";
import Link from "next/link";
import { NavBar } from "@/components/pramaan/NavBar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper-light text-ink flex flex-col">
      <NavBar isMarketing={true} currentPath="/terms" />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="mb-8 border-b border-slate/30 pb-4">
          <div className="inline-block px-2.5 py-0.5 border border-ochre text-ochre text-xs font-plex-mono font-semibold uppercase mb-2">
            DRAFT — for review before any real user data is collected
          </div>
          <h1 className="text-3xl font-fraunces font-bold text-ink">Terms of Prototype</h1>
          <p className="text-xs font-plex-mono text-slate mt-1">Last updated: 25 September 2026</p>
        </div>

        <div className="space-y-6 text-sm font-plex-sans text-ink/80 leading-relaxed">
          <p>
            Pramaan is an AI-powered evidence platform that converts raw field photos and videos into searchable, quantified, and verifiable proof of environmental and social action.
          </p>

          <h2 className="text-lg font-fraunces font-semibold text-ink pt-2">1. Scope and Use</h2>
          <p>
            The software demonstrates automated perceptual analysis and probabilistic claim verification. The verdicts, change scores, and trust ratings produced are tamper-evident heuristics designed to assist human monitoring and evaluation officers. They do not constitute certified legal affidavits or forensic guarantees.
          </p>

          <h2 className="text-lg font-fraunces font-semibold text-ink pt-2">2. Infrastructure & Storage</h2>
          <p>
            All media assets uploaded during testing are processed via Cloudinary and relational metadata is stored in Supabase. User accounts and persistent personal credentials are not collected at this MVP phase.
          </p>

          <h2 className="text-lg font-fraunces font-semibold text-ink pt-2">3. Changes to Prototype</h2>
          <p>
            The service is provided on an &ldquo;as is&rdquo; basis for demonstration purposes. Features may be modified, reset, or removed as part of hackathon iterations.
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
