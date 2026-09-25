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
      textColor: "text-[#3F6B4F]",
      borderColor: "border-[#3F6B4F]",
      bgColor: "bg-[#3F6B4F]/10",
    },
    review: {
      label: "REVIEW",
      textColor: "text-[#C68A2E]",
      borderColor: "border-[#C68A2E]",
      bgColor: "bg-[#C68A2E]/10",
    },
    contradicted: {
      label: "CONTRADICTED",
      textColor: "text-[#9E3B34]",
      borderColor: "border-[#9E3B34]",
      bgColor: "bg-[#9E3B34]/10",
    },
    processing: {
      label: "PROCESSING",
      textColor: "text-[#6B7268]",
      borderColor: "border-[#6B7268]",
      bgColor: "bg-[#6B7268]/10",
    },
  };

  const { label, textColor, borderColor, bgColor } = configs[state] || configs.processing;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] tracking-wider border",
    md: "px-3.5 py-1 text-xs tracking-widest border-2",
    lg: "px-5 py-1.5 text-sm tracking-widest border-[3px]",
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-plex-mono font-bold uppercase select-none ${
        sizeStyles[size]
      } ${textColor} ${borderColor} ${bgColor} ${
        animate ? "stamp-animate" : "-rotate-3"
      } ${className}`}
      style={{
        boxShadow: "inset 0 0 0 1px currentColor",
        borderRadius: "2px",
      }}
      aria-label={`Verification stamp: ${label}`}
    >
      <span className="relative z-10">{label}</span>
    </div>
  );
}
