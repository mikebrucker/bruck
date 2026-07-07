"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Menu } from "@/components/modules/menu";

function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-dvh items-center flex-start font-sans">
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} useTheme />
      <Header onAction={() => setMenuOpen(true)} actionIcon={Menu01Icon} sticky />
      <main className="flex flex-col gap-4 grow items-center max-w-5xl w-full p-1 sm:p-4 transition-all">
        {children}
      </main>
      <Footer sticky />
    </div>
  );
}

export { AppShell };
