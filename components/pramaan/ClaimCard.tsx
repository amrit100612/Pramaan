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

      <div className="p-5 space-y-4">
        {/* Title & Ink Stamp */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5 flex-1">
            <h3 className="text-xl font-fraunces font-bold text-[#1F2A24] leading-snug">
              {title}
            </h3>
            <p className="text-xs font-plex-mono text-[#6B7268]">
              Sundarbans Sector 4 · Tidal Mangrove Belt
            </p>
          </div>
          <div className="shrink-0 pt-0.5">
            <Stamp state={status} size="sm" animate={status !== "processing"} />
          </div>
        </div>

        {/* Claim Blockquote */}
        <div className="bg-white/80 p-3 border-l-4 border-[#3F6B4F] shadow-2xs">
          <p className="text-sm font-plex-sans text-[#1F2A24] italic leading-relaxed">
            &ldquo;{claimText}&rdquo;
          </p>
        </div>

        {/* Atomic Checks Breakdown (Jev Jury) */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] font-plex-mono text-[#6B7268] border-b border-[#1F2A24]/15 pb-1">
            <span className="font-semibold uppercase">Jev Jury Evaluation Criteria</span>
            <span>Prob.</span>
          </div>

          <div className="space-y-1.5 font-plex-mono text-xs">
            {answers.length > 0 ? (
              answers.map((ans, i) => (
                <div key={i} className="flex items-center justify-between py-0.5">
                  <span className="text-[#1F2A24]/80 flex items-center gap-1.5">
                    {ans.probability >= 0.5 && !ans.isContradiction ? (
                      <span className="text-[#3F6B4F] font-bold">✓</span>
                    ) : ans.isContradiction && ans.probability >= 0.5 ? (
                      <span className="text-[#9E3B34] font-bold">✗</span>
                    ) : (
                      <span className="text-[#C68A2E] font-bold">?</span>
                    )}
                    <span>{ans.label}</span>
                  </span>
                  <span className="font-semibold text-[#1F2A24]">
                    {(ans.probability).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#1F2A24]/80">
                    <span className="text-[#3F6B4F] font-bold">✓</span>
                    <span>activity corroborated</span>
                  </span>
                  <span className="text-[#3F6B4F] font-semibold">0.94</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#1F2A24]/80">
                    <span className="text-[#3F6B4F] font-bold">✓</span>
                    <span>environment consistent</span>
                  </span>
                  <span className="text-[#3F6B4F] font-semibold">0.91</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[#1F2A24]/80">
                    <span className="text-[#6B7268] font-bold">✗</span>
                    <span>scale contradicts claim</span>
                  </span>
                  <span className="text-[#6B7268] font-semibold">0.06</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Survival Score Metric */}
        <div className="bg-[#EDE6D6]/70 p-2.5 border border-[#1F2A24]/15 flex items-center justify-between">
          <div className="text-xs font-plex-sans text-[#1F2A24]/80">
            Cited Evidence: <span className="font-plex-mono font-bold text-[#1F2A24]">{citedAssetCount} Asset{citedAssetCount > 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-plex-mono font-bold">
            <span className="text-[#6B7268]">SURVIVAL:</span>
            <span className="text-[#3F6B4F] text-sm">
              {Math.round(survivalScore * 100)}%
            </span>
          </div>
        </div>

        {/* Footer Hash & Verification Timestamp */}
        <div className="pt-2 border-t border-dashed border-[#1F2A24]/30 flex items-center justify-between text-[10px] font-plex-mono text-[#6B7268]">
          <span>HASH: {stateHash}</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
