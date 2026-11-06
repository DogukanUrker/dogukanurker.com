"use client";

import { motion, type useAnimate } from "framer-motion";
import { sensityLogo } from "@/lib/logos";

// shared brand pieces: the company and x logos, plus the company link config
// (name, link, hover color, logo pulse). used by the landing page and by the
// nav role line on every page.

// cubic bezier typed as a tuple - required by framer-motion's Easing type
const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export type Brand = "sensity";

export type ScopedAnimate = ReturnType<typeof useAnimate>[1];

export type LogoPulse = (animate: ScopedAnimate) => Promise<unknown>;

// one pulse: rest -> peak at 35% -> rest, expo on each half.
const logoPulse = { duration: 0.9, times: [0, 0.35, 1], ease: [expo, expo] };

interface GlyphProps {
  // size and position, e.g. "h-[0.75em] w-auto". width follows the viewBox.
  className: string;
}

type GlyphComponent = (props: GlyphProps) => React.JSX.Element;

// two corner brackets around a center square. the brackets move on hover.
function SensityGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox={sensityLogo.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`inline-block overflow-visible ${className}`}
    >
      <path d={sensityLogo.core} fill="currentColor" />
      <motion.path
        data-part="top-left"
        d={sensityLogo.topLeft}
        fill="currentColor"
      />
      <motion.path
        data-part="bottom-right"
        d={sensityLogo.bottomRight}
        fill="currentColor"
      />
    </svg>
  );
}

// the thin gap inside the x's thick stroke, as a fill shape. all keyframes
// use the same commands so framer-motion can tween between them. the fill
// grows from the top, then drains from the top: "empty top" has its bottom
// edge pinned to the top, "full" covers the whole gap, "empty bottom" has its
// top edge pinned to the bottom. both empty shapes are invisible.
const xGapEmptyTop = "M5.117 4.126L7.084 4.126L7.084 4.126L5.117 4.126Z";
const xGapFull = "M5.117 4.126L7.084 4.126L18.916 19.77L17.083 19.77Z";
const xGapEmptyBottom = "M17.083 19.77L18.916 19.77L18.916 19.77L17.083 19.77Z";

// the x (twitter) logo. path copied from the svg x.com itself serves, with
// the viewBox cropped to the drawing so the height is the real logo height.
export function XGlyph({ className }: GlyphProps) {
  return (
    <svg
      viewBox="1.254 2.25 21.573 19.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`inline-block ${className}`}
    >
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
      <motion.path data-part="x-gap" d={xGapEmptyTop} fill="currentColor" />
    </svg>
  );
}

interface BrandConfig {
  name: string;
  href: string;
  // literal class strings so tailwind can see them.
  hoverClass: string;
  // logo-to-name gap in the paragraph.
  paragraphGap: string;
  Glyph: GlyphComponent;
  pulse: LogoPulse;
}

export const brands: Record<Brand, BrandConfig> = {
  sensity: {
    name: "sensity-ai",
    href: "https://sensity.ai",
    hoverClass: "hover:text-[#373CE0]",
    paragraphGap: "gap-[0.15em]",
    Glyph: SensityGlyph,
    // focus lock: the brackets jump out and snap back onto the square.
    pulse: (animate) =>
      Promise.all([
        animate(
          "[data-part='top-left']",
          { x: [0, -12, 0], y: [0, -12, 0] },
          logoPulse,
        ),
        animate(
          "[data-part='bottom-right']",
          { x: [0, 12, 0], y: [0, 12, 0] },
          logoPulse,
        ),
      ]),
  },
};

// the gap inside the x fills top to bottom, then drains top to bottom.
export const xPulse: LogoPulse = async (animate) => {
  await animate(
    "[data-part='x-gap']",
    { d: [xGapEmptyTop, xGapFull, xGapEmptyBottom] },
    logoPulse,
  );
};
