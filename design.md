# Doğukan Ürker — Brand & Design System

> This is the single source of truth for my personal brand identity. Every page,
> product, and application I build should feel like it came from the same hand.
> Feed this document to any tool or model that designs or builds on my behalf and
> the result should be **indistinguishable** from my landing page.
>
> Reference implementation: the landing page (`app/src/components/LandingPage.tsx`).
> When in doubt, the landing page wins.

---

## 1. Design Philosophy

The identity is **editorial, quiet, and confident**. Think a well-printed art
book or a fashion editorial — not a SaaS dashboard, not a developer portfolio
template.

Guiding principles, in priority order:

1. **Cream paper, ink type.** A warm off-white background and near-black ink.
   No pure white, no pure black, no dark mode. The surface should feel like
   paper, not a screen.
2. **Typography is the interface.** Oversized serif display type is the hero
   element. There are almost no boxes, cards, borders, or shadows. Content sits
   directly on the cream field with generous air around it.
3. **Monochrome, with one electric accent.** Photography is grayscale by
   default. Color is rationed: a single electric blue (`#373CE0`) appears only
   on the most important link.
4. **Motion is physical, not decorative.** Everything enters with spring physics
   and reveals on scroll. Nothing blinks, bounces gratuitously, or loops. Motion
   communicates hierarchy and rewards scrolling.
5. **Restraint everywhere.** Lowercase copy, tight word count, lots of negative
   space. If an element isn't earning its place, remove it.
6. **A signature interaction.** The bespoke velocity-reactive cursor is part of
   the brand — as recognizable as the typeface.

If you have to choose between "more features" and "more silence," choose silence.

---

## 2. Color Palette

All colors are defined as CSS custom properties on `:root`. Use the variables,
never hardcode hexes (except the accent blue, which is intentionally a one-off).

```css
:root {
  --brand-cream:        #f3f1ea; /* primary background — warm off-white "paper" */
  --brand-cream-subtle: #eae6dc; /* slightly deeper cream for subtle fills/zones */
  --brand-ink:          #16140d; /* primary text & UI — near-black, warm/brown-black */
  --brand-muted:        #5c5a52; /* secondary text, nav meta, footer */
  --brand-dim:          #8a877e; /* tertiary / lowest-emphasis text, captions */
  --brand-border:       #dcd8cd; /* hairline borders, dividers */
}
```

| Token                  | Hex       | Role                                                        |
| ---------------------- | --------- | ----------------------------------------------------------- |
| `--brand-cream`        | `#f3f1ea` | Page background. Also the `theme-color` meta and html bg.   |
| `--brand-cream-subtle` | `#eae6dc` | Optional deeper-cream sections, hovers, fills.              |
| `--brand-ink`          | `#16140d` | Body text, headings, the custom cursor, focus rings.        |
| `--brand-muted`        | `#5c5a52` | Secondary text — nav role line, links at rest, footer.      |
| `--brand-dim`          | `#8a877e` | Lowest emphasis — captions, code comments.                  |
| `--brand-border`       | `#dcd8cd` | Hairlines and separators (kept extremely subtle).           |

### Accent

```css
--accent-electric: #373CE0; /* the ONE color — used only on the primary brand link hover */
```

- The accent is **scarce by design**. On the landing page it appears only as the
  hover color of the `sensity.ai` link (which also carries a custom glyph).
- Do not introduce additional accent colors. If a new app needs a state color
  (success/error), keep it muted and earthy, never neon — see the syntax
  palette below for the sanctioned extended hues.

### Sanctioned extended palette (use sparingly, e.g. code/syntax/data viz)

Warm, desaturated, "ink on cream" friendly:

```
red    #a72828   blue   #1e4d7c   orange #b25900
green  #2b7040   purple #8f3b76
```

### Rules

- **Never** use pure `#ffffff` or `#000000`. The warmth of cream + ink is the
  brand.
- Backgrounds are always cream. There is no dark theme.
- Text contrast hierarchy is achieved with the ink → muted → dim ramp, **not**
  with opacity on ink (except in deliberate motion reveals).

---

## 3. Typography

Two families do all the work: a **serif display** face and a **clean grotesque
sans** for UI/body.

### 3.1 Families

| Role                     | Family                              | Notes                                                                 |
| ------------------------ | ----------------------------------- | --------------------------------------------------------------------- |
| **Display / Serif**      | **Fraunces** (variable, `opsz` axis, normal + italic) | The signature. Used for the giant name and the about paragraph. Optical sizing **on**. Fallback: `Georgia, serif`. |
| **Body / UI / Sans**     | **Inter** (applied globally on `<body>`) | All nav, footer, link, and interface text. Fallback: `Arial, Helvetica, sans-serif`. |
| Mono (code only)         | Geist Mono                          | Code blocks / technical surfaces only.                                |

Implementation notes (Next.js / `next/font`):

```ts
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"], // latin-ext required for Turkish ğ, ü, ş, ı, ç, ö
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz"],                  // enable optical sizing
});
```

- Tailwind: `font-serif` → `["var(--font-fraunces)", "Georgia", "serif"]`.
- Always include `latin-ext` — my name (**Doğukan Ürker**) and Turkish copy
  require `ğ ü ş ı ç ö`.
- Set `fontOpticalSizing: "auto"` on serif display elements so large sizes get
  the proper high-contrast cut.

> Historical note: `globals.css` declares `Space Grotesk` for `body` and
> `@import`s Playfair Display / Instrument Serif, but the rendered body font is
> **Inter** (the `next/font` class on `<body>` wins), and the rendered serif is
> **Fraunces** (via `--font-fraunces`). For new work, standardize on
> **Fraunces + Inter** — that is what actually ships.

### 3.2 Type scale & usage

Sizes are **fluid** via `clamp()` — the brand never uses fixed breakpoint jumps
for display type.

| Element            | Family   | Size                                                          | Weight | Tracking         | Line height | Color  |
| ------------------ | -------- | ------------------------------------------------------------- | ------ | ---------------- | ----------- | ------ |
| Hero name (giant)  | Fraunces | `clamp(44px,15vw,90px)` mobile · `clamp(64px,18vw,300px)` ≥sm | ~400   | `tracking-tighter` | `0.95`    | ink    |
| About paragraph    | Fraunces | `clamp(26px,3.6vw,54px)`                                      | **340** (variable) | normal | `1.22`      | ink    |
| Emphasis in prose  | Fraunces | inherits                                                      | `600` (`font-semibold`) | — | inherits | ink    |
| De-emphasis prose  | Fraunces *italic* | inherits                                             | 340    | —                | inherits    | muted  |
| Nav name           | Inter    | `text-sm` (14px)                                              | `500` (`font-medium`) | `tracking-tight` | — | ink    |
| Nav meta / links   | Inter    | `text-sm` (14px)                                              | 400    | `tracking-wide` (links) | — | muted → ink on hover |
| Footer text/links  | Inter    | `text-sm` (14px)                                              | 400    | `tracking-wide`  | —           | muted → ink on hover |
| Mobile nav subrole | Inter    | `text-xs` (12px)                                              | 400    | `tracking-wide`  | `leading-relaxed` | muted |

Key choices to preserve:

- The **hero name is decorative and oversized**, often clipped/cropped at the
  viewport edges. It is `aria-hidden`; an `sr-only` `<h1>` carries the real
  heading for accessibility.
- The about paragraph uses an unusually **light variable weight (340)** and a
  **narrow measure** (`max-w-[23ch]`), centered. This is the "literary" feel —
  keep the measure tight and the weight light.
- Serif gets `tracking-tighter` at display sizes; sans UI text gets
  `tracking-wide` for links and `tracking-tight` for the name.

---

## 4. Voice & Copy

The words are part of the look. Match this exactly.

- **All lowercase.** Including the start of sentences and "i". The only
  capitalized text is my name (**Doğukan Ürker**) and proper nouns where
  lowercasing would read wrong.
- **First person, present tense, plain.** "i build…", "off the clock i build in
  public…".
- **Em dashes (`—`) for asides**, not parentheses or semicolons.
- **Short, declarative, slightly personal.** End on something human, e.g.
  *"coding since 12, still chasing the same feeling."*
- **No marketing adjectives, no hype, no exclamation marks.**
- Labels are single lowercase words: `about`, `resume`, `mail`, `github`,
  `twitter`, `linkedin`.

Reference hero paragraph (the canonical voice):

> i build detection systems for **deepfakes & ai-generated media** at
> sensity.ai — owning features end to end: backend, frontend, tests, deploys.
> off the clock i **build in public:** open-source tools, a local-llm homelab,
> and whatever i'm curious about. *coding since 12, still chasing the same
> feeling.*

(Bold = `font-semibold` ink; italic = muted serif; the company name = accent
link with glyph.)

---

## 5. Layout & Spacing

- **Background:** always `--brand-cream`; root `<main>` is `min-h-screen`,
  `overflow-x-hidden`, color `--brand-ink`.
- **Full-viewport sections.** Hero is `h-[100svh]`; about is
  `min-h-[80dvh] sm:min-h-dvh`. Each major section centers its content with
  flexbox.
- **Generous padding.** Page gutters `px-6` (mobile) → `px-10` (≥sm/md).
  Sections breathe with `py-24` and large vertical rhythm.
- **Centered, narrow content.** Long-form text is centered with a tight measure
  (`max-w-[23ch]` for the hero paragraph). Don't fill the width.
- **No cards/shadows/borders** as a default. Content sits on the cream field.
  Hairlines (`--brand-border`) only when a divider is truly needed.
- **Safe-area aware.** Bottom spacing respects the notch:
  `pb-[calc(3rem+env(safe-area-inset-bottom))]`.
- **Radius token** when boxes are unavoidable: `--radius: 0.5rem`.

### Navigation

- `fixed top-0`, `z-50`, full width, `flex justify-between items-center`.
- Translucent **frosted** background:
  `background: rgba(243,241,234,0.85)` + `backdrop-filter: blur(12px)`
  (with `-webkit-` prefix).
- Left: name + role meta (`full-stack engineer @ sensity.ai`).
- Right: minimal text links (`about`, `resume`).
- On mobile the role line wraps to a **second row** at `text-xs`.
- `select-none` on chrome (nav, hero, footer) so UI text isn't accidentally
  selectable.

### Footer

- Column on mobile → row at `≥sm` with `justify-between`.
- Left: location (`izmir, türkiye`). Right: social links (`mail`, `github`,
  `twitter`, `linkedin`) as a `<nav aria-label="social links">`.
- All in `--brand-muted`, `text-sm`.

---

## 6. Motion System

Motion is implemented with **Framer Motion** and is central to the brand. Two
modes: **entrance** (on mount) and **scroll-linked** (reveal on scroll).
Everything degrades to static when `prefers-reduced-motion` is set.

### 6.1 Easing & spring constants (reuse these exact values)

```ts
// expo-out cubic bezier — for clip/opacity reveals (no overshoot)
const expo = [0.16, 1, 0.3, 1];

// overdamped spring — for Y-axis entrances, natural deceleration, no bounce
const spring = { type: "spring", stiffness: 100, damping: 22 };

// scroll-smoothing spring — wrap scroll progress before mapping
const scrollSmooth = { stiffness: 100, damping: 30, restDelta: 0.001 };
```

### 6.2 Entrance orchestration (on load)

- Parent container staggers children: `staggerChildren: 0.15`,
  `delayChildren: 0.1`.
- **Nav** slides in from `y: -100` with `spring`, its own
  `staggerChildren: 0.1`; nav links fade opacity over `0.9s` `expo`.
- **Portrait** reveals via clip-path wipe (bottom→top):
  `clipPath: inset(100% 0 0 0) → inset(0 0 0 0)`, `duration: 1.4`, `expo`.
- **Hero name** rises into a mask: `y: 108%` (desktop) / `250%` (mobile) `→ 0%`
  with `spring`; the wrapper uses a wide clip
  `inset(-30px -600px -40px -600px)` revealed over `duration: 1.6`, `expo`.

### 6.3 Scroll-linked reveals

- **Hero parallax:** as the hero scrolls away, the name translates `y: 0 → 200`
  and fades `opacity: 1 → 0.4`, both passed through `useSpring(scrollSmooth)`.
- **Text reveal (signature effect):** the about paragraph reveals **word by
  word**. Each word's `opacity` animates `0.12 → 1`, staggered across the first
  `0.8` of the section's scroll progress with a `0.2`-wide window per word.
  Scroll offset `["start 0.9", "start 0.25"]`, smoothed with a spring. Low-but-
  visible resting opacity (`0.12`) means upcoming words are ghosted, not hidden.
- **Footer:** each item fades `opacity 0 → 1` and lifts `y: 16 → 0`, staggered
  by start thresholds (`0`, `0.05`, `0.1`, `0.15`, `0.2`) across the footer's
  scroll progress (`offset ["start end", "end end"]`).

### 6.4 Reduced motion (mandatory)

- Respect `useReducedMotion()` everywhere. When set: render the final/visible
  state immediately, no transforms, no scroll-driven opacity. The custom cursor
  is disabled entirely.

---

## 7. The Signature Cursor

A bespoke cursor is part of the identity. Replicate it on interactive,
pointer-fine surfaces.

- **Shape:** a `9×9px` dot, `--brand-ink`, fully rounded, `z-[999]`,
  `pointer-events-none`, `position: fixed`.
- **Blend:** `mix-blend-difference` — so it inverts against whatever it's over
  (dot on cream, light over ink).
- **Follow:** position driven by a spring `{ stiffness: 750, damping: 44,
  mass: 0.4 }` for a smooth, slightly-trailing chase.
- **Velocity reactivity:** grows up to `4×` when the pointer moves fast
  (threshold `1500px/s`, max at `5000px/s`), decaying back at `~8%/frame`. Fast
  flicks make it stretch/scale; it only grows from speed, never jump-shrinks.
- **Context variants (via `data-cursor` attribute on targets):**
  - `link` → scales to ~`5.1×` (`46/9`)
  - `photo` → scales to ~`7.8×` (`70/9`)
  - default → `1×`
  - variant scaling uses a spring `{ stiffness: 550, damping: 30 }`.
- **Activation gating:** only when `(pointer: fine)` **and** not
  `prefers-reduced-motion`. When active it injects `* { cursor: none !important }`
  and the page root gets `cursor-none`; otherwise the native cursor is used and
  the component renders nothing.

Tag interactive elements with `data-cursor="link"` (links/buttons) or
`data-cursor="photo"` (imagery) so the cursor responds.

---

## 8. Interaction Patterns

### Underline link (the standard link)

- `text-sm tracking-wide`, color `--brand-muted` → `--brand-ink` on hover
  (`transition-colors duration-200`).
- Animated underline: a `1px` bar pinned at the baseline that grows
  `width: 0 → 100%`, **left to right**, `duration-300 ease-out`, on hover **and**
  focus-visible.
- Focus ring: `focus-visible:ring-2 ring-[--brand-ink] ring-offset-2`,
  `rounded-sm`, outline none. Always keyboard-accessible.
- Works as `<a>`, `<button>` (onClick), Next `<Link>`, or hash link. External
  links get `target="_blank" rel="noopener noreferrer"`.
- Carries `data-cursor="link"`.

### Primary brand link (accent + glyph)

- The `sensity.ai` link is the one accent moment: ink → `#373CE0` on hover,
  `font-semibold`, preceded by a small inline SVG glyph (`0.75em`), `gap-[0.15em]`.

### Imagery / portrait

- Photos are **grayscale at rest**, transitioning to full color on hover
  (`grayscale → grayscale-0`) plus a subtle zoom (`scale-[1.04]`),
  `duration-700`. Tagged `data-cursor="photo"`.
- Use `next/image` with `fill`, `object-cover`, and a `sizes` hint; mark the
  hero image `priority`.

### Scrolling

- `html { scroll-behavior: smooth; scroll-padding-top: 4rem }`.
- In-page nav (e.g. "about") scrolls smoothly to a target, choosing a different
  anchor id for mobile vs desktop when layouts differ.
- Scrollbars are hidden (`::-webkit-scrollbar { width: 0 }`).

---

## 9. Accessibility

Non-negotiable, baked into the brand:

- Decorative oversized type is `aria-hidden`; real headings live in `sr-only`
  elements so screen readers and SEO get clean structure.
- Every interactive element has a visible `focus-visible` ring
  (`ring-[--brand-ink] ring-offset-2`).
- `prefers-reduced-motion` fully respected: static fallbacks, no parallax, no
  custom cursor.
- Landmark roles/labels: `<nav aria-label="primary navigation">`,
  `<nav aria-label="social links">`.
- Color contrast stays within the ink/muted ramp on cream (AA for body text).
- Custom cursor never replaces native affordances on touch or reduced-motion.

---

## 10. Responsive Rules

- **Fluid type via `clamp()`** rather than discrete breakpoint sizes for display
  elements.
- Primary breakpoint is Tailwind `sm` (640px); `md` (768px) used for nav padding
  and the inline role line.
- Mobile: nav role wraps to a second row; hero name uses the smaller clamp and a
  larger mask offset (`250%`); sections use `dvh`/`svh` units for correct mobile
  viewport height.
- Always `overflow-x-hidden` at the root — the oversized name intentionally
  overflows horizontally and must not cause scroll.

---

## 11. Quick-Reference Cheat Sheet

```
BACKGROUND   #f3f1ea (cream)          never #fff
TEXT         #16140d (ink)            never #000
SECONDARY    #5c5a52 (muted)
TERTIARY     #8a877e (dim)
BORDER       #dcd8cd (hairline)
ACCENT       #373CE0 (electric blue — one use only)

DISPLAY FONT Fraunces (serif, opsz, italic), fontOpticalSizing:auto, latin-ext
BODY FONT    Inter (sans)             mono: Geist Mono (code only)

DISPLAY SIZE clamp() fluid, tracking-tighter, line-height 0.95
BODY PROSE   Fraunces 340 weight, line-height 1.22, max-w-23ch, centered
UI TEXT      Inter text-sm, tracking-wide links / tracking-tight name

EASING       expo  = cubic-bezier(0.16, 1, 0.3, 1)
SPRING       entrance: stiffness100 damping22 (no bounce)
             scroll:   stiffness100 damping30 restDelta0.001
             cursor:   stiffness750 damping44 mass0.4

CURSOR       9px ink dot, mix-blend-difference, velocity-scaled to 4x,
             link→5.1x photo→7.8x via data-cursor; pointer-fine only

LINKS        muted→ink, underline grows 0→100% L→R, focus ring ink offset-2
IMAGES       grayscale→color + scale 1.04 on hover, duration-700
COPY         all lowercase, first person, em dashes, no hype

ALWAYS       respect prefers-reduced-motion · sr-only real headings ·
             cream bg everywhere · one accent · silence over clutter
```

---

*Identity owner: Doğukan Ürker · izmir, türkiye · full-stack engineer.*
