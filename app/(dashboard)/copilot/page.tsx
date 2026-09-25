"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NavBar } from "@/components/pramaan/NavBar";
import { Stamp } from "@/components/pramaan/Stamp";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  citations?: Array<{
    assetId: string;
    title: string;
    trustScore: number;
    receiptUrl: string;
  }>;
  noEvidenceFound?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg_1",
    sender: "copilot",
    text: "Welcome to Pramaan Cited Copilot. I only synthesize answers directly supported by verified field evidence. If no photographic or sensor proof exists in the ledger, I will explicitly notify you.",
  },
  {
    id: "msg_2",
    sender: "user",
    text: "Did the team successfully complete mangrove planting in Sundarbans Sector 4?",
  },
  {
    id: "msg_3",
    sender: "copilot",
    text: "Yes. Photographic and GPS evidence from August 2026 verifies that 4,500 Rhizophora mangrove saplings were planted along tidal canal buffer A-04 in Sector 4. The Excess Green Index (ExG) confirms canopy establishment (+39.2% change).",
    citations: [
      {
        assetId: "asset_demo_01",
        title: "Canal Bank Sapling Trench A-04 (GPS: 21.9497° N)",
        trustScore: 0.94,
        receiptUrl: "/verify/asset_demo_01",
      },
      {
        assetId: "asset_demo_02",
        title: "Tidal Sluice Gate Buffer Bed",
        trustScore: 0.91,
        receiptUrl: "/verify/asset_demo_02",
      },
    ],
  },
];

export default function CitedCopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botMsg: ChatMessage;

      if (userText.toLowerCase().includes("solar") || userText.toLowerCase().includes("borewell") || userText.toLowerCase().includes("tractor")) {
        // Unverified / No evidence query
        botMsg = {
          id: `bot_${Date.now()}`,
          sender: "copilot",
          text: "No verified evidence found in the ledger. There are no ingested media or approved Jev Jury verdicts confirming solar installations or borewell construction in this sector.",
          noEvidenceFound: true,
        };
      } else {
        // Verified answer with citation
        botMsg = {
          id: `bot_${Date.now()}`,
          sender: "copilot",
          text: `Corroborated by verified ledger assets: Field media confirms active planting with valid timestamps and geofencing. ExG index indicates measurable vegetation density.`,
          citations: [
            {
              assetId: "asset_demo_01",
              title: "Tidal Sapling Trench A-04",
              trustScore: 0.94,
              receiptUrl: "/verify/asset_demo_01",
            },
          ],
        };
      }

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <NavBar currentPath="/copilot" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full flex flex-col">
        {/* Header */}
        <div className="mb-6 border-b border-slate/30 pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-plex-mono text-slate uppercase tracking-wider">
              AI CITATION ENGINE
            </span>
            <span className="text-[10px] font-plex-mono px-1.5 py-0.5 border border-moss text-moss uppercase">
              VERIFIED CLAIMS ONLY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-fraunces font-bold text-ink">
            Cited Field Copilot
          </h1>
          <p className="text-xs font-plex-mono text-slate mt-1">
            Every sentence is anchored to an asset receipt. Non-corroborated queries return &ldquo;No evidence found&rdquo;.
          </p>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 bg-[#FDFCFA] border border-slate/30 p-3.5 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto mb-4 min-h-[350px] sm:min-h-[400px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              } w-full`}
            >
              <div className="text-[10px] font-plex-mono text-slate uppercase mb-1">
                {m.sender === "user" ? "Program Officer" : "Cited Copilot"}
              </div>

              <div
                className={`max-w-[95%] sm:max-w-2xl p-3 sm:p-4 text-xs sm:text-sm font-plex-sans leading-relaxed break-words ${
                  m.sender === "user"
                    ? "bg-paper border border-slate/40 text-ink"
                    : m.noEvidenceFound
                    ? "bg-paper-light border-l-4 border-ochre text-ink/90"
                    : "bg-paper-light border-l-4 border-moss text-ink"
                }`}
              >
                <p className="break-words">{m.text}</p>

                {/* Clickable Citations (Phase 6 requirement) */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate/20 space-y-1.5">
                    <span className="text-[10px] sm:text-[11px] font-plex-mono font-bold text-slate uppercase block">
                      Cited Evidence Receipts:
                    </span>
                    {m.citations.map((cite, i) => (
                      <Link
                        key={i}
                        href={cite.receiptUrl}
                        className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-paper border border-slate/30 text-xs font-plex-mono text-ink hover:border-moss transition-colors group"
                      >
                        <span className="text-moss">🔗</span>
                        <span className="group-hover:underline break-words">{cite.title}</span>
                        <span className="text-[10px] px-1 bg-moss/10 text-moss border border-moss/30 shrink-0">
                          Trust: {(cite.trustScore * 100).toFixed(0)}%
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-plex-mono text-slate">
              <span className="w-1.5 h-1.5 bg-moss rounded-full animate-bounce shrink-0" />
              <span>Cross-examining ledger evidence...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about project evidence..."
            className="flex-1 min-w-0 bg-paper-light border border-slate/40 px-3.5 sm:px-4 py-2.5 font-plex-sans text-sm text-ink focus:outline-none focus:border-moss"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-ink text-paper font-plex-mono text-xs font-semibold uppercase hover:bg-ink/90 transition-colors cursor-pointer w-full sm:w-auto text-center"
          >
            Query
          </button>
        </form>
      </main>
    </div>
  );
}
