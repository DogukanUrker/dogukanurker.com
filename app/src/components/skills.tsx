"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const skills = [
  {
    name: "Backend Development",
    progress: 90,
    description: "Python, Flask, FastAPI, Node.js, SQLite, MongoDB",
  },
  {
    name: "Frontend Development",
    progress: 70,
    description: "React, Next.js, TypeScript",
  },
  { name: "DevOps", progress: 80, description: "Docker, AWS, CI/CD" },
  { name: "UI/UX Design", progress: 60, description: "Figma, Adobe XD" },
];

export function Skills() {
  return (
    <section id="skills" className="container py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-3 md:gap-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold">Skills</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          My technical expertise
        </p>
      </motion.div>
      <div className="grid gap-4 md:gap-6 mt-6 md:mt-8 sm:grid-cols-1 md:grid-cols-2">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  {skill.name}
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {skill.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={skill.progress} className="h-2" />
                <span className="text-xs md:text-sm text-muted-foreground mt-2 inline-block">
                  {skill.progress}%
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
