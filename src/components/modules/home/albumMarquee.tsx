"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn, shuffle } from "@/lib/utils";

type AlbumMarqueeProps = {
  art: Array<string>;
  count?: number;
  className?: string;
};

function AlbumMarquee({ art, count = 14, className }: AlbumMarqueeProps) {
  const [covers, setCovers] = useState(() => art.slice(0, count));

  useEffect(() => {
    setCovers(shuffle(art).slice(0, count));
  }, [art, count]);

  if (covers.length === 0) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-secondary mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        className,
      )}
    >
      <div className="flex w-max gap-2 animate-marquee hover:paused">
        {[0, 1].map((pass) =>
          covers.map((cover) => (
            <Image
              key={`${pass}-${cover}`}
              src={`/albums/${cover}`}
              alt=""
              width={196}
              height={196}
              className="size-48 rounded-secondary object-cover shrink-0"
            />
          )),
        )}
      </div>
    </div>
  );
}

export { AlbumMarquee };
