"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

type CollapsibleProps = {
  children: React.ReactNode;
  title?: string;
  trigger?: React.ReactNode;
  /**
   * Floor for the collapsed state, in Tailwind spacing units.
   * `16` collapses to `h-16` instead of fully closing. `undefined` collapses to `0`.
   * The open state is always the natural content height.
   */
  collapsedHeight?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  duration?: number;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export function Collapsible({
  children,
  title,
  trigger,
  collapsedHeight,
  defaultOpen = false,
  open,
  onOpenChange,
  disabled = false,
  duration = 300,
  className,
  triggerClassName,
  contentClassName,
}: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const [contentHeight, setContentHeight] = React.useState<number | null>(null);
  const innerRef = React.useRef<HTMLDivElement>(null);

  const isOpen = open ?? uncontrolledOpen;
  const hasPeek = collapsedHeight !== undefined;

  function handleOpenChange(next: boolean) {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  /*
    A peeking collapsible measures its own content instead of leaning on
    `--radix-collapsible-content-height`. Radix reads that height during render
    but writes it in a layout effect, relying on `setIsPresent` to publish it --
    and `forceMount` pins `present` to `true`, so that update always bails out and
    the variable stays a commit behind. Measuring the inner element sidesteps
    that: it is never height-constrained, so it always reports the natural height.
  */
  React.useLayoutEffect(() => {
    if (!hasPeek) return;
    const node = innerRef.current;
    if (!node) return;

    const measure = () => setContentHeight(node.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasPeek]);

  const contentStyle: React.CSSProperties & Record<`--${string}`, string> = {
    animationDuration: `${duration}ms`,
    "--collapsible-collapsed-height": hasPeek ? `calc(var(--spacing) * ${collapsedHeight})` : "0px",
  };
  if (hasPeek) {
    // Never leave this unset: an unresolvable `var()` inside a keyframe drops the
    // whole declaration, and an animation missing an endpoint silently falls back
    // to the element's current height -- which is already the collapsed one.
    contentStyle["--collapsible-content-height"] =
      contentHeight === null ? "auto" : `${contentHeight}px`;
  }

  const triggerNode = trigger ?? (
    <>
      <span className="min-w-0 truncate">{title}</span>
      <svg
        width={16}
        height={16}
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform ease-in-out origin-center group-data-[state=open]:rotate-180"
        style={{ transitionDuration: `${duration}ms` }}
        aria-hidden="true"
      >
        <path
          d="M2.5 4.5 6 8l3.5-3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );

  return (
    <CollapsiblePrimitive.Root
      open={isOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      className={cn("w-full", className)}
    >
      <CollapsiblePrimitive.Trigger
        className={cn(
          "group flex w-full items-center justify-between gap-4 p-2 text-left font-semibold text-muted-foreground tracking-widest hover:text-foreground transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
          triggerClassName,
        )}
      >
        {triggerNode}
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Content
        forceMount={hasPeek || undefined}
        className={cn(
          "overflow-hidden data-[state=closed]:animate-collapsible-collapse data-[state=open]:animate-collapsible-expand",
          // Standing rule, so the collapsed state holds its height whether or not
          // the animation ran -- Radix blocks it on mount, and it never runs if
          // the collapsible is toggled mid-animation. Only safe when peeking: for
          // a plain collapsible this would clamp the height Radix measures on
          // close to `0`, wiping out its own close animation.
          hasPeek ? "data-[state=closed]:h-(--collapsible-collapsed-height)" : null,
        )}
        style={contentStyle}
      >
        <div ref={innerRef} className={cn("flex flex-col", contentClassName)}>
          {children}
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
}
