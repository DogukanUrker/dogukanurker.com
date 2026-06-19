import { fetchRepoStats } from "@/lib/cv";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const stats = await fetchRepoStats(process.env.GITHUB_API_KEY);
  return Response.json(stats);
}
