'use client';
import {useEffect, useState} from 'react';
import {fetchRepos, Repo} from '@/lib/fetchRepos';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {ArrowRight, GitFork, Star} from 'lucide-react'
import Link from 'next/link'
import {Skeleton} from "@/components/ui/skeleton"
import {ghToken} from "../../../const";

export default function Projects() {
    const [repos, setRepos] = useState<Repo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getRepos() {
            try {
                setIsLoading(true);
                const token = ghToken;
                const data = await fetchRepos('dogukanurker', token);
                setRepos(data);
            } finally {
                setIsLoading(false);
            }
        }

        getRepos();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-4xl font-bold mb-8">Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    // Loading skeletons
                    Array.from({length: 6}).map((_, index) => (
                        <Card
                            key={index}
                            className="group animate-in fade-in-50 duration-1000 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardHeader>
                                <Skeleton className="h-8 w-3/4 mb-2"/>
                                <Skeleton className="h-4 w-full mb-1"/>
                                <Skeleton className="h-4 w-2/3"/>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Skeleton className="h-6 w-16"/>
                                    <Skeleton className="h-6 w-16"/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full"/>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    repos.map(repo => (
                        <Card
                            key={repo.id}
                            className="group animate-in fade-in-50 duration-1000 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold tracking-tight">
                                    {repo.name}
                                </CardTitle>
                                <CardDescription className="line-clamp-2 h-12">
                                    {repo.description || 'No description available'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <GitFork className="h-4 w-4"/>
                                        {repo.forks}
                                    </Badge>
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Star className="h-4 w-4"/>
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
                                        <ArrowRight className="h-4 w-4"/>
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

