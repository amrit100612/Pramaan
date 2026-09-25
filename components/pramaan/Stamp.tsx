import React from "react";

export type StampState = "verified" | "review" | "contradicted" | "processing";

interface StampProps {
  state: StampState;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

export function Stamp({ state, size = "md", animate = false, className = "" }: StampProps) {
  const configs = {
    verified: {
      label: "VERIFIED",
      colorClass: "border-moss text-moss",
      hex: "#3F6B4F",
    },
    review: {
      label: "REVIEW",
      colorClass: "border-ochre text-ochre",
      hex: "#C68A2E",
    },
    contradicted: {
      label: "CONTRADICTED",
      colorClass: "border-oxide text-oxide",
      hex: "#9E3B34",
    },
    processing: {
      label: "PROCESSING",
      colorClass: "border-slate text-slate",
      hex: "#6B7268",
    },
  };

  const { label, colorClass } = configs[state] || configs.processing;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs tracking-wider border",
    md: "px-3.5 py-1 text-sm tracking-widest border-2",
    lg: "px-5 py-2 text-base tracking-widest border-[3px]",
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-plex-mono font-bold uppercase select-none transition-transform ${
        sizeClasses[size]
      } ${colorClass} ${animate ? "stamp-animate" : "-rotate-3"} ${className}`}
      style={{
        boxShadow: "inset 0 0 0 1px currentColor, 0 0 0 1px currentColor",
        borderRadius: "2px",
      }}
      aria-label={`Verification stamp: ${label}`}
    >
      <span className="relative z-10">{label}</span>
    </div>
  );
}
