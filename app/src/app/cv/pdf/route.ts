import { registerCvFonts, renderCvPdf } from "@/components/CvDocument";
import { fetchRepoStats } from "@/lib/cv";

// needs the node runtime for @react-pdf/renderer (fontkit, fs, buffers).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // fonts are read from disk, so no origin/self-fetch is needed.
  registerCvFonts();

  const token = process.env.GITHUB_API_KEY;
  const stats = await fetchRepoStats(token);

  const pdf = await renderCvPdf(stats);

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="dogukan-urker-cv.pdf"',
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
