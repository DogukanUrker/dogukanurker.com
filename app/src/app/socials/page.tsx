'use client'

import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {motion} from "framer-motion"
import {Github, Instagram, Mail, Twitter, Youtube} from 'lucide-react'

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
        name: 'Email',
        icon: Mail,
        url: 'mailto:dogukanurker@icloud.com'
    }
]

export default function SocialsPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
            <Card className="w-fit max-w-md bg-black/50 border-none">
                <motion.div
                    className="flex flex-col items-center gap-4 p-8"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    {socials.map((social, index) => (
                        <motion.div
                            key={social.name}
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.1
                            }}
                            className="w-full"
                        >
                            <Button
                                variant="link"
                                size="lg"
                                className="w-full text-white transition-all p-0 hover:scale-125"
                                asChild
                            >
                                <a
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center"
                                >
                                    <social.icon style={{height: '24px', width: '24px'}}/>
                                </a>
                            </Button>
                        </motion.div>
                    ))}
                </motion.div>
            </Card>
        </div>
    )
}