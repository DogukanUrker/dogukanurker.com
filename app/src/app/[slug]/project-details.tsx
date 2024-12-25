'use client';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {ArrowLeft, ExternalLink, GitFork, Star} from 'lucide-react';
import {motion} from "framer-motion";
import type {Repo} from '@/lib/fetchRepos';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@/components/ui/tooltip"

interface ProjectDetailsProps {
    repo: Repo;
    languages: Record<string, number>;
    contributors: any[];
}

export function ProjectDetails({repo, languages, contributors}: ProjectDetailsProps) {
    const router = useRouter();
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);

    return (
        <div className="container mx-auto py-10 space-y-8 select-none">
            <motion.div
                className="flex items-center justify-between"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3}}
            >
                <Button variant="ghost" onClick={() => router.push('/projects')} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4"/>
                    Back to Projects
                </Button>
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
            </motion.div>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            {repo.name}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            {repo.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Stats */}
                        <motion.div
                            className="flex gap-4"
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.5, delay: 0.2}}
                        >
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <GitFork className="h-4 w-4"/>
                                {repo.forks} forks
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-4 w-4"/>
                                {repo.stargazers_count} stars
                            </Badge>
                            {repo.license && (
                                <Badge variant="outline">
                                    {repo.license.spdx_id}
                                </Badge>
                            )}
                        </motion.div>

                        {/* Languages */}
                        <motion.div
                            className="space-y-4"
                            initial={{opacity: 0, x: -20}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.5, delay: 0.3}}
                        >
                            <h3 className="font-semibold text-lg">Languages</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(languages).map(([lang, bytes], index) => (
                                    <motion.div
                                        key={lang}
                                        initial={{opacity: 0, scale: 0.8}}
                                        animate={{opacity: 1, scale: 1}}
                                        transition={{duration: 0.3, delay: index * 0.1}}
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="px-3 py-1"
                                        >
                                            {lang} ({((bytes / totalBytes) * 100).toFixed(1)}%)
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Contributors */}
                        {contributors.length > 0 && (
                            <motion.div
                                className="space-y-4"
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{duration: 0.5, delay: 0.4}}
                            >
                                <h3 className="font-semibold text-lg">Contributors</h3>
                                <div className="flex flex-wrap gap-2">
                                    {contributors.map((contributor, index) => (
                                        <motion.div
                                            key={contributor.login}
                                            initial={{opacity: 0, scale: 0.8}}
                                            animate={{opacity: 1, scale: 1}}
                                            transition={{duration: 0.3, delay: index * 0.1}}
                                        >
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Avatar
                                                            className="border-2 border-background hover:scale-110 transition-transform cursor-pointer"
                                                            onClick={() => window.open(contributor.html_url, '_blank')}
                                                        >
                                                            <AvatarImage src={contributor.avatar_url}
                                                                         alt={contributor.login}/>
                                                            <AvatarFallback>{contributor.login[0]}</AvatarFallback>
                                                        </Avatar>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {contributor.login}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}