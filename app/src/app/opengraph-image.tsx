import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// ── Next.js file-based OG image metadata ──────────────────────────────────
export const alt = "Doğukan Ürker | Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ── Design tokens ─────────────────────────────────────────────────────────
const CREAM = "#f3f1ea";
const INK = "#16140d";
const MUTED = "#5c5a52";
const DIM = "#8a877e";

const FIRST = "Doğukan";
const LAST = "Ürker";
const NAME = `${FIRST} ${LAST}`;
const ROLE = "full-stack engineer @ sensity.ai";
const LOCATION = "izmir, türkiye";

// Square portrait size (px). The photo is rendered as a square (no crop) to
// match the landing hero — never a tall full-bleed strip.
const PHOTO_SIZE = 430;

// ── Helpers ───────────────────────────────────────────────────────────────

// Fetch a glyph-subset of upright Fraunces from Google Fonts. The `text`
// param keeps the download tiny. Falls back to Georgia on error.
async function loadFraunces(): Promise<ArrayBuffer | null> {
  const subset = [NAME, ROLE, LOCATION].join(" ");
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500&display=block&text=${encodeURIComponent(subset)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (!fontUrl) return null;
    return fetch(fontUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

// Read the portrait from /public and return a data-URI. Returns null
// gracefully if the file doesn't exist yet (image still renders, text-only).
async function loadPhoto(): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "me.webp"));
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// ── Image ─────────────────────────────────────────────────────────────────
export default async function Image() {
  const [frauncesData, photoSrc] = await Promise.all([
    loadFraunces(),
    loadPhoto(),
  ]);

  const serifStack = frauncesData ? "Fraunces" : "Georgia, serif";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: CREAM,
      }}
    >
      {/* ── Left: stacked name + role + location ──────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          padding: "0 64px 0 88px",
        }}
      >
        {/* name — upright Fraunces, intentionally stacked on two lines to
              echo the landing hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 36,
          }}
        >
          <span
            style={{
              fontFamily: serifStack,
              fontWeight: 500,
              fontSize: 122,
              color: INK,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
            }}
          >
            {FIRST}
          </span>
          <span
            style={{
              fontFamily: serifStack,
              fontWeight: 500,
              fontSize: 122,
              color: INK,
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
            }}
          >
            {LAST}
          </span>
        </div>

        {/* role + location */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 24, color: MUTED }}>{ROLE}</span>
          <span style={{ fontSize: 18, color: DIM, letterSpacing: "0.04em" }}>
            {LOCATION}
          </span>
        </div>
      </div>

      {/* ── Right: square grayscale portrait ──────────────────────────── */}
      {photoSrc && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            paddingRight: 88,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoSrc}
            alt=""
            width={PHOTO_SIZE}
            height={PHOTO_SIZE}
            style={{
              width: PHOTO_SIZE,
              height: PHOTO_SIZE,
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              flexShrink: 0,
              filter: "grayscale(100%)",
            }}
          />
        </div>
      )}
    </div>,
    {
      ...size,
      fonts: frauncesData
        ? [
            {
              name: "Fraunces",
              data: frauncesData,
              style: "normal",
              weight: 500,
            },
          ]
        : [],
    },
  );
}
