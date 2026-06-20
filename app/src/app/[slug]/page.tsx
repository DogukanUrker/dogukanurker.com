import { notFound } from "next/navigation";
import {
  fetchContributors,
  fetchLanguages,
  fetchRepos,
} from "@/lib/fetchRepos";
import { ProjectDetailsClient } from "./project-details";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const token = process.env.GITHUB_API_KEY ?? "";
    const data = await fetchRepos("dogukanurker", token);
    return data.map((r) => ({
      slug: r.name,
    }));
  } catch (error) {
    console.error("Error generating static params for repos:", error);
    return [];
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  let currentRepo = null;
  let languagesData = null;
  let contributorsData = null;

  try {
    const token = process.env.GITHUB_API_KEY ?? "";
    const data = await fetchRepos("dogukanurker", token);
    currentRepo =
      data.find((r) => r.name.toLowerCase() === slug.toLowerCase()) ?? null;

    if (currentRepo) {
      [languagesData, contributorsData] = await Promise.all([
        fetchLanguages(currentRepo.languages_url, token),
        fetchContributors(currentRepo.contributors_url, token),
      ]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  if (!currentRepo || !languagesData || !contributorsData) {
    notFound();
  }

  return (
    <ProjectDetailsClient
      repo={currentRepo}
      languages={languagesData}
      contributors={contributorsData}
    />
  );
}
