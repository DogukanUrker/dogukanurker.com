"use client"

import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {ArrowRight, Github, Link, Linkedin, Twitter, Youtube} from 'lucide-react'

export function Hero() {
    return (
        <section id={"about"} className="container flex flex-col items-center justify-center gap-4 pt-24 pb-8 md:pt-32">
            <motion.div
                initial={{opacity: 0, scale: 0.5}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                className="flex items-center justify-center"
            >
                <div className="relative">
                    <img
                        src="/meSmall.webp?height=200&width=200"
                        alt="Profile"
                        className="rounded-full border-2 border-primary grayscale hover:scale-105 transition"
                        width={200}
                        height={200}
                    />
                    <motion.div
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        transition={{delay: 0.5}}
                        className="absolute -bottom-4 -right-4 rounded-full bg-primary p-2"
                    >
                        <span className="text-2xl">👋</span>
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2}}
                className="text-center"
            >
                <h1 className="text-4xl font-bold md:text-6xl mt-4">Doğukan Ürker</h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Full Stack Developer crafting beautiful experiences
                </p>
            </motion.div>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4}}
                className="flex gap-4"
            >
                <Button size="lg" onClick={() => window.location.href = '#contact'}>
                    Contact Me <ArrowRight className="ml-2"/>
                </Button>
                <Button size="lg" variant="outline" onClick={() => window.location.href = '/cv'}>
                    CV
                </Button>
            </motion.div>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.6}}
                className="flex gap-4 mt-4"
            >
                <Button size="icon" variant="ghost"
                        onClick={() => window.open('https://github.com/dogukanurker', '_blank')}>
                    <Github className="h-5 w-5"/>
                </Button>
                <Button size="icon" variant="ghost"
                        onClick={() => window.open('https://x.com/dogukanurker', '_blank')}>
                    <Twitter className="h-5 w-5"/>
                </Button>
                <Button size="icon" variant="ghost"
                        onClick={() => window.open('https://linkedin.com/in/dogukanurker', '_blank')}>
                    <Linkedin className="h-5 w-5"/>
                </Button>
                <Button size="icon" variant="ghost"
                        onClick={() => window.open('https://youtube.com/@dogukanurker', '_blank')}>
                    <Youtube className="h-5 w-5"/>
                </Button>
                <Button size="icon" variant="ghost"
                        onClick={() => window.open('/socials', '_blank')}>
                    <Link className="h-5 w-5"/>
                </Button>
            </motion.div>
        </section>
    )
}

