import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// ── Next.js file-based OG image metadata ──────────────────────────────────
export const alt = "Doğukan Ürker | Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ── Design tokens — keep in sync with --brand-* CSS vars in globals.css ───
const WHITE = "#ffffff";
const INK = "#16140d";
const MUTED = "#5c5a52";
const DIM = "#8a877e";

// ── Copy — update here when the landing page copy changes ─────────────────
const NAME = "Doğukan Ürker";
const ROLE = "full-stack engineer @ sensity.ai";
const LOCATION = "izmir, türkiye";

// Photo column width (px). Adjust to taste.
const PHOTO_WIDTH = 440;

// ── Helpers ───────────────────────────────────────────────────────────────

// Fetch a glyph-subset of Fraunces Italic from Google Fonts.
// The `text` param keeps the download small. Falls back to Georgia on error.
async function loadFraunces(): Promise<ArrayBuffer | null> {
  const subset = [NAME, ROLE, LOCATION].join(" ");
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,400&display=block&text=${encodeURIComponent(subset)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());
    const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
    if (!fontUrl) return null;
    return fetch(fontUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

// Read the portrait from the public folder and return a data-URI.
// Returns null gracefully if the file doesn't exist yet.
async function loadPhoto(): Promise<string | null> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "dogukan.jpg"));
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
        backgroundColor: WHITE,
      }}
    >
      {/* ── Left: name + role + location ──────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          flex: 1,
          padding: "72px 64px 72px 80px",
        }}
      >
        <span
          style={{
            fontFamily: serifStack,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 128,
            color: INK,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          {NAME}
        </span>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 22, color: MUTED }}>{ROLE}</span>
          <span style={{ fontSize: 17, color: DIM, letterSpacing: "0.04em" }}>
            {LOCATION}
          </span>
        </div>
      </div>

      {/* ── Right: portrait photo ─────────────────────────────────────── */}
      {photoSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoSrc}
          alt=""
          style={{
            width: PHOTO_WIDTH,
            height: 630,
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            flexShrink: 0,
            filter: "grayscale(100%)",
          }}
        />
      )}
    </div>,
    {
      ...size,
      fonts: frauncesData
        ? [
            {
              name: "Fraunces",
              data: frauncesData,
              style: "italic",
              weight: 400,
            },
          ]
        : [],
    },
  );
}
