import React from "react";
import Link from "next/link";

interface NavBarProps {
  currentPath?: string;
  isMarketing?: boolean;
}

export function NavBar({ currentPath = "/", isMarketing = false }: NavBarProps) {
  return (
    <header className="w-full border-b border-slate/30 bg-paper/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 border-2 border-ink flex items-center justify-center font-fraunces font-bold text-ink text-lg -rotate-3 group-hover:rotate-0 transition-transform bg-paper-light">
            P
          </div>
          <span className="font-fraunces text-2xl font-bold tracking-tight text-ink">
            Pramaan
          </span>
          <span className="text-[10px] font-plex-mono px-1.5 py-0.5 border border-slate/40 text-slate uppercase rounded-sm">
            EVIDENCE v1.0
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-4 text-sm font-plex-sans">
          {!isMarketing ? (
            <>
              <Link
                href="/projects/proj-1"
                className={`px-3 py-1.5 rounded-sm hover:text-moss transition-colors ${
                  currentPath.includes("/projects")
                    ? "font-semibold text-ink border-b-2 border-moss"
                    : "text-ink/80"
                }`}
              >
                Ledger Gallery
              </Link>
              <Link
                href="/search"
                className={`px-3 py-1.5 rounded-sm hover:text-moss transition-colors ${
                  currentPath.includes("/search")
                    ? "font-semibold text-ink border-b-2 border-moss"
                    : "text-ink/80"
                }`}
              >
                Semantic Search
              </Link>
              <Link
                href="/before-after/pair-1"
                className={`px-3 py-1.5 rounded-sm hover:text-moss transition-colors ${
                  currentPath.includes("/before-after")
                    ? "font-semibold text-ink border-b-2 border-moss"
                    : "text-ink/80"
                }`}
              >
                Before/After Studio
              </Link>
              <Link
                href="/copilot"
                className={`px-3 py-1.5 rounded-sm hover:text-moss transition-colors ${
                  currentPath.includes("/copilot")
                    ? "font-semibold text-ink border-b-2 border-moss"
                    : "text-ink/80"
                }`}
              >
                Cited Copilot
              </Link>
              <Link
                href="/campaign/claim-1"
                className={`px-3 py-1.5 rounded-sm hover:text-moss transition-colors ${
                  currentPath.includes("/campaign")
                    ? "font-semibold text-ink border-b-2 border-moss"
                    : "text-ink/80"
                }`}
              >
                Campaign Studio
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/projects/proj-1"
                className="px-3 py-1.5 text-ink/80 hover:text-moss transition-colors"
              >
                App
              </Link>
              <Link
                href="/terms"
                className="px-3 py-1.5 text-slate hover:text-ink transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="px-3 py-1.5 text-slate hover:text-ink transition-colors"
              >
                Privacy
              </Link>
            </>
          )}

          <Link
            href="/verify/asset_demo_01"
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 border border-moss text-moss text-xs font-plex-mono font-medium hover:bg-moss hover:text-paper transition-colors"
          >
            <span>Public Verify</span>
            <span className="text-[10px]">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
