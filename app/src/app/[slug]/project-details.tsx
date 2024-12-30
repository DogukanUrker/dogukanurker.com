"use client";
import React from "react";
import {useRouter} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader,} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArrowLeft, Calendar, Code2, ExternalLink, GitFork, Heart, Star, Users,} from "lucide-react";
import {motion} from "framer-motion";
import type {Contributor, Repo} from "@/lib/fetchRepos";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip";
import {Progress} from "@/components/ui/progress";
import {HoverCard, HoverCardContent, HoverCardTrigger,} from "@/components/ui/hover-card";

interface ProjectDetailsClientProps {
    repo: Repo;
    languages: Record<string, number>;
    contributors: Contributor[];
}

const fadeIn = {
    initial: {opacity: 0, y: 20},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.5},
};

const staggerChildren = {
    animate: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export function ProjectDetailsClient({
                                         repo,
                                         languages,
                                         contributors,
                                     }: ProjectDetailsClientProps) {
    const router = useRouter();
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    const lastUpdated = new Date(repo.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8 select-none">
            <motion.div className="flex flex-col gap-4" {...fadeIn}>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={() => router.push("/projects")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4"/>
                            Back to Projects
                        </Button>
                        <Button
                            onClick={() => router.push("/donate")}
                            variant="default"
                            className="flex items-center gap-2"
                        >
                            <Heart className="h-4 w-4"/>
                            Donate
                        </Button>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        {repo.name}
                    </h1>
                </div>
            </motion.div>

            <motion.div {...fadeIn} transition={{duration: 0.5, delay: 0.2}}>
                <Card className="overflow-hidden">
                    <CardHeader className="space-y-4">
                        <div className="flex justify-between items-start">
                            <CardDescription className="text-base md:text-lg">
                                {repo.description}
                            </CardDescription>
                            {repo.license && (
                                <Badge
                                    variant="secondary"
                                    className="text-sm ml-4 hover:scale-110 transition-transform cursor-pointer"
                                    onClick={() =>
                                        window.open(
                                            `${repo.html_url}/blob/main/LICENSE`,
                                            "_blank"
                                        )
                                    }
                                >
                                    {repo.license.spdx_id}
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" asChild>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    View on GitHub
                                    <ExternalLink className="h-4 w-4"/>
                                </a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 gap-4"
                            variants={staggerChildren}
                        >
                            <Card
                                className="p-3 md:p-4 hover:scale-[1.02] transition-transform cursor-pointer"
                                onClick={() =>
                                    window.open(`${repo.html_url}/stargazers`, "_blank")
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground"/>
                                    <div className="font-semibold">{repo.stargazers_count}</div>
                                    <div className="text-muted-foreground text-sm">Stars</div>
                                </div>
                            </Card>
                            <Card
                                className="p-3 md:p-4 hover:scale-[1.02] transition-transform cursor-pointer"
                                onClick={() => window.open(`${repo.html_url}/forks`, "_blank")}
                            >
                                <div className="flex items-center gap-2">
                                    <GitFork className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground"/>
                                    <div className="font-semibold">{repo.forks}</div>
                                    <div className="text-muted-foreground text-sm">Forks</div>
                                </div>
                            </Card>
                            <Card
                                className="p-3 md:p-4 col-span-2 md:col-span-1 hover:scale-[1.02] transition-transform cursor-pointer"
                                onClick={() =>
                                    window.open(`${repo.html_url}/commits`, "_blank")
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground"/>
                                    <div className="text-sm text-muted-foreground truncate">
                                        Updated: {lastUpdated}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {contributors.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5"/>
                                    <h3 className="font-semibold text-lg">Contributors</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {contributors.map((contributor) => (
                                        <motion.div
                                            key={contributor.login}
                                            className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:scale-110 transition-transform cursor-pointer"
                                            onClick={() =>
                                                window.open(
                                                    `${repo.html_url}/commits?author=${contributor.login}`,
                                                    "_blank"
                                                )
                                            }
                                            whileHover={{scale: 1.02}}
                                            initial={{opacity: 0, y: 20}}
                                            animate={{opacity: 1, y: 0}}
                                        >
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Avatar
                                                            className="cursor-pointer h-8 w-8 md:h-10 md:w-10"
                                                            onClick={() =>
                                                                window.open(contributor.html_url, "_blank")
                                                            }
                                                        >
                                                            <AvatarImage
                                                                src={contributor.avatar_url}
                                                                alt={contributor.login}
                                                            />
                                                            <AvatarFallback>
                                                                {contributor.login[0]}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {contributor.login}
                                                        <br/>
                                                        {contributor.contributions} contributions
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                            <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate">
                          {contributor.login}
                        </span>
                                                <span className="text-sm text-muted-foreground">
                          {contributor.contributions} commits
                        </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Code2 className="h-5 w-5"/>
                                <h3 className="font-semibold text-lg">Languages</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(languages)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([lang, bytes]) => {
                                        const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                                        return (
                                            <motion.div
                                                key={lang}
                                                initial={{opacity: 0, y: 20}}
                                                animate={{opacity: 1, y: 0}}
                                                whileHover={{scale: 1.02}}
                                            >
                                                <HoverCard>
                                                    <HoverCardTrigger asChild>
                                                        <Card className="p-4">
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-medium">{lang}</span>
                                                                    <Badge variant="secondary">
                                                                        {percentage}%
                                                                    </Badge>
                                                                </div>
                                                                <Progress
                                                                    value={parseFloat(percentage)}
                                                                    className="h-2"
                                                                />
                                                                <div className="text-sm text-muted-foreground">
                                                                    {(bytes / 1024).toFixed(1)} KB
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </HoverCardTrigger>
                                                    <HoverCardContent className="w-80 hidden">
                                                        <div className="space-y-2">
                                                            <h4 className="font-semibold">
                                                                {lang} Usage Statistics
                                                            </h4>
                                                            <div className="text-sm text-muted-foreground">
                                                                <p>Total bytes: {bytes.toLocaleString()}</p>
                                                                <p>Percentage of codebase: {percentage}%</p>
                                                            </div>
                                                        </div>
                                                    </HoverCardContent>
                                                </HoverCard>
                                            </motion.div>
                                        );
                                    })}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
