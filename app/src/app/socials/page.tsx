'use client'

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {motion} from "framer-motion"
import {Code, Github, Instagram, Linkedin, Mail, Twitter, Youtube} from 'lucide-react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"

const socials = [
    {
        name: 'Instagram',
        icon: Instagram,
        url: 'https://instagram.com/dogukanurker'
    },
    {
        name: 'Twitter',
        icon: Twitter,
        url: 'https://twitter.com/dogukanurker'
    },
    {
        name: 'GitHub',
        icon: Github,
        url: 'https://github.com/dogukanurker'
    },
    {
        name: 'YouTube',
        icon: Youtube,
        url: 'https://youtube.com/@dogukanurker'
    },
    {
        name: 'LinkedIn',
        icon: Linkedin,
        url: 'https://www.linkedin.com/in/dogukanurker/'
    },
    {
        name: 'Email',
        icon: Mail,
        url: 'mailto:dogukanurker@icloud.com'
    }
]

export default function SocialsPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black select-none">
            <Card className="relative w-full max-w-md mx-4 bg-black border-zinc-800">
                <CardHeader className="space-y-4">
                    <motion.div
                        initial={{scale: 0}}
                        animate={{scale: 1}}
                        transition={{type: "spring", duration: 0.8}}
                        className="flex justify-center"
                    >
                        <Avatar className="h-28 w-28 hover:scale-110 transition">
                            <AvatarImage src="/meSmall.webp" alt="Profile" className={"grayscale"}/>
                            <AvatarFallback>DU</AvatarFallback>
                        </Avatar>
                    </motion.div>
                    <div className="space-y-2 text-center">
                        <CardTitle className="text-2xl font-bold text-white">Doğukan Ürker</CardTitle>
                        <Badge variant="outline" className="font-normal text-white border-zinc-800">
                            Full Stack Developer
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <motion.div
                        className="grid grid-cols-2 gap-4"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                    >
                        {socials.map((social, index) => (
                            <motion.div
                                key={social.name}
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="w-full transition-all  text-white group"
                                    asChild
                                >
                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center text-2xl"
                                    >
                                        <social.icon className="transition-transform group-hover:scale-110"/>
                                    </a>
                                </Button>
                            </motion.div>
                        ))}
                    </motion.div>
                    <Button
                        variant="outline"
                        size="lg"
                        className={"w-full mt-4"}
                        onClick={() => window.location.href = '/projects'}
                    > <Code/>See my work</Button>
                </CardContent>
            </Card>
        </div>
    )
}