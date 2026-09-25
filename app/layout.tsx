import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pramaan — Verified Evidence Platform for Impact & Sustainability",
  description:
    "Pramaan turns raw field photos and video into searchable, quantified, and cited evidence of impact. Every claim is verified before publication.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-paper text-ink font-plex-sans antialiased selection:bg-moss selection:text-paper">
        {children}
      </body>
    </html>
  );
}
