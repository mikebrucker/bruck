import type { Metadata } from "next";
import { Asimovian, Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageInit } from "@/components/languageInit";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const asimovian = Asimovian({
  variable: "--font-asimovian",
  subsets: ["latin"],
  weight: "400",
  fallback: ["sans"],
});

export const metadata: Metadata = {
  title: "Mike Brucker",
  description: "Mike Brucker: Senior Software Developer II: Electric Boogaloo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${asimovian.variable} antialiased`}
      >
        <LanguageInit />
        {children}
      </body>
    </html>
  );
}
