import type { Metadata } from "next";
import { Asimovian, Figtree, Geist_Mono } from "next/font/google";
import { AppGate } from "@/components/providers/appGate";
import I18nProvider from "@/components/providers/i18n-provider";
import { LanguageInit } from "@/components/providers/languageInit";
import { ThemeInit } from "@/components/providers/themeInit";

import "@/app/globals.css";
import "flag-icons/css/flag-icons.min.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

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
      <body className={`${geistMono.variable} ${asimovian.variable} antialiased`}>
        <LanguageInit />
        <ThemeInit />
        <I18nProvider>
          <AppGate>{children}</AppGate>
        </I18nProvider>
      </body>
    </html>
  );
}
