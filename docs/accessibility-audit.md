# Accessibility Audit — Component & Page TSX

**Scope:** all component files under `src/components/` and all pages under `src/app/`.
**Date:** 2026-08-14
**Result:** 16 findings across 5 severity tiers. No source files were changed.

---

## Summary

The codebase is structurally sound. Most interactive widgets are built on Radix primitives, which
supply correct roles, focus management, and keyboard handling for free — `Drawer`, `Select`,
`Tooltip`, `Popover`, `Checkbox`, `Switch`, `RadioGroup`, `Separator`, `Tabs`, `Toast` and
`ToggleGroup` are all in good shape. Icons are consistently marked `aria-hidden`, most icon-only
buttons carry translated labels, and the settings page uses `<section aria-labelledby>` correctly.

`biome check src` **passes clean** (157 files, no diagnostics) with the `a11y` rules from Biome's
recommended preset enabled.

Every issue below is one the linter structurally cannot catch. They fall into three groups:

- **Component-boundary blindness.** `<Image onClick>` is not `<img onclick>`, and `<Button>` is not
  `<button>` — static rules like `useKeyWithClickEvents` only match lowercase DOM elements, so a
  click handler on a React component is invisible to them.
- **Hand-rolled components that bypass Radix.** `Modal` re-implements a dialog from scratch and
  misses nearly everything Radix would have provided.
- **Correctness of labelling.** No static rule can tell that an `aria-label` reading
  "Open admin page" is attached to the Settings button, or that a label contradicts the visible text
  next to it.

Two findings (#1 and #2) block keyboard and screen-reader users from functionality outright and are
worth fixing regardless of what else is picked up.

**Severity key:** 🔴 blocks users · 🟠 wrong semantics · 🟡 degraded experience · ⚪ minor

---

## Tier 1 — Blocks keyboard / screen-reader users outright

### 🔴 1. Album art lightbox is completely keyboard-unreachable

`src/components/modules/album/albumCard.tsx:61-70`, `:281-290`

```tsx
<Image
  onClick={() => openModal(aa)}
  src={`/albums/${aa}`}
  alt={t(($) => $.albums.cover_art, { album: album.album })}
  className="w-64 h-auto rounded-secondary cursor-pointer"
/>
```

`onClick` sits directly on `next/image` with no `tabIndex`, no `role`, and no key handler. This is
the *only* way to open album art, and the image inside the modal (`:281-290`) has the same problem
as the only way to dismiss it. A keyboard or screen-reader user cannot open album art at all, and if
they somehow land in the modal they cannot close it by that path.

**WCAG:** 2.1.1 Keyboard (A), 4.1.2 Name, Role, Value (A)

**Fix:** wrap in `<button type="button">` with a translated label. The correct pattern already
exists 170 lines further down the same file — the honorable-mentions grid at `:236-264` wraps its
cover art in a real `<button>`. Mirror that.

---

### 🔴 2. `Modal` has no dialog semantics, focus trap, or Escape handling

`src/components/ui/modal.tsx`

The component is hand-rolled and missing, in full: `role="dialog"`, `aria-modal`, any accessible
name, a focus trap, an Escape handler, and focus restoration on close. Focus stays wherever it was
when the modal opened, and Tab walks straight through the content behind the overlay.

This is not a rare path. It backs all four settings pickers (accent, language, and both corner
pickers) and both album lightboxes.

```tsx
<div className="fixed inset-0 z-60 flex items-center justify-center">
  <button
    type="button"
    className="absolute inset-0 w-full h-full cursor-pointer"
    style={{ background: "rgba(0,0,0,0.75)" }}
    onClick={onClose}
    aria-label={t(($) => $.ariaLabels.close)}
  />
  <div className={cn("relative bg-background overflow-hidden", className)}>
```

**WCAG:** 2.1.2 No Keyboard Trap (A), 2.4.3 Focus Order (A), 4.1.2 Name, Role, Value (A)

**Fix:** rebuild on Radix `Dialog`, mirroring `src/components/ui/drawer.tsx`, which already does
exactly this correctly — portal, overlay, `Dialog.Content`, and an `sr-only` `Dialog.Title`. Keep
the existing `open` / `onClose` / `showClose` / `className` prop shape so no caller needs to change.

Two notes for whoever implements it:

- `useModalStore` is referenced **only** by `modal.tsx` (confirmed by grep across `src/`). Its
  `openCount` / `document.body.style.overflow` bookkeeping exists solely to work around the missing
  scroll lock, and can be retired entirely once Radix handles it.
- The full-screen `<button>` backdrop at `:38-44` puts a 100vw × 100vh focusable "Close" button in
  the tab order. Radix's `Dialog.Overlay` plus `onPointerDownOutside` replaces it cleanly.

---

### 🔴 3. Settings button announces itself as "Open admin page"

`src/components/modules/menu.tsx:199`

```tsx
aria-label={t(($) => $.ariaLabels.open_admin_page)} // make open Settings page
```

The comment is the original author's. A screen-reader user navigating the menu hears "Open admin
page" twice from the admin section and then a third time from the Settings button.

`ariaLabels.open_settings_page` — *"Open settings page"* / *"Einstellungen-Seite öffnen"* — already
exists in both `src/i18n/locales/en.json` and `de.json` and has zero usages anywhere in `src/`. This
is a one-identifier fix with both translations already written.

Note it compounds: `open_admin_page` is used on lines 166, 181 **and** 199, so three buttons leading
to three different destinations all announce the same name.

**WCAG:** 4.1.2 Name, Role, Value (A)

---

## Tier 2 — Wrong or missing semantics

### 🟠 4. `aria-label` overrides visible text throughout the menu

`src/components/modules/menu.tsx` — lines 82, 94, 106, 119, 166, 181

Every navigation button carries both visible text and an `aria-label` that replaces it:

| Line | Visible text | Announced as |
|---|---|---|
| 82 | Music | "Open music page" |
| 94 | Playground | "Open playground page" |
| 106 | About | "Open about page" |
| 119 | CV/Resume | "Open CV page" |
| 166 | Album | "Open admin page" |
| 181 | User Album | "Open admin page" |

Two consequences. First, voice-control users who say "click Music" get no match, because the
accessible name doesn't contain the visible label — this is precisely what WCAG 2.5.3 prohibits.
Second, the two admin buttons (`:166`, `:181`) collapse to the *same* announced name despite having
distinct visible text, making them impossible to tell apart by ear.

**WCAG:** 2.5.3 Label in Name (A), 4.1.2 Name, Role, Value (A)

**Fix:** delete `aria-label` from every button that already has visible text. Keep it only on the
genuinely icon-only buttons — HTML CV (`:132`), PDF CV (`:144`), settings (`:199`), theme toggle
(`:215`) and the language flags (`:229`), all of which are correct as-is apart from #3.

---

### 🟠 5. Filter chips convey pressed state by colour alone

`src/components/modules/album/albumFilter.tsx:196-213`

```tsx
<button
  key={key}
  type="button"
  disabled={disabled}
  className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
  onClick={() => toggleFilter(filterKey, key)}
>
  <Chip text={value} className={/* bg-theme-500 when active */} />
</button>
```

These are toggle buttons. Whether a genre or label filter is currently applied is communicated
purely by background colour — there is no `aria-pressed`, so a screen-reader user cannot tell which
filters are active, and neither can a sighted user who can't distinguish the theme colour from the
default chip background.

**WCAG:** 1.4.1 Use of Color (A), 4.1.2 Name, Role, Value (A)

**Fix:** add `aria-pressed={active}`. The codebase already does this correctly in
`src/components/modules/settings/settingsSwatchButton.tsx:26`.

*Related, lower priority:* `disabled` on out-of-range chips (`:199`) removes them from the
accessibility tree entirely, so their existence is invisible rather than merely unavailable.
`aria-disabled` would keep them discoverable.

---

### 🟠 6. Range sliders have no accessible name

`src/components/ui/slider.tsx`

The component's prop type accepts no label of any kind, and nothing is forwarded to
`SliderPrimitive.Thumb`:

```tsx
type SliderProps = {
  value: SliderValue;
  onValueChange: (value: SliderValue) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  className?: string;
};
```

All three sliders on the album filter — rank, year and runtime (`albumFilter.tsx:270`, `:293`,
`:316`) — are therefore anonymous. Their visible labels are sibling `<span>` elements with no
programmatic association. A screen-reader user hears "slider, 1972" with no indication of what is
being adjusted.

Each of these is a **two-thumb range**, so each thumb additionally needs its own name — "minimum
year" and "maximum year" — otherwise both thumbs announce identically.

**WCAG:** 1.3.1 Info and Relationships (A), 4.1.2 Name, Role, Value (A)

**Fix:** add `label` / `thumbLabels` props to `Slider` and forward them to each `Thumb`; add the
corresponding locale keys. Note that `Select` already solves the same problem correctly by accepting
an `id` prop (`select.tsx:78`) — the same approach would work here.

---

### 🟠 7. Admin nav is a tablist that performs page navigation

`src/components/modules/admin/adminNav.tsx`

```tsx
<Tabs value={active} onValueChange={() => {}} className="self-center">
  <TabsList>
    <TabsTrigger asChild value="album">
      <Link href={`/${lang}/admin/album/`}>{t(($) => $.admin.nav.album)}</Link>
    </TabsTrigger>
```

Radix `Tabs` emits `role="tablist"` and `role="tab"` around `<Link>`s that perform full page
navigations. `onValueChange` is a no-op, and there are no `TabsContent` panels anywhere in the tree.
Screen readers announce "tab, 1 of 2" and expose tab semantics — arrow-key navigation between tabs,
an associated tabpanel — none of which exist. The `aria-controls` relationship a tab promises points
at nothing.

**WCAG:** 4.1.2 Name, Role, Value (A), 1.3.1 Info and Relationships (A)

**Fix:** this is site navigation, not a tab widget. Use `<nav aria-label="Admin">` with plain links
and `aria-current="page"` on the active one. The visual treatment can be kept with the same classes.

---

### 🟠 8. Broken heading outline across the site

Several independent causes, worth listing separately since they need different fixes:

**a. The site name is an `<h1>` on every page.** `src/components/layout/header.tsx:38` renders
`<h1>Mike Brucker</h1>` inside the persistent header. Every page therefore opens with an `<h1>` that
describes the site, not the page.

**b. Two pages then add a second `<h1>`.** `src/app/[lang]/settings/page.tsx:152` and
`src/app/[lang]/cv/page.tsx:278` each render their own `<h1>`, so those pages ship two.

**c. The music page title is not a heading at all.**
`src/components/modules/album/albumList.tsx:148`:

```tsx
<span className="font-metal-mania font-semibold tracking-widest ...">
  {title}
</span>
```

The primary heading of the app's default landing route (`defaultRoute = "music"`) is a styled
`<span>`. Screen-reader users navigating by heading skip straight past it.

**d. The About page has no heading of any level.** `src/app/[lang]/about/page.tsx` uses `<code>` as
its visual title (`:56`) and `<p className="font-semibold font-mono">` for each group label (`:63`).

**e. CV skill-group labels are `<p>`.** `src/app/[lang]/cv/page.tsx:299`.

**f. Every accordion emits `<h3>` regardless of nesting depth.** Radix `Accordion.Header` renders
`Primitive.h3` (verified in `node_modules/@radix-ui/react-accordion/dist/index.mjs:239`), and
`src/components/ui/accordion.tsx:54` uses it unmodified. On the CV page this produces:

```
h1  Mike Brucker          (site header)
h1  Mike Brucker          (page)
h3  Skills                (accordion — h2 skipped)
h3  Work Experience       (accordion)
h3    Swarovski           (cvEntryCard.tsx:14 — same level as its own container)
h4      Full-stack Developer
```

**WCAG:** 1.3.1 Info and Relationships (A), 2.4.6 Headings and Labels (AA)

**Fix:** demote the header logo to a `<span>`/`<p>` with identical styling; give each page exactly
one `<h1>` describing that page; promote the About and CV group labels to `<h2>`/`<h3>`; add a
`headingLevel` prop to `Accordion` so nested usages can render `<h4>` where appropriate.

---

## Tier 3 — Missing announcements & untranslated a11y strings

### 🟡 9. Loading states are silent and hardcoded to English

`src/components/ui/loader/index.tsx:31,35`

```tsx
return onClick ? (
  <button type="button" aria-label="Loading" onClick={onClick} className={wrapperClassName}>
    {bars}
  </button>
) : (
  <div className={wrapperClassName}>{bars}</div>
);
```

The button branch hardcodes the English string `"Loading"` in an otherwise fully translated app. The
`<div>` branch — the one used almost everywhere — has no `role="status"`, no `aria-live`, and no
text at all, so it is entirely invisible to assistive technology.

This matters more than a loading spinner normally would, because of where it sits:

- `src/components/providers/appGate.tsx:14` gates **the entire application** behind it. Until the
  theme and language stores hydrate, `children` is `null` and the loader is the only thing rendered.
  The server-rendered HTML contains no page content, and nothing announces that anything is
  happening.
- `src/app/[lang]/loading.tsx` uses it for every route transition, so navigation is silent too.

**WCAG:** 4.1.3 Status Messages (AA), 3.1.2 Language of Parts (AA)

**Fix:** `role="status"` + `aria-live="polite"` on both branches, with `sr-only` translated text.
Add a `loading` key to the `ariaLabels` block in both locale files.

---

### 🟡 10. Drag handle label is hardcoded English, and reorders are unannounced

`src/components/ui/sortableListRow.tsx:22`

```tsx
aria-label="Drag to reorder"
```

Untranslated in an app that otherwise routes every user-facing string through i18next. Separately,
there is no live region reporting the outcome of a reorder, so a keyboard user who moves an item has
no feedback about where it landed or what position it now holds.

**WCAG:** 4.1.3 Status Messages (AA), 3.1.2 Language of Parts (AA)

**Fix:** move the string into `ariaLabels`; add an `aria-live="polite"` region announcing
"*{item}* moved to position *{n}* of *{total}*" after a drop.

---

### 🟡 11. Admin form inputs are labelled by placeholder only

`src/components/modules/admin/album/adminAlbumCreditListEditor.tsx:38-49`
`src/components/modules/admin/album/adminAlbumTrackEditor.tsx:35-63`

```tsx
<Input
  placeholder={t(($) => $.admin.placeholder.name)}
  disabled={disabled}
  value={credit.name}
  onChange={(e) => update(index, { name: e.target.value })}
/>
```

A placeholder is not an accessible name. It also disappears the moment the user types, so anyone
relying on it loses the only cue about what the field holds — which matters here, since the track
editor puts number / title / duration / disc side by side with nothing else distinguishing them.

Worth noting the codebase gets this right elsewhere: `adminAlbumTrackEditor.tsx:64-74` uses a proper
`<label htmlFor>` for the instrumental checkbox, and `adminAlbumJsonUpload.tsx:212` does the same for
the JSON textarea.

**WCAG:** 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A), 4.1.2 (A)

**Fix:** add `aria-label` using the translation keys already in use as placeholders — no new locale
entries needed.

---

### 🟡 12. `AppIcon` hides only half its icons

`src/components/ui/icon.tsx:15,32`

The string (mask-image) branch sets `aria-hidden`:

```tsx
<span aria-hidden className={cn("inline-block", ...)} style={{ maskImage: ... }} />
```

The `HugeiconsIcon` branch does not:

```tsx
<HugeiconsIcon icon={icon} className={cn(useThemeColor ? "text-theme-600" : undefined, className)} />
```

So decorative SVGs rendered through the second branch stay exposed to assistive technology.
Behaviour varies by browser and screen reader, but the inconsistency between the two branches of the
same component is the real problem — callers can't reason about it.

**WCAG:** 1.1.1 Non-text Content (A)

**Fix:** apply `aria-hidden` in both branches, with an explicit opt-out prop for the rare icon that
carries meaning on its own.

---

## Tier 4 — Global / architectural

### 🟠 13. `<html lang>` is always `"en"`, including on German pages

`src/app/layout.tsx:46`

```tsx
<html lang="en" className={figtree.variable}>
```

The value is corrected only after hydration, in a client effect —
`src/components/providers/languageInit.tsx:19-21`:

```tsx
useEffect(() => {
  document.documentElement.lang = language;
}, [language]);
```

There is no `middleware.ts` in the project. Every German page is therefore served as `lang="en"`,
and a screen reader announces German content in an English voice — wrong phoneme set, wrong
pronunciation rules — until JavaScript loads and hydration completes. For users on slow connections
or with JS disabled, it never corrects.

**WCAG:** 3.1.1 Language of Page (A)

**Fix — two routes, with a constraint:** the root layout owns the `<html>` element but does not
receive the nested `[lang]` route param, so the locale has to be obtained another way.

1. **Derive it in the root layout.** Make `RootLayout` async and read the locale from the incoming
   request (via `headers()`), rendering the correct `lang` server-side. No new files; keeps
   `LanguageInit` as a client-side fallback. Simplest change.
2. **Add `src/middleware.ts`.** Detect the locale and set a request header the root layout reads.
   More moving parts, but centralises locale negotiation and redirects for later use — currently
   handled ad hoc by `src/app/page.tsx` and `src/app/[lang]/layout.tsx:8-10`.

Either way, `LanguageInit`'s effect should stay as a client-side correction for in-session language
switches, which don't trigger a document reload.

---

### 🟡 14. No `prefers-reduced-motion` support anywhere

`src/app/globals.css` contains no `prefers-reduced-motion` block, and neither does
`src/components/ui/loader/style.css`.

The app is heavily animated:

| Animation | Location |
|---|---|
| `--animate-flap: flap 1s ease-in-out infinite` | `globals.css:1023`, on the scroll-to-top FAB |
| Drawer slide in/out, 4 keyframe sets | `globals.css:1042-1074` |
| Collapsible expand/collapse | `globals.css:1076-1091` |
| Accordion up/down | `ui/accordion.tsx:113` |
| Rank-badge fade + slide swap | `albumList.tsx:169-188` |
| `transition-[font-size] duration-500/1000` | `header.tsx:38`, `albumList.tsx:148`, `rankBadge.tsx:40-56`, and others |
| `scrollTo({ behavior: "smooth" })` | `scrollToTopFab.tsx:41` |

The `flap` animation is the sharpest issue: it loops **infinitely** with no pause, stop or hide
mechanism, which WCAG 2.2.2 requires for any motion lasting more than five seconds.

**WCAG:** 2.2.2 Pause, Stop, Hide (A), 2.3.3 Animation from Interactions (AAA)

**Fix:** a global `@media (prefers-reduced-motion: reduce)` block neutralising animation and
transition durations, plus honouring the same query in the `scrollTo` call — `behavior` should be
`"auto"` when reduced motion is requested.

---

### 🟡 15. No skip link

`src/components/layout/appLayout.tsx:23-31`

```tsx
<div className="flex flex-col h-dvh items-center flex-start font-sans">
  <Menu open={menuOpen} onClose={() => setMenuOpen(false)} useTheme />
  <Header onAction={() => setMenuOpen(true)} actionIcon={Menu01Icon} sticky />
  <main className="flex flex-col items-center grow w-full overflow-y-auto transition-all">
```

There is no skip-to-content link, and `<main>` has no `id` to target. Keyboard users tab through the
header — logo link and menu button — on every single page before reaching content. The header is
`sticky`, so it's present throughout.

**WCAG:** 2.4.1 Bypass Blocks (A)

**Fix:** add an `id="main"` to `<main>` and a visually-hidden-until-focused skip link as the first
focusable element in the layout. Tailwind's `sr-only` / `focus:not-sr-only` handles the styling.

---

## Tier 5 — Playground

### ⚪ 16. Playground is well-structured; one unlabelled control

Included at the user's request. This is the **best**-structured area of the app and needs almost
nothing:

- `src/app/[lang]/playground/page.tsx:35` has a proper, single `<h1>`.
- `src/components/modules/playground/demoCard.tsx:20-27` correctly pairs
  `<section aria-labelledby>` with a matching `<h2 id>`. All 24 demo names are single words, so the
  generated ids are valid.
- `DemoText` (`:23`), `DemoNumber` (`:27`), `DemoTextArea` (`:24`) and `DemoSwitch` (`:16`) all pass
  `aria-label` through to their controls.

The one gap:

**`src/components/modules/playground/demoSelect.tsx:24-32`** passes neither `aria-label` nor the
`id` that `Select` accepts, so every select control in the playground is unlabelled. The label
rendered by `DemoControl` (`demoControl.tsx:18`) is a plain `<p>` with no programmatic association:

```tsx
<p className="text-sm font-medium font-mono text-foreground">{label}</p>
```

That pattern works only because every *other* control self-labels. It's worth being explicit about
that contract — either by having `DemoControl` generate an id and wire it up, or by documenting that
children must label themselves.

**WCAG:** 1.3.1 Info and Relationships (A), 4.1.2 Name, Role, Value (A)

---

## Suggested order of work

| Priority | Findings | Rationale |
|---|---|---|
| 1 | #1, #2, #3 | Restore access to functionality that is currently unreachable. #3 is a one-line change with the translation already written. |
| 2 | #4, #5, #7 | Wrong semantics actively mislead. All three are small, contained diffs. |
| 3 | #13, #15, #14 | Global fixes with broad reach; #13 and #15 are each a handful of lines. |
| 4 | #6, #8, #9 | Require adding props or locale keys — slightly larger, but mechanical. |
| 5 | #10, #11, #12, #16 | Polish and consistency. |

## What was checked and found correct

Recorded so future audits don't re-investigate:

- `Drawer` (`ui/drawer.tsx`) — correct Radix `Dialog` usage with an `sr-only` `Dialog.Title`.
- `Fab` (`ui/fab.tsx:55-56`) — correctly applies `aria-hidden` and `tabIndex={-1}` when hidden.
- `SettingsSection` (`modules/settings/settingsSection.tsx`) — proper `aria-labelledby` + `<h2>`.
- `SettingsSwatchButton` (`:26`) — correct `aria-pressed`.
- Decorative imagery in `adminUserAlbumSortClient.tsx:372-379` — correct `alt=""` + `aria-hidden`
  on the blurred backdrop, with the real cover labelled separately.
- Icon `aria-hidden` usage in `checkbox.tsx:19`, `select.tsx:86,122`, `toast.tsx:68`,
  `accordion.tsx:70`, `collapsible.tsx:109`, `albumFilter.tsx:167,181,236`.
- External links in `menu.tsx:134,146` and `cvLinkButton.tsx:19-20` — correct
  `rel="noopener noreferrer"`. *(Advisory only: `target="_blank"` isn't announced to screen-reader
  users — WCAG 3.2.5 (AAA). Not counted as a finding.)*
- Form labelling in `adminAlbumJsonUpload.tsx:212` and `adminAlbumTrackEditor.tsx:64-74`.
- Radix-backed primitives generally: `Select`, `Tooltip`, `Popover`, `Checkbox`, `Switch`,
  `RadioGroup`, `Separator`, `Tabs`, `Toast`, `Toggle`, `ToggleGroup`.

## Tooling note

`biome check src` passes clean, and the `a11y` rules in the recommended preset are active. Consider
adding a runtime checker to catch what static analysis cannot — `axe-core` in a dev-only harness, or
`@axe-core/playwright` in CI — since every finding above went undetected by the linter.
