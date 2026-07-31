import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Capture the Love | Podijelite fotografije s vjenčanja",
  description:
    "Capture the Love - jednostavan način da vaši gosti podijele fotografije s vašeg vjenčanja putem QR koda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bs" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream-50 text-ink-900">{children}</body>
    </html>
  );
}
