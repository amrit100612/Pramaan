import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Pramaan Design Tokens (Design.md §Color) ──────────────────────
      colors: {
        ink: "#1F2A24",        // Primary text, dark surfaces — deep forestry-ink green-black
        paper: "#EDE6D6",      // Base background — aged ledger paper
        "paper-light": "#F6F2EA", // Marketing site bg — warmer, lighter
        moss: "#3F6B4F",       // Verified state, primary accent, headers
        ochre: "#C68A2E",      // Needs-review / flagged state — turmeric-stamp tone
        oxide: "#9E3B34",      // Contradicted / rejected state — old rubber-stamp red
        slate: "#6B7268",      // Borders, secondary text, dividers
      },
      // ── Typography (Design.md §Type) ──────────────────────────────────
      fontFamily: {
        fraunces: ["'Fraunces'", "Georgia", "serif"],
        "plex-sans": ["'IBM Plex Sans'", "system-ui", "sans-serif"],
        "plex-mono": ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
