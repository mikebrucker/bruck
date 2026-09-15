"use client";

import { Accordion as AccordionPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizes: Record<
  Size,
  { title: string; subtitle: string; svgSize: number; py: string; gap: string }
> = {
  xs: { title: "text-xs", subtitle: "text-xs", svgSize: 12, py: "py-1", gap: "gap-2" },
  sm: { title: "text-sm", subtitle: "text-xs", svgSize: 14, py: "py-1.5", gap: "gap-2" },
  md: { title: "text-base", subtitle: "text-sm", svgSize: 16, py: "py-2", gap: "gap-2" },
  lg: { title: "text-lg", subtitle: "text-sm", svgSize: 18, py: "py-2.5", gap: "gap-3" },
  xl: { title: "text-xl", subtitle: "text-base", svgSize: 20, py: "py-3", gap: "gap-3" },
  "2xl": { title: "text-2xl", subtitle: "text-base", svgSize: 24, py: "py-3", gap: "gap-3" },
};

const headings = {
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
} as const;

export type HeadingLevel = keyof typeof headings;

type StickyOffset = number | string;

function toCssOffset(offset: StickyOffset) {
  return typeof offset === "number" ? `${offset}px` : offset;
}

type AccordionGroupContextValue = {
  size?: Size;
  duration?: number;
  headingLevel?: HeadingLevel;
  sticky: boolean;
  stickyOffset: StickyOffset;
  stickyClassName?: string;
};

const AccordionGroupContext = React.createContext<AccordionGroupContextValue | null>(null);

type AccordionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  classNames?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  /** Ignored inside an `AccordionGroup`; the group owns the open state. */
  defaultOpen?: boolean;
  size?: Size;
  duration?: number;
  actionButton?: React.ReactNode;
  headingLevel?: HeadingLevel;
  /** Radix item value. Auto-assigned by `AccordionGroup`, generated when standalone. */
  value?: string;
  /** DOM id on the item, so it can be an anchor / scroll target. */
  id?: string;
  /** Pins the header row while its own panel is on screen. */
  sticky?: boolean;
  stickyOffset?: StickyOffset;
  /** Applied to the header row; needs an opaque background while sticky. */
  headerClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  /** Sits at the end of the trigger, so clicking it still toggles the panel. */
  trailing?: React.ReactNode;
};

export function Accordion({
  title,
  subtitle,
  children,
  classNames,
  titleClassName,
  subtitleClassName,
  defaultOpen = true,
  size,
  duration,
  actionButton,
  headingLevel,
  value,
  id,
  sticky,
  stickyOffset,
  headerClassName,
  triggerClassName,
  contentClassName,
  trailing,
}: AccordionProps) {
  const group = React.useContext(AccordionGroupContext);
  const generatedValue = React.useId();

  const itemValue = value ?? generatedValue;
  const resolvedSize = size ?? group?.size ?? "md";
  const resolvedDuration = duration ?? group?.duration ?? 300;
  const resolvedHeadingLevel = headingLevel ?? group?.headingLevel ?? 3;
  const isSticky = sticky ?? group?.sticky ?? false;
  const offset = stickyOffset ?? group?.stickyOffset ?? 0;

  const s = sizes[resolvedSize];
  const durationStyle = { transitionDuration: `${resolvedDuration}ms` };
  const Heading = headings[resolvedHeadingLevel];

  const item = (
    // No `overflow-hidden` here: it would turn the item into a scroll container
    // and cancel the sticky header.
    <AccordionPrimitive.Item
      value={itemValue}
      id={id}
      className={cn("group/accordion-item", group ? classNames : undefined)}
    >
      <div
        className={cn(
          "flex items-center w-full",
          isSticky && "sticky z-10 bg-background",
          isSticky && group?.stickyClassName,
          headerClassName,
        )}
        style={isSticky ? { top: toCssOffset(offset) } : undefined}
      >
        <AccordionPrimitive.Header asChild>
          {/* `rounded-[inherit]` carries any radius set on the header row down to
              the trigger, so its hover background cannot escape rounded corners. */}
          <Heading className="flex flex-1 min-w-0 rounded-[inherit]">
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex flex-1 min-w-0 p-2 items-center gap-4 text-left font-semibold text-muted-foreground tracking-widest hover:text-foreground transition-colors cursor-pointer rounded-[inherit]",
                s.title,
                s.py,
                triggerClassName,
              )}
            >
              <svg
                width={s.svgSize}
                height={s.svgSize}
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0 transition-transform ease-in-out origin-center rotate-180 group-data-[state=open]:rotate-0"
                style={durationStyle}
                aria-hidden="true"
              >
                <line
                  x1="6"
                  y1="1"
                  x2="6"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="transition-transform transform-fill ease-in-out origin-center scale-y-100 group-data-[state=open]:scale-y-0"
                  style={durationStyle}
                />
                <line
                  x1="1"
                  y1="6"
                  x2="11"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-1 flex-col text-foreground min-w-0">
                <span className={titleClassName}>{title}</span>
                {subtitle ? (
                  <span
                    className={cn(
                      "normal-case tracking-normal font-normal text-muted-foreground",
                      s.subtitle,
                      subtitleClassName,
                    )}
                  >
                    {subtitle}
                  </span>
                ) : null}
              </div>
              {trailing}
            </AccordionPrimitive.Trigger>
          </Heading>
        </AccordionPrimitive.Header>
        {actionButton ? (
          <div className="shrink-0 pr-2 flex items-center gap-1">{actionButton}</div>
        ) : null}
      </div>
      <AccordionPrimitive.Content
        className="overflow-hidden ease-in-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        style={{ animationDuration: `${resolvedDuration}ms` }}
      >
        <div className={cn("mt-1 flex flex-col", s.gap, contentClassName)}>{children}</div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );

  if (group) return item;

  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultOpen ? itemValue : undefined}
      className={cn("w-full", classNames)}
    >
      {item}
    </AccordionPrimitive.Root>
  );
}

type AccordionGroupBaseProps = {
  children: React.ReactNode;
  className?: string;
  /** Which panels start open when a child does not set `defaultOpen` itself. */
  defaultOpen?: boolean | "first";
  sticky?: boolean;
  /** Distance from the scroll container's top edge, e.g. a sticky app header's height. */
  stickyOffset?: StickyOffset;
  /** Extra classes for every sticky header row, e.g. a different background. */
  stickyClassName?: string;
  size?: Size;
  duration?: number;
  headingLevel?: HeadingLevel;
};

/**
 * Passing `value` makes the group controlled, which is what lets a caller drive
 * the panels itself - expand/collapse all, or opening one from the URL hash.
 * Controlled children must carry their own `value`, since the auto-assigned
 * `accordion-<index>` ids are not something the caller can name.
 */
type AccordionGroupProps = AccordionGroupBaseProps &
  (
    | {
        /** `multiple` keeps every opened panel open; `single` closes the previous one. */
        type?: "multiple";
        collapsible?: never;
        value?: Array<string>;
        onValueChange?: (value: Array<string>) => void;
      }
    | {
        type: "single";
        collapsible?: boolean;
        value?: string;
        onValueChange?: (value: string) => void;
      }
  );

/**
 * Stacks accordions so each header pins to the top of the scroll container while
 * its own panel is on screen, then gets pushed out by the next one.
 *
 * The effect is plain `position: sticky`, so it only survives if nothing between
 * a header and the scroll container clips or transforms - no `overflow-hidden`,
 * `transform`, `filter` or `contain` on the ancestors.
 */
export function AccordionGroup(props: AccordionGroupProps) {
  const {
    children,
    className,
    defaultOpen = false,
    sticky = true,
    stickyOffset = 0,
    stickyClassName,
    size,
    duration,
    headingLevel,
  } = props;

  const openValues: Array<string> = [];

  // Values are assigned here so the group can resolve which panels start open
  // without the children having to invent ids the caller cannot reference.
  const items = React.Children.toArray(children).map((child, index) => {
    if (!React.isValidElement<AccordionProps>(child)) return child;

    const value = child.props.value ?? `accordion-${index}`;
    const startsOpen =
      child.props.defaultOpen ?? (defaultOpen === "first" ? index === 0 : defaultOpen);

    if (startsOpen) openValues.push(value);

    return React.cloneElement(child, { value });
  });

  const context = React.useMemo<AccordionGroupContextValue>(
    () => ({ size, duration, headingLevel, sticky, stickyOffset, stickyClassName }),
    [size, duration, headingLevel, sticky, stickyOffset, stickyClassName],
  );

  const rootClassName = cn("w-full flex flex-col", className);
  const content = (
    <AccordionGroupContext.Provider value={context}>{items}</AccordionGroupContext.Provider>
  );

  if (props.type === "single") {
    return (
      <AccordionPrimitive.Root
        type="single"
        collapsible={props.collapsible ?? true}
        {...(props.value === undefined
          ? { defaultValue: openValues[0] }
          : { value: props.value, onValueChange: props.onValueChange })}
        className={rootClassName}
      >
        {content}
      </AccordionPrimitive.Root>
    );
  }

  return (
    <AccordionPrimitive.Root
      type="multiple"
      {...(props.value === undefined
        ? { defaultValue: openValues }
        : { value: props.value, onValueChange: props.onValueChange })}
      className={rootClassName}
    >
      {content}
    </AccordionPrimitive.Root>
  );
}
