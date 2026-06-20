import { fetchRepos } from "@/lib/fetchRepos";
import { ProjectsClient } from "./projects-client";

export default async function Projects() {
  const repos = await fetchRepos(
    "dogukanurker",
    process.env.GITHUB_API_KEY ?? "",
  );

  return <ProjectsClient repos={repos} />;
}
