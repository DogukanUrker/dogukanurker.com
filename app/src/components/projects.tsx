"use client";

import {motion} from "framer-motion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {ExternalLink, Github} from "lucide-react";
import {Button} from "@/components/ui/button";

const projects = [
    {
        title: "flaskBlog",
        description:
            "A full-stack web application built with Next.js and TypeScript",
        image:
            "https://raw.githubusercontent.com/DogukanUrker/flaskBlog/refs/heads/main/images/Dark.png",
        tags: ["Python", "Flask", "SQLite", "Tailwind CSS"],
        github: "/flaskBlog",
        demo: "https://youtu.be/WyIpAlSp2RM",
    },
    {
        title: "CaptureGame",
        description: "Immortalize your favorite gaming moments.",
        image: "/capturegame.png?height=300&width=600",
        tags: ["Python", "FastAPI", "MongoDB"],
        github: "https:/www.github.com/dogukanurker/CaptureGame",
        demo: "https:/www.capturega.me",
    },
    {
        title: "Weather App",
        description: "A weather app built with Flutter and Python",
        image:
            "https://github.com/DogukanUrker/WeatherApp/blob/main/Images/app.png?raw=true?height=300&width=600",
        tags: ["Flutter", "Python", "Flask"],
        github: "/weatherapp",
        demo: "https://youtube.com/shorts/tv-oBduyGaY",
    },
];

export function Projects() {
    return (
        <section id="projects" className="container py-8 md:py-12">
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5}}
                className="flex flex-col items-center justify-center gap-3 md:gap-4"
            >
                <h2 className="text-2xl md:text-3xl font-bold">Projects</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                    Some of my recent work
                </p>
            </motion.div>
            <div className="grid gap-4 md:gap-6 mt-6 md:mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{opacity: 0, y: 20}}
                        whileInView={{opacity: 1, y: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.5, delay: index * 0.1}}
                    >
                        <Card className="overflow-hidden h-full flex flex-col">
                            <div className="relative h-48 md:h-64">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                                />
                            </div>
                            <CardHeader className="flex-grow">
                                <CardTitle className="text-xl md:text-2xl">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="text-sm md:text-base">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tags.map((tag, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="text-xs md:text-sm"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => window.open(project.github, "_blank")}
                                    >
                                        <Github className="mr-2 h-4 w-4"/>
                                        Code
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => window.open(project.demo, "_blank")}
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4"/>
                                        Demo
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <div className="flex flex-col items-center mt-6 md:mt-8">
                <Button size="lg" onClick={() => (window.location.href = "/projects")}>
                    See my other works
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                    More than 60 projects
                </p>
            </div>
        </section>
    );
}
