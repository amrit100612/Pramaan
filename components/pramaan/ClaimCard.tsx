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
    <div className="relative bg-[#FDFCFA] border border-slate/40 text-ink shadow-sm max-w-md w-full overflow-hidden">
      {/* Perforated / torn top edge decoration */}
      <div className="w-full h-2.5 bg-paper flex items-center overflow-hidden border-b border-dashed border-slate/50">
        <svg
          className="w-full h-2.5 text-paper fill-current"
          viewBox="0 0 400 10"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L10,10 L20,0 L30,10 L40,0 L50,10 L60,0 L70,10 L80,0 L90,10 L100,0 L110,10 L120,0 L130,10 L140,0 L150,10 L160,0 L170,10 L180,0 L190,10 L200,0 L210,10 L220,0 L230,10 L240,0 L250,10 L260,0 L270,10 L280,0 L290,10 L300,0 L310,10 L320,0 L330,10 L340,0 L350,10 L360,0 L370,10 L380,0 L390,10 L400,0 Z" />
        </svg>
      </div>

      <div className="p-5">
        {/* Header / Voucher ID */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] font-plex-mono text-slate uppercase tracking-wider block">
              EVIDENCE VOUCHER #{stateHash.slice(0, 6)}
            </span>
            <h3 className="text-lg font-fraunces font-semibold text-ink leading-tight mt-0.5">
              {title}
            </h3>
          </div>
          <div className="shrink-0 mt-1">
            <Stamp state={status} size="sm" animate={status !== "processing"} />
          </div>
        </div>

        {/* Claim Text */}
        <p className="text-sm font-plex-sans text-ink/80 italic mb-4 border-l-2 border-slate/30 pl-2.5 py-0.5">
          &ldquo;{claimText}&rdquo;
        </p>

        {/* Divider */}
        <div className="h-px bg-slate/20 w-full mb-3" />

        {/* Atomic checks list */}
        <div className="space-y-1.5 font-plex-mono text-xs mb-4">
          {answers.length > 0 ? (
            answers.map((ans, i) => (
              <div key={i} className="flex items-center justify-between py-0.5">
                <span className="text-slate flex items-center gap-1.5">
                  {ans.probability >= 0.5 && !ans.isContradiction ? (
                    <span className="text-moss">✓</span>
                  ) : ans.isContradiction && ans.probability >= 0.5 ? (
                    <span className="text-oxide">✗</span>
                  ) : (
                    <span className="text-ochre">?</span>
                  )}
                  {ans.label}
                </span>
                <span className="font-semibold text-ink">
                  {(ans.probability).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center justify-between text-slate">
                <span>activity shown</span>
                <span className="text-moss font-semibold">✓ 0.94</span>
              </div>
              <div className="flex items-center justify-between text-slate">
                <span>wrong environment</span>
                <span className="text-slate font-semibold">✗ 0.03</span>
              </div>
              <div className="flex items-center justify-between text-slate">
                <span>scale contradicts</span>
                <span className="text-slate font-semibold">✗ 0.06</span>
              </div>
            </>
          )}
        </div>

        {/* Big stamp area when verified/rejected */}
        <div className="flex items-center justify-between pt-2 border-t border-slate/20">
          <div className="text-xs font-plex-sans text-slate">
            Cited: <span className="font-plex-mono text-ink font-medium">{citedAssetCount} asset{citedAssetCount > 1 ? "s" : ""}</span>
            <span className="mx-1.5">·</span>
            Survival: <span className="font-plex-mono font-semibold text-ink">{Math.round(survivalScore * 100)}%</span>
          </div>

          {onVerifyClick && (
            <button
              onClick={onVerifyClick}
              className="text-xs font-plex-mono font-medium text-moss hover:underline cursor-pointer"
            >
              Examine ledger →
            </button>
          )}
        </div>

        {/* Mono footer: state hash + time */}
        <div className="mt-4 pt-2.5 border-t border-dashed border-slate/30 flex items-center justify-between text-[11px] font-plex-mono text-slate">
          <span>{stateHash}</span>
          <span>{timestamp}</span>
        </div>
      </div>
    </div>
  );
}
