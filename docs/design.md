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
3. **Monochrome, with one brand-colored link.** Photography is grayscale by
   default. Color is rationed: it appears only as the hover color of the
   sensity link, in sensity's own blue (`#373CE0`).
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
never hardcode hexes (except the link hover colors below, which are
intentionally one-offs).

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

### Company colors

| Link         | Hover color | Source                                   |
| ------------ | ----------- | ---------------------------------------- |
| `sensity-ai` | `#373CE0`   | sensity's electric blue                  |

- color is **scarce by design**. it appears only as the hover color of the
  company link in the about paragraph and in the nav. each company link also
  carries its logo glyph.
- this hex is hardcoded on purpose (a literal tailwind class in the `brands`
  config in `src/components/brand.tsx`), not a css variable.
- the x logo link stays ink, also on hover, which matches x's own rule that its
  logo is only black or white. its gap-fill animation is the hover feedback.
- do not introduce other accent colors. if a new surface ever needs a state
  color, keep it muted and earthy, never neon.

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

| Role                | Family                                                | Notes                                                                                                              |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Display / Serif** | **Fraunces** (variable, `opsz` axis, normal + italic) | The signature. Used for the giant name and the about paragraph. Optical sizing **on**. Fallback: `Georgia, serif`. |
| **UI / Sans**       | **Inter**                                             | Everything that isn't display serif: nav name, role line, links, footer. Fallback: `Arial, Helvetica, sans-serif`. |

Two families, nothing more. Fraunces is the voice; Inter is the quiet
functional label.

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
- Inter is applied once at the app root (on `<body>`); the landing page never
  re-declares a sans — non-serif text simply inherits it.

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
| Nav company links  | Inter    | inherits (`text-sm` desktop)                                  | 400    | `tracking-wide`  | -           | ink → company color on hover |
| Footer text/links  | Inter    | `text-sm` (14px)                                              | 400    | `tracking-wide`  | —           | muted → ink on hover |
| Mobile nav subrole | Inter    | `text-xs` (12px)                                              | 400    | `tracking-wide`  | `leading-relaxed` | muted |

Key choices to preserve:

- The **hero name is decorative and oversized**, often clipped/cropped at the
  viewport edges. It is `aria-hidden`; an `sr-only` `<h1>` carries the real
  heading for accessibility.
- The about paragraph uses an unusually **light variable weight (340)** and a
  **narrow measure** (`max-w-[26ch]`), centered. This is the "literary" feel —
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

> i build detection for **ai-generated media** at sensity-ai and take it
> from idea to shipped. off the clock [x logo] is where i **build in public.**
> *coding since 12, still chasing the same feeling.*

**a logo link is always followed by a word, never by punctuation.** a "," or
"." right after a logo looks messy, so write the sentence around it (e.g.
"sensity-ai and take it", "[x] is where").

(bold = `font-semibold` ink; italic = muted serif; company names = links with
their logo glyph and brand hover color.)

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
  (`max-w-[26ch]` for the hero paragraph). Don't fill the width.
- **No lonely last word.** the about paragraph uses `text-pretty`
  (`text-wrap: pretty`), so the browser never leaves one word alone on the
  last line. browsers without support just ignore it.
- the measure is `26ch` (it was `24ch`) so the closing sentence ends on
  "chasing the same feeling." on tablet and desktop. on phones the screen is
  the limit, so "chasing the same feeling." is one word token that never
  splits. if the copy changes, re-check the last line at phone and desktop
  widths.
- **No cards/shadows/borders** as a default. Content sits on the cream field.
  Hairlines (`--brand-border`) only when a divider is truly needed.
- **Safe-area aware.** Bottom spacing respects the notch:
  `pb-[calc(3rem+env(safe-area-inset-bottom))]`.

### Navigation

- `fixed top-0`, `z-50`, full width, `flex justify-between items-center`.
- Translucent **frosted** background:
  `background: rgba(243,241,234,0.85)` + `backdrop-filter: blur(12px)`
  (with `-webkit-` prefix).
- Left: name + role meta. desktop: `engineer at [logo] sensity-ai`. mobile:
  `engineer [logo]`, logo only (the link has an `aria-label` with the company
  name, and padding for a ~24px tap area).
- company links in the nav: ink at rest → company color on hover, no
  underline. logos are `0.85em` tall on desktop, `13px` on mobile. no logo
  pulse in the nav: at this size the motion would be under 1px.
- the role line is one shared component, `RoleLine` in
  `src/components/RoleLine.tsx` (`<RoleLine />` on desktop,
  `<RoleLine compact />` on mobile). every page's nav uses it, so a change
  there updates the whole site.
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
- italic words in any word-by-word reveal get the `italic-room` class
  (`globals.css`): extra side padding canceled by a negative margin. without
  it safari clips italic letters that lean past their box (the top of "l").
- **Footer:** each item fades `opacity 0 → 1` and lifts `y: 16 → 0`, staggered
  by start thresholds (`0`, `0.05`, `0.1`, `0.15`, `0.2`) across the footer's
  scroll progress (`offset ["start end", "end end"]`).

### 6.4 Reduced motion (mandatory)

- Respect `useReducedMotion()` everywhere. When set: render the final/visible
  state immediately, no transforms, no scroll-driven opacity. The custom cursor
  is disabled entirely.

### 6.5 Company logo pulse (hover)

- hovering or keyboard-focusing a company link plays a one-shot pulse of its
  logo: `duration: 0.9`, rest → peak → rest with the peak at `35%`
  (`times: [0, 0.35, 1]`), `expo` on each half.
  - **sensity-ai (focus lock):** the two corner brackets move out diagonally by
    `12` logo units (the logo is `200` wide) and snap back onto the center
    square.
  - **x (gap fill):** a fill shape inside the logo's thin gap animates its
    path `d` from empty (pinned to the top) → full → empty (pinned to the
    bottom), so the gap fills top to bottom, then drains top to bottom. all
    paths use the same commands so they tween.
- both share one hook (`useLogoPulse`) for the play-once logic.
- the pulse always plays to the end. leaving early does not cut it, and new
  hovers are ignored while it runs, so the logo never snaps back mid-pulse.
  it is started with `useAnimate`, not `whileHover`, because `whileHover`
  reverses as soon as the pointer leaves.
- skipped when `prefers-reduced-motion` is set. the hover color still applies.

---

## 7. The Signature Cursor

A bespoke cursor is part of the identity. Replicate it on interactive,
pointer-fine surfaces.

- **Shape:** a `9×9px` dot, `--brand-ink`, fully rounded, `z-[999]`,
  `pointer-events-none`, `position: fixed`.
- **Drawn big, scaled down:** the dot is drawn at `80px` and scaled to
  `9/80` at rest (`46/80` on links, `70/80` on photos). safari stretches a
  scaled-up layer like a picture, so growing a real 9px dot looked blurry
  there. scaling a big dot down stays sharp in every browser.
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

### Roll link (the standard link)

- one shared component, `RollLink` in `src/components/RollLink.tsx`, used for
  every regular text link (nav, footer, cv, projects, donate). styles live in
  `globals.css` under "roll link".
- `text-sm tracking-wide`, color `--brand-muted` → `--brand-ink` on hover
  (`200ms`). `tone="ink"` keeps it ink, for titles in lists.
- **letter roll:** each letter is a small window with two copies stacked. one
  roll slides both up one line (`translateY(-100%)`, `500ms` expo), staggered
  `22ms` per letter, so the word rolls left to right into a fresh copy of
  itself.
- **hover intent + play once:** the roll starts only after the pointer rests
  `70ms` on the link (keyboard focus starts it right away), so a fast sweep
  across links does nothing. once started it always finishes, even if the
  pointer leaves, and it never rolls back: the rolled-in copy looks the same
  as the original, so `RollLink` just drops `.is-rolling` at the end and the
  reset is invisible. the timing lives in both `RollLink.tsx` and the
  `roll-up` keyframes in `globals.css`; keep them in sync.
- only plain text can roll; other children render as is. the letters are
  `aria-hidden` and the link carries `aria-label` with the word, so screen
  readers read it once.
- **spotlight:** inside a `.roll-group` (each nav, footer and contact list),
  hovering one link fades the others to `opacity: 0.65` over `600ms` with a
  soft ease-out and a `90ms` delay, so a quick sweep never flickers.
- reduced motion: no roll, the color change and spotlight stay.
- Focus ring: `focus-visible:ring-2 ring-[--brand-ink] ring-offset-2`,
  `rounded-sm`, outline none. Always keyboard-accessible.
- Works as `<a>`, `<button>` (onClick), Next `<Link>`, or hash link. External
  links get `target="_blank" rel="noopener noreferrer"`.
- Carries `data-cursor="link"`.

### Company links (glyph + brand color + logo pulse)

- `sensity-ai` in the about paragraph: ink → company color on hover
  (`#373CE0`), `font-semibold`, preceded by the company's inline SVG glyph
  (`0.75em` tall, `gap-[0.15em]`).
- the logos and the company config (name, link, hover color, pulse) live in
  `src/components/brand.tsx`. the same glyph components are used in the nav
  (see Navigation), sized by a `className` prop.
- copy rule: the link is always followed by a word, never punctuation (see
  section 4).
- on hover or focus the logo plays its pulse (see 6.5).

### X link in prose

- the x (twitter) link in the about paragraph is the x logo alone ("on [x]."
  reads as "on x."). the username is not shown on purpose.
- the original x logo, path copied from the svg x.com itself serves, with the
  viewBox cropped to the drawing (`1.254 2.25 21.573 19.5`). `0.7em` tall and
  sitting on the baseline like a capital letter, so it matches the tall
  letters and the company logos.
- ink, no color change and no underline. on hover or focus the thin gap
  inside the logo fills top to bottom, then drains top to bottom (see 6.5).
- `aria-label="x (twitter)"`, `data-cursor="link"`. like the company links,
  it is always followed by a word ("[x] is where i build in public").

### Share image + link text

- the share image (`src/app/opengraph-image.tsx`, 1200×630) mirrors the
  brand: stacked fraunces name, role line, location, square grayscale photo.
- its role line is drawn like the nav: `engineer at [logo] sensity-ai`,
  "engineer at" in muted, the company in ink with its logo.
  logo path data comes from `src/lib/logos.ts`, because the image is rendered
  on the server and can't use the client glyph components.
- the text that search engines and link previews read (titles, descriptions,
  image alt text) uses the real company name, **Sensity AI**, so searches
  for it match. the visible site keeps the `sensity-ai` style.

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
LINK COLOR   #373CE0 sensity (hover only)

DISPLAY FONT Fraunces (serif, opsz, italic), fontOpticalSizing:auto, latin-ext
UI FONT      Inter (sans)

DISPLAY SIZE clamp() fluid, tracking-tighter, line-height 0.95
BODY PROSE   Fraunces 340 weight, line-height 1.22, max-w-26ch, centered,
             text-pretty
UI TEXT      Inter text-sm, tracking-wide links / tracking-tight name

EASING       expo  = cubic-bezier(0.16, 1, 0.3, 1)
SPRING       entrance: stiffness100 damping22 (no bounce)
             scroll:   stiffness100 damping30 restDelta0.001
             cursor:   stiffness750 damping44 mass0.4

CURSOR       9px ink dot, mix-blend-difference, velocity-scaled to 4x,
             link→5.1x photo→7.8x via data-cursor; pointer-fine only

LOGO PULSE   0.9s, peak at 35%, expo; brackets ±12 / beams scaleX 1.35 /
             x gap fills + drains downward, one-shot on hover/focus, always
             plays to the end

LINKS        muted→ink + letter roll (RollLink), soft spotlight in groups,
             focus ring ink offset-2
IMAGES       grayscale→color + scale 1.04 on hover, duration-700
COPY         all lowercase, first person, em dashes, no hype

ALWAYS       respect prefers-reduced-motion · sr-only real headings ·
             cream bg everywhere · color only on link hovers ·
             silence over clutter
```

---

*Identity owner: Doğukan Ürker · izmir, türkiye · engineer.*
