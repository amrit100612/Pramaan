import React from "react";
import { Stamp, StampState } from "./Stamp";

export interface ClaimAnswer {
  label: string;
  probability: number;
  isContradiction?: boolean;
}

export interface ClaimCardProps {
  title: string;
  claimText: string;
  status: StampState;
  survivalScore: number;
  answers?: ClaimAnswer[];
  stateHash: string;
  timestamp: string;
  citedAssetCount?: number;
  onVerifyClick?: () => void;
}

export function ClaimCard({
  title,
  claimText,
  status,
  survivalScore,
  answers = [],
  stateHash,
  timestamp,
  citedAssetCount = 1,
  onVerifyClick,
}: ClaimCardProps) {
  return (
    <div className="relative bg-[#FAF7F0] border-2 border-[#1F2A24]/70 text-[#1F2A24] shadow-md max-w-md w-full rounded-sm overflow-hidden font-plex-sans">
      {/* Perforated Top Header Strip with Ticket Notches */}
      <div className="relative bg-[#EDE6D6] px-4 py-2 border-b-2 border-dashed border-[#1F2A24]/40 flex items-center justify-between">
        {/* Left notch cutout */}
        <div className="absolute -left-2.5 -bottom-2.5 w-5 h-5 bg-[#F6F2EA] rounded-full border border-[#1F2A24]/50" />
        {/* Right notch cutout */}
        <div className="absolute -right-2.5 -bottom-2.5 w-5 h-5 bg-[#F6F2EA] rounded-full border border-[#1F2A24]/50" />

        <span className="text-[10px] font-plex-mono font-bold tracking-widest text-[#6B7268] uppercase">
          EVIDENCE VOUCHER
        </span>
        <span className="text-[10px] font-plex-mono text-[#1F2A24] font-semibold bg-white/70 px-1.5 py-0.5 border border-[#1F2A24]/20">
          #{stateHash.slice(0, 8).toUpperCase()}
        </span>
      </div>

      <div className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        {/* Title & Ink Stamp */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="space-y-0.5 flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-fraunces font-bold text-[#1F2A24] leading-snug break-words">
              {title}
            </h3>
            <p className="text-[11px] sm:text-xs font-plex-mono text-[#6B7268] truncate">
              Sundarbans Sector 4 · Tidal Mangrove Belt
            </p>
          </div>
          <div className="shrink-0 pt-0.5">
            <Stamp state={status} size="sm" animate={status !== "processing"} />
          </div>
        </div>

        {/* Claim Blockquote */}
        <div className="bg-white/80 p-2.5 sm:p-3 border-l-4 border-[#3F6B4F] shadow-2xs">
          <p className="text-xs sm:text-sm font-plex-sans text-[#1F2A24] italic leading-relaxed break-words">
            &ldquo;{claimText}&rdquo;
          </p>
        </div>

        {/* Atomic Checks Breakdown (Jev Jury) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-plex-mono text-[#6B7268] border-b border-[#1F2A24]/15 pb-1">
            <span className="font-semibold uppercase truncate">Jev Jury Evaluation Criteria</span>
            <span className="shrink-0 ml-2">Prob.</span>
          </div>

          <div className="space-y-1.5 font-plex-mono text-[11px] sm:text-xs">
            {answers.length > 0 ? (
              answers.map((ans, i) => (
                <div key={i} className="flex items-center justify-between py-0.5 gap-2">
                  <span className="text-[#1F2A24]/80 flex items-center gap-1.5 min-w-0">
                    {ans.probability >= 0.5 && !ans.isContradiction ? (
                      <span className="text-[#3F6B4F] font-bold shrink-0">✓</span>
                    ) : ans.isContradiction && ans.probability >= 0.5 ? (
                      <span className="text-[#9E3B34] font-bold shrink-0">✗</span>
                    ) : (
                      <span className="text-[#C68A2E] font-bold shrink-0">?</span>
                    )}
                    <span className="break-words line-clamp-2">{ans.label}</span>
                  </span>
                  <span className="font-semibold text-[#1F2A24] shrink-0 ml-2">
                    {(ans.probability).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#1F2A24]/80">
                    <span className="text-[#3F6B4F] font-bold shrink-0">✓</span>
                    <span>activity corroborated</span>
                  </span>
                  <span className="text-[#3F6B4F] font-semibold shrink-0">0.94</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#1F2A24]/80">
                    <span className="text-[#3F6B4F] font-bold shrink-0">✓</span>
                    <span>environment consistent</span>
                  </span>
                  <span className="text-[#3F6B4F] font-semibold shrink-0">0.91</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#1F2A24]/80">
                    <span className="text-[#6B7268] font-bold shrink-0">✗</span>
                    <span>scale contradicts claim</span>
                  </span>
                  <span className="text-[#6B7268] font-semibold shrink-0">0.06</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Survival Score Metric */}
        <div className="bg-[#EDE6D6]/70 p-2 sm:p-2.5 border border-[#1F2A24]/15 flex items-center justify-between">
          <div className="text-[11px] sm:text-xs font-plex-sans text-[#1F2A24]/80">
            Cited Evidence: <span className="font-plex-mono font-bold text-[#1F2A24]">{citedAssetCount} Asset{citedAssetCount > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-plex-mono font-bold shrink-0">
            <span className="text-[#6B7268]">SURVIVAL:</span>
            <span className="text-[#3F6B4F] text-xs sm:text-sm">
              {Math.round(survivalScore * 100)}%
            </span>
          </div>
        </div>

        {/* Footer Hash & Verification Timestamp */}
        <div className="pt-2 border-t border-dashed border-[#1F2A24]/30 flex flex-wrap items-center justify-between gap-1 text-[9px] sm:text-[10px] font-plex-mono text-[#6B7268]">
          <span className="truncate max-w-[180px] sm:max-w-none">HASH: {stateHash}</span>
          <span className="shrink-0">{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
