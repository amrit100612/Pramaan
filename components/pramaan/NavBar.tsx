"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NavBarProps {
  currentPath?: string;
  isMarketing?: boolean;
}

export function NavBar({ currentPath = "/", isMarketing = false }: NavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-[#1F2A24]/15 bg-[#EDE6D6]/95 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-8 h-8 bg-[#1F2A24] text-[#EDE6D6] flex items-center justify-center font-fraunces font-bold text-lg rounded-xs -rotate-2 group-hover:rotate-0 transition-transform shadow-xs">
            P
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-fraunces text-xl sm:text-2xl font-bold tracking-tight text-[#1F2A24]">
              Pramaan
            </span>
            <span className="text-[9px] sm:text-[10px] font-plex-mono font-medium px-1 sm:px-1.5 py-0.5 border border-[#1F2A24]/20 text-[#6B7268] uppercase rounded-xs">
              EVIDENCE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-xs font-plex-sans">
          {!isMarketing ? (
            <>
              <Link
                href="/projects/proj-1"
                className={`px-2.5 lg:px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/projects")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Ledger Gallery
              </Link>
              <Link
                href="/search"
                className={`px-2.5 lg:px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/search")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Semantic Search
              </Link>
              <Link
                href="/before-after/pair-1"
                className={`px-2.5 lg:px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/before-after")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Before/After Studio
              </Link>
              <Link
                href="/copilot"
                className={`px-2.5 lg:px-3 py-1.5 rounded-xs transition-colors ${
                  currentPath.includes("/copilot")
                    ? "font-semibold text-[#1F2A24] bg-white/70 shadow-2xs"
                    : "text-[#1F2A24]/80 hover:text-[#1F2A24] hover:bg-black/5"
                }`}
              >
                Cited Copilot
              </Link>
              <Link
                href="/campaign/claim-1"
                className={`px-2.5 lg:px-3 py-1.5 rounded-xs transition-colors ${
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
            className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3F6B4F] text-[#EDE6D6] text-xs font-plex-mono font-medium rounded-xs hover:bg-[#3F6B4F]/90 transition-colors shadow-2xs shrink-0"
          >
            <span>Public Receipt</span>
            <span className="text-[10px]">↗</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/verify/asset_demo_01"
            className="px-2.5 py-1 bg-[#3F6B4F] text-[#EDE6D6] text-[11px] font-plex-mono font-medium rounded-xs shadow-2xs"
          >
            Receipt ↗
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#1F2A24] hover:bg-black/5 rounded-xs border border-[#1F2A24]/20 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1F2A24]/15 bg-[#EDE6D6] px-4 py-4 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          {!isMarketing ? (
            <div className="flex flex-col space-y-1 font-plex-sans text-sm">
              <Link
                href="/projects/proj-1"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xs transition-colors flex items-center justify-between ${
                  currentPath.includes("/projects")
                    ? "font-bold text-[#1F2A24] bg-white/80 shadow-2xs border-l-4 border-[#3F6B4F]"
                    : "text-[#1F2A24]/80 hover:bg-white/50"
                }`}
              >
                <span>Ledger Gallery</span>
                <span className="font-plex-mono text-xs text-[#6B7268]">Projects</span>
              </Link>
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xs transition-colors flex items-center justify-between ${
                  currentPath.includes("/search")
                    ? "font-bold text-[#1F2A24] bg-white/80 shadow-2xs border-l-4 border-[#3F6B4F]"
                    : "text-[#1F2A24]/80 hover:bg-white/50"
                }`}
              >
                <span>Semantic Search</span>
                <span className="font-plex-mono text-xs text-[#6B7268]">pgvector</span>
              </Link>
              <Link
                href="/before-after/pair-1"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xs transition-colors flex items-center justify-between ${
                  currentPath.includes("/before-after")
                    ? "font-bold text-[#1F2A24] bg-white/80 shadow-2xs border-l-4 border-[#3F6B4F]"
                    : "text-[#1F2A24]/80 hover:bg-white/50"
                }`}
              >
                <span>Before/After Studio</span>
                <span className="font-plex-mono text-xs text-[#6B7268]">ExG & Sharp</span>
              </Link>
              <Link
                href="/copilot"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xs transition-colors flex items-center justify-between ${
                  currentPath.includes("/copilot")
                    ? "font-bold text-[#1F2A24] bg-white/80 shadow-2xs border-l-4 border-[#3F6B4F]"
                    : "text-[#1F2A24]/80 hover:bg-white/50"
                }`}
              >
                <span>Cited Copilot</span>
                <span className="font-plex-mono text-xs text-[#6B7268]">AI Citations</span>
              </Link>
              <Link
                href="/campaign/claim-1"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xs transition-colors flex items-center justify-between ${
                  currentPath.includes("/campaign")
                    ? "font-bold text-[#1F2A24] bg-white/80 shadow-2xs border-l-4 border-[#3F6B4F]"
                    : "text-[#1F2A24]/80 hover:bg-white/50"
                }`}
              >
                <span>Campaign Studio</span>
                <span className="font-plex-mono text-xs text-[#6B7268]">Social Assets</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col space-y-1 font-plex-sans text-sm">
              <Link
                href="/projects/proj-1"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 font-bold text-[#1F2A24] bg-white/80 rounded-xs shadow-2xs flex items-center justify-between"
              >
                <span>Open Dashboard</span>
                <span>→</span>
              </Link>
              <Link
                href="/terms"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-[#6B7268] hover:text-[#1F2A24] rounded-xs"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-[#6B7268] hover:text-[#1F2A24] rounded-xs"
              >
                Privacy
              </Link>
            </div>
          )}

          <div className="pt-2 border-t border-[#1F2A24]/10">
            <Link
              href="/verify/asset_demo_01"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 bg-[#3F6B4F] text-[#EDE6D6] text-xs font-plex-mono font-medium rounded-xs flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Audit Public Evidence Receipt</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
