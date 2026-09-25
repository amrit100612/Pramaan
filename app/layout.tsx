import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#EDE6D6",
};

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#EDE6D6] text-[#1F2A24] font-plex-sans antialiased selection:bg-[#3F6B4F] selection:text-[#EDE6D6]">
        {children}
      </body>
    </html>
  );
}
