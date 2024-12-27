"use client"

import {motion} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Progress} from "@/components/ui/progress"

const skills = [
    {name: "Frontend Development", progress: 70, description: "React, Next.js, TypeScript"},
    {name: "Backend Development", progress: 90, description: "Python, Flask, FastAPI, Node.js, SQLite, MongoDB"},
    {name: "UI/UX Design", progress: 60, description: "Figma, Adobe XD"},
    {name: "DevOps", progress: 80, description: "Docker, AWS, CI/CD"}
]

export function Skills() {
    return (
        <section id="skills" className="container py-12">
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5}}
                className="flex flex-col items-center justify-center gap-4"
            >
                <h2 className="text-3xl font-bold">Skills</h2>
                <p className="text-muted-foreground">My technical expertise</p>
            </motion.div>
            <div className="grid gap-6 mt-8 md:grid-cols-2">
                {skills.map((skill, index) => (
                    <motion.div
                        key={index}
                        initial={{opacity: 0, x: index % 2 === 0 ? -20 : 20}}
                        whileInView={{opacity: 1, x: 0}}
                        viewport={{once: true}}
                        transition={{duration: 0.5, delay: index * 0.1}}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>{skill.name}</CardTitle>
                                <CardDescription>{skill.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={skill.progress} className="h-2"/>
                                <span className="text-sm text-muted-foreground mt-2 inline-block">
                  {skill.progress}%
                </span>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

