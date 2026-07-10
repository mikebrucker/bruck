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
        "flex w-full items-center justify-around bg-card border-t rounded-t-lg px-4 py-4 shadow-[0_-5px_6px_-1px_rgb(0_0_0/0.25),0_-3px_4px_-2px_rgb(0_0_0/0.15)] dark:shadow-[0_-5px_6px_-1px_rgb(0_0_0/0.35),0_-3px_4px_-2px_rgb(0_0_0/0.22)]",
        sticky && "sticky bottom-0 z-10",
        className,
      )}
      {...props}
    >
      <div className="flex font-asimovian tracking-widest text-shadow-md text-shadow-theme-600 dark:text-shadow-theme-400">
        <span>&copy; {new Date().getFullYear()}</span>
        <span>&nbsp;&nbsp;~&nbsp;&nbsp;</span>
        <span>Mike Brucker</span>
      </div>
    </footer>
  );
}

export { Footer };
