import React from "react";
import Link from "next/link";

interface NavBarProps {
  currentPath?: string;
  isMarketing?: boolean;
}

export function NavBar({ currentPath = "/", isMarketing = false }: NavBarProps) {
  return (
    <header className="w-full border-b border-[#1F2A24]/15 bg-[#EDE6D6]/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-[#1F2A24] text-[#EDE6D6] flex items-center justify-center font-fraunces font-bold text-lg rounded-xs -rotate-2 group-hover:rotate-0 transition-transform shadow-xs">
            P
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-fraunces text-2xl font-bold tracking-tight text-[#1F2A24]">
              Pramaan
            </span>
            <span className="text-[10px] font-plex-mono font-medium px-1.5 py-0.5 border border-[#1F2A24]/20 text-[#6B7268] uppercase rounded-xs">
              EVIDENCE
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs font-plex-sans">
          {!isMarketing ? (
            <>
              <Link
                href="/projects/proj-1"
                className={`px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/projects")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Ledger Gallery
              </Link>
              <Link
                href="/search"
                className={`px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/search")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Semantic Search
              </Link>
              <Link
                href="/before-after/pair-1"
                className={`px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/before-after")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Before/After Studio
              </Link>
              <Link
                href="/copilot"
                className={`px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/copilot")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Cited Copilot
              </Link>
              <Link
                href="/campaign/claim-1"
                className={`px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/campaign")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Campaign Studio
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/projects/proj-1"
                className="px-3 py-1.5 text-[#1F2A24] font-medium hover:text-[#3F6B4F] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/terms"
                className="px-3 py-1.5 text-[#6B7268] hover:text-[#1F2A24] transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="px-3 py-1.5 text-[#6B7268] hover:text-[#1F2A24] transition-colors"
              >
                Privacy
              </Link>
            </>
          )}

          <Link
            href="/verify/asset_demo_01"
            className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3F6B4F] text-[#EDE6D6] text-xs font-plex-mono font-medium rounded-xs hover:bg-[#3F6B4F]/90 transition-colors shadow-2xs"
          >
            <span>Public Receipt</span>
            <span className="text-[10px]">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
