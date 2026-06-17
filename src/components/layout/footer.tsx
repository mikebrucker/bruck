"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface FooterProps extends React.ComponentProps<"footer"> {
  sticky?: boolean;
}

function Footer({ className, sticky = false, ...props }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "flex w-full items-center justify-end bg-card border-t px-4 py-4",
        sticky && "sticky bottom-0 z-10",
        className,
      )}
      {...props}
    ></footer>
  );
}

export { Footer };
