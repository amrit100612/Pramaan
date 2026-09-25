"use client";

import React, { useState, useEffect } from "react";
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

export default function SemanticSearchPage() {
  const [query, setQuery] = useState("Plantation near a river after monsoon");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMetadata, setSearchMetadata] = useState<{ total: number; durationMs?: number } | null>(null);

  // Initial search on mount
  useEffect(() => {
    runSearch("Plantation near a river after monsoon");
  }, []);

  const runSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsSearching(true);
    const start = Date.now();

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchTerm, projectId: "proj-1" }),
      });
      const json = await res.json();
      if (json.ok && json.data) {
        setResults(json.data.results || []);
        setSearchMetadata({
          total: json.data.count,
          durationMs: Date.now() - start,
        });
      }
    } catch (err: unknown) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-plex-sans">
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
              className="px-6 py-2.5 bg-moss text-paper font-plex-mono text-xs font-semibold uppercase tracking-wider hover:bg-moss/90 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              {isSearching ? "Embedding..." : "Search Evidence"}
            </button>
          </form>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-plex-mono text-slate border-b border-slate/20 pb-2">
            <span>RESULTS RANKED BY 1536-DIM VECTOR COSINE SIMILARITY</span>
            <span>
              {results.length} matches {searchMetadata?.durationMs ? `(${searchMetadata.durationMs}ms)` : ""}
            </span>
          </div>

          {results.length === 0 && !isSearching && (
            <div className="p-8 text-center text-sm font-plex-mono text-slate border border-dashed border-slate/30">
              No matching assets found in the ledger. Try uploading photos or searching for &ldquo;mangrove&rdquo; or &ldquo;sapling&rdquo;.
            </div>
          )}

          <div className="divide-y border border-slate/30 bg-[#FDFCFA]">
            {results.map((res) => (
              <div
                key={res.id}
                className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-paper-light/50 transition-colors"
              >
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
                      <span className="text-moss font-bold">
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
