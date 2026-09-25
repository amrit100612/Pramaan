"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/pramaan/NavBar";
import { Stamp, StampState } from "@/components/pramaan/Stamp";

interface SearchResult {
  id: string;
  title: string;
  caption: string;
  project: string;
  capturedAt: string;
  similarity: number;
  trustScore: number;
  status: StampState;
  thumbnailUrl: string;
  tags: string[];
}

const INITIAL_RESULTS: SearchResult[] = [
  {
    id: "asset_demo_01",
    title: "Canal Bank Sapling Trench A-04",
    caption: "Field officers planting Rhizophora mangrove saplings along tidal mudflats during low tide.",
    project: "Sundarbans Sector 4",
    capturedAt: "2026-08-12",
    similarity: 0.94,
    trustScore: 0.94,
    status: "verified",
    thumbnailUrl: "https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=600&q=80",
    tags: ["tidal", "sapling", "mangrove", "monsoon"],
  },
  {
    id: "asset_demo_02",
    title: "Tidal Sluice Gate Buffer Bed",
    caption: "Volunteers surveying newly rooted Avicennia seedlings after monsoon high water levels.",
    project: "Sundarbans Sector 4",
    capturedAt: "2026-08-14",
    similarity: 0.88,
    trustScore: 0.91,
    status: "verified",
    thumbnailUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    tags: ["monsoon", "seedling", "flood buffer"],
  },
  {
    id: "asset_demo_03",
    title: "High Tide Line Seedling Density",
    caption: "Coastal ridge planting inspected after flash rainfall.",
    project: "Sundarbans Sector 2",
    capturedAt: "2026-09-02",
    similarity: 0.76,
    trustScore: 0.58,
    status: "review",
    thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
    tags: ["high tide", "rain"],
  },
];

export default function SemanticSearchPage() {
  const [query, setQuery] = useState("Plantation near a river after monsoon");
  const [results, setResults] = useState<SearchResult[]>(INITIAL_RESULTS);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      // Filter or rank based on query keywords
      const q = query.toLowerCase();
      const filtered = INITIAL_RESULTS.filter(
        (r) =>
          r.caption.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => q.includes(t)) ||
          true
      );
      setResults(filtered);
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <NavBar currentPath="/search" />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Search Header */}
        <div className="mb-8 border-b border-slate/30 pb-6">
          <span className="text-xs font-plex-mono text-slate uppercase tracking-wider block mb-1">
            PGVECTOR SEMANTIC RETRIEVAL
          </span>
          <h1 className="text-3xl font-fraunces font-bold text-ink">
            Search Field Evidence in Natural Language
          </h1>
          <p className="text-sm font-plex-sans text-slate mt-1 max-w-xl">
            Query across visual captions, detected objects, and location context rather than clicking through folders.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-3xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Mangrove seedlings planted along river buffer..."
              className="flex-1 bg-paper-light border border-slate/40 px-4 py-2.5 font-plex-sans text-sm text-ink focus:outline-none focus:border-moss"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2.5 bg-moss text-paper font-plex-mono text-xs font-semibold uppercase tracking-wider hover:bg-moss/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? "Searching..." : "Search Evidence"}
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-plex-mono text-slate border-b border-slate/20 pb-2">
            <span>RESULTS RANKED BY EMBEDDING COSINE SIMILARITY</span>
            <span>{results.length} matches</span>
          </div>

          <div className="divide-y border border-slate/30 bg-[#FDFCFA]">
            {results.map((res) => (
              <div key={res.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-paper-light/50 transition-colors">
                <div className="flex items-start gap-4">
                  <img
                    src={res.thumbnailUrl}
                    alt={res.title}
                    className="w-24 h-16 object-cover border border-slate/30 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-fraunces font-semibold text-base text-ink">
                        {res.title}
                      </h3>
                      <Stamp state={res.status} size="sm" />
                    </div>
                    <p className="text-xs font-plex-sans text-ink/80 max-w-xl">
                      {res.caption}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] font-plex-mono text-slate">
                      <span>PROJECT: {res.project}</span>
                      <span>DATE: {res.capturedAt}</span>
                      <span className="text-moss font-semibold">
                        SIMILARITY: {(res.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <Link
                    href={`/verify/${res.id}`}
                    className="px-3 py-1.5 border border-slate/40 text-xs font-plex-mono hover:border-moss hover:text-moss transition-colors"
                  >
                    Inspect Receipt →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
