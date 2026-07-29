"use client";

import { FlyingHumanIcon } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Fab } from "@/components/ui/fab";
import { AppIcon } from "@/components/ui/icon";
import { useScrollAncestor } from "@/hooks/useScrollAncestor";

type ScrollToTopFabProps = {
  /** How many screen heights must be scrolled before the button appears. */
  screensBeforeVisible?: number;
};

export function ScrollToTopFab({ screensBeforeVisible = 2.5 }: ScrollToTopFabProps) {
  const { t } = useTranslation();

  const fabRef = useRef<HTMLButtonElement>(null);
  const scrollAncestor = useScrollAncestor(fabRef);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!scrollAncestor) return;

    const onScroll = () => {
      setVisible(scrollAncestor.scrollTop > scrollAncestor.clientHeight * screensBeforeVisible);
    };

    onScroll();
    scrollAncestor.addEventListener("scroll", onScroll, { passive: true });

    return () => scrollAncestor.removeEventListener("scroll", onScroll);
  }, [scrollAncestor, screensBeforeVisible]);

  return (
    <Fab
      ref={fabRef}
      type="button"
      visible={visible}
      aria-label={t(($) => $.ariaLabels.scroll_to_top)}
      onClick={() => scrollAncestor?.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <AppIcon icon={FlyingHumanIcon} className="animate-flap -rotate-25" />
    </Fab>
  );
}
