"use client";

import { Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AppLayout as BrucksAppLayout, Footer, Header } from "@mikebrucker/brucks/blucks";
import { Button } from "@mikebrucker/brucks/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeaderNav } from "@/components/modules/headerNav";
import { Menu } from "@/components/modules/menu";
import { websiteTitle } from "@/i18n/config";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";
import { useLanguageStore } from "@/stores/useLanguageStore";

function AppLayout({
  children,
  adminToken,
}: {
  children: React.ReactNode;
  adminToken: string | undefined;
}) {
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    useAdminAuthStore.getState().setToken(adminToken);
  }, [adminToken]);

  return (
    <>
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} useTheme />
      <BrucksAppLayout
        // A page rendering [data-scroll-panes] is held to main's height on xl so its panes scroll, not main.
        contentClassName="px-2 sm:px-4 max-w-none xl:has-[[data-scroll-panes]]:min-h-0 xl:has-[[data-scroll-panes]]:pb-(--inset-bottom)"
        header={
          <Header
            sticky
            title={<Link href={`/${language}`}>{websiteTitle}</Link>}
            titleClassName="font-bold font-metal-mania"
            primaryActionButton={
              <Button
                variant="keyboard"
                size="icon"
                onClick={() => setMenuOpen(true)}
                aria-label={t(($) => $.ariaLabels.action)}
              >
                <HugeiconsIcon icon={Menu01Icon} className="size-6 text-theme-500" />
              </Button>
            }
          >
            <HeaderNav />
          </Header>
        }
        footer={
          <Footer sticky className="font-metal-mania">
            &copy;&nbsp;{new Date().getFullYear()}&nbsp;~&nbsp;{websiteTitle}
          </Footer>
        }
      >
        {children}
      </BrucksAppLayout>
    </>
  );
}

export { AppLayout };
