import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { LenisProvider } from "@/components/providers/lenis-provider";

export const metadata: Metadata = {
  title: "Ajarin Study Tracker",
  description: "Track your study streaks and climb the leaderboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} antialiased dark`}
      style={{
        "--font-serif": "var(--font-sans)",
        "--font-mono": "var(--font-sans)",
      } as React.CSSProperties}
    >
      <body className="flex flex-col font-sans bg-background text-foreground">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
