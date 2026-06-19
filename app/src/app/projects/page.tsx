import { fetchRepos } from "@/lib/fetchRepos";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitFork, Star } from "lucide-react";
import Link from "next/link";

export default async function Projects() {
  const repos = await fetchRepos(
    "dogukanurker",
    process.env.GITHUB_API_KEY ?? "",
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <Card
            key={repo.id}
            className="group animate-in fade-in-50 duration-1000 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {repo.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 h-12">
                {repo.description || "No description available"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <GitFork className="h-4 w-4" />
                  {repo.forks}
                </Badge>
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Star className="h-4 w-4" />
                  {repo.stargazers_count}
                </Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                asChild
              >
                <Link
                  href={`/${repo.name}`}
                  className="flex items-center justify-between"
                >
                  View Project
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
