// Dev-preview page — renders the live opengraph-image.tsx output so you can
// inspect the OG image at /ogImage without leaving the browser.
// This page itself is never indexed or shared; it just mirrors /opengraph-image.
export default function OGImagePreview() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6 p-8">
      <p className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
        opengraph-image preview · 1200 × 630
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/opengraph-image"
        alt="OG image preview"
        width={1200}
        height={630}
        style={{ maxWidth: "100%", height: "auto", display: "block" }}
      />

      <p className="text-zinc-600 text-xs font-mono">
        source → app/src/app/opengraph-image.tsx
      </p>
    </div>
  );
}
