"use client"

import {motion} from "framer-motion"
import {Button} from "@/components/ui/button"
import {ArrowRight, Github, Link, Linkedin, Mail, Twitter, Youtube} from 'lucide-react'

export function Hero() {
    return (
        <section className="min-h-[calc(100vh-3.5rem)] w-full relative select-none">
            <div className="container h-full">
                <div className="grid lg:grid-cols-2 min-h-[calc(100vh-3.5rem)] gap-8">
                    {/* Left side - Photo */}
                    <motion.div
                        initial={{opacity: 0, scale: 1.1}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 1.2, ease: "easeOut"}}
                        className="relative h-full w-full min-h-[500px] lg:min-h-full order-2 lg:order-1"
                    >
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src="/me.webp"
                                alt="Doğukan Ürker - Full Stack Developer"
                                className="grayscale rounded-lg w-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                            />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"/>
                        </div>
                    </motion.div>

                    {/* Right side - Content */}
                    <div className="flex flex-col justify-center order-1 lg:order-2 pt-24 lg:pt-0">
                        <div className="space-y-8">
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5}}
                                className="space-y-2"
                            >
                                <h2 className="text-primary font-semibold tracking-wide uppercase">
                                    Full Stack Developer
                                </h2>
                                <h1 className="p-2 text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 leading-none">
                                    Doğukan Ürker
                                </h1>
                            </motion.div>

                            <motion.p
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: 0.1}}
                                className="text-lg text-muted-foreground max-w-md leading-relaxed"
                            >
                                Crafting exceptional digital experiences through innovative full-stack development.
                                Specialized in building modern web applications that combine stunning design with
                                powerful functionality.
                            </motion.p>

                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: 0.2}}
                                className="flex flex-col sm:flex-row gap-4 max-w-md"
                            >
                                <Button size="lg" className="w-full sm:w-auto"
                                        onClick={() => window.location.href = '#projects'}>
                                    View Projects <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto"
                                        onClick={() => window.open("/cv")}>
                                    Go to CV
                                </Button>
                            </motion.div>

                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                transition={{duration: 0.5, delay: 0.3}}
                                className="flex gap-6"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:scale-110 transition-transform"
                                    onClick={() => window.open('https://github.com/dogukanurker', '_blank')}
                                >
                                    <Github className="h-5 w-5"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:scale-110 transition-transform"
                                    onClick={() => window.open('https://linkedin.com/in/dogukanurker', '_blank')}
                                >
                                    <Linkedin className="h-5 w-5"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:scale-110 transition-transform"
                                    onClick={() => window.open('mailto:dogukanurker@example.com', '_blank')}
                                >
                                    <Mail className="h-5 w-5"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:scale-110 transition-transform"
                                    onClick={() => window.open('https://x.com/dogukanurker', '_blank')}
                                >
                                    <Twitter className="h-5 w-5"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:scale-110 transition-transform"
                                    onClick={() => window.open('https://youtube.com/@dogukanurker', '_blank')}
                                >
                                    <Youtube className="h-5 w-5"/>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:scale-110 transition-transform"
                                    onClick={() => window.open('/socials', '_blank')}
                                >
                                    <Link className="h-5 w-5"/>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}