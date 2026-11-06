"use client";

import { type Brand, brands } from "@/components/brand";

// nav company link: ink at rest, company color on hover, no underline.
// compact = logo only (mobile), padded so the tap area is about 24px.
function NavBrandLink({ brand, compact }: { brand: Brand; compact: boolean }) {
  const { name, href, hoverClass, Glyph } = brands[brand];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={compact ? name : undefined}
      className={
        "inline-flex items-center gap-[0.35em] tracking-wide text-[var(--brand-ink)] " +
        "transition-colors duration-300 rounded-sm focus-visible:outline-none " +
        "focus-visible:ring-2 focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2 " +
        `${hoverClass} ${compact ? "p-1.5 -my-1.5 -mx-0.5" : ""}`
      }
    >
      <Glyph className={compact ? "h-[13px] w-auto" : "h-[0.85em] w-auto"} />
      {!compact && <span>{name}</span>}
    </a>
  );
}

// nav role line. desktop: "engineer at [logo] sensity-ai".
// compact (mobile): "engineer [logo]", logo only.
export function RoleLine({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <span>{compact ? "engineer" : "engineer at"}</span>
      <NavBrandLink brand="sensity" compact={compact} />
    </>
  );
}
