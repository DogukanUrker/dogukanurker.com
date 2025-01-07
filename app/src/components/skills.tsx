"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Database, Layers, Wrench } from "lucide-react";

const skills = [
  {
    name: "Programming",
    icon: Code2,
    skills: ["Python", "JavaScript", "TypeScript", "HTML", "CSS"],
  },
  {
    name: "Frameworks & Libraries",
    icon: Layers,
    skills: [
      "Flask",
      "FastAPI",
      "React",
      "NextJS",
      "TailwindCSS",
      "Bootstrap",
      "ShadCN",
    ],
  },
  {
    name: "Databases & Tools",
    icon: Database,
    skills: [
      "SQLite",
      "MongoDB",
      "Git",
      "Docker",
      "VSCode",
      "JetBrains IDE's",
      "Bruno",
      "MongoDB Compass",
    ],
  },
  {
    name: "Development Skills",
    icon: Wrench,
    skills: [
      "RESTful API design",
      "Responsive UI Development",
      "Real-time database updates",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function Skills() {
  return (
    <section id="skills" className="container py-8 md:py-12 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center gap-3 md:gap-4 mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold">Skills & Expertise</h2>
        <p className="text-muted-foreground text-sm md:text-base text-center max-w-2xl">
          A comprehensive overview of my technical capabilities and professional
          expertise
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-6 md:grid-cols-2"
      >
        {skills.map((category, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full overflow-hidden border hover:bg-accent/5 transition-all duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2.5 rounded-md bg-background border">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                    {category.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + skillIndex * 0.05 }}
                      className="inline-flex px-4 py-2 bg-background hover:bg-accent/10 border rounded-md text-xs md:text-sm font-medium transition-colors duration-200 cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
