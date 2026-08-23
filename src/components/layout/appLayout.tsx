"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Menu } from "@/components/modules/menu";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

function AppLayout({
  children,
  adminToken,
}: {
  children: React.ReactNode;
  adminToken: string | undefined;
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    useAdminAuthStore.getState().setToken(adminToken);
  }, [adminToken]);

  return (
    <div className="flex flex-col h-dvh items-center flex-start font-sans">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-100 focus:rounded-secondary focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:text-foreground"
      >
        {t(($) => $.ariaLabels.skip_to_content)}
      </a>
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} useTheme />
      <Header onAction={() => setMenuOpen(true)} actionIcon={Menu01Icon} sticky />
      <main
        id="main"
        tabIndex={-1}
        className="flex flex-col items-center grow w-full overflow-y-auto transition-all"
      >
        <div className="flex flex-col grow gap-4 max-w-5xl w-full p-2 py-4 sm:p-4">{children}</div>
      </main>
      <Footer sticky />
    </div>
  );
}

export { AppLayout };
