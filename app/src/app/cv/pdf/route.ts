import { NextRequest } from "next/server";
import { fetchRepoStats } from "@/lib/cv";
import { registerCvFonts, renderCvPdf } from "@/components/CvDocument";

// needs the node runtime for @react-pdf/renderer (fontkit, buffers).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // resolve the deployment origin so @react-pdf can fetch the bundled fonts
  // from /public/fonts (works in dev, self-hosted, and serverless alike).
  const url = new URL(req.url);
  const host =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
  const proto =
    req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const origin = `${proto}://${host}`;

  registerCvFonts(origin);

  const token =
    process.env.GITHUB_API_KEY ?? process.env.NEXT_PUBLIC_GITHUB_API_KEY;
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
