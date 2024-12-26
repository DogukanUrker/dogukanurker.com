'use client'

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Separator} from "@/components/ui/separator"
import {motion} from "framer-motion"
import {Coffee, Github, Heart} from 'lucide-react'

const donations = [
    {
        name: 'GitHub',
        icon: Github,
        url: 'https://github.com/sponsors/dogukanurker',
        description: 'Support me on GitHub by sponsoring my projects.'
    },
    {
        name: 'Patreon',
        icon: Heart,
        url: 'https://patreon.com/dogukanurker',
        description: 'Become a patron and support my work on Patreon.'
    },
    {
        name: 'Ko-fi',
        icon: Coffee,
        url: 'https://ko-fi.com/dogukanurker',
        description: 'Buy me a coffee on Ko-fi to show your support.'
    },
    {
        name: 'Buy Me a Coffee',
        icon: Coffee,
        url: 'https://buymeacoffee.com/dogukanurker',
        description: 'Support me by buying me a coffee.'
    }
]

export default function DonatePage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-2xl border-border/50">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-4xl font-bold tracking-tight">Support My Work</CardTitle>
                    <CardDescription className="text-lg">
                        If you enjoy my work and would like to support me, you can make a donation through any of the
                        following platforms
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 p-6 auto-rows-fr">
                    {donations.map((donation, index) => (
                        <motion.div
                            key={donation.name}
                            initial={{opacity: 0, y: 10}}
                            animate={{opacity: 1, y: 0}}
                            transition={{
                                duration: 0.2,
                                delay: index * 0.05
                            }}
                        >
                            <Card
                                className="h-full border border-border/50 bg-card hover:bg-accent/50 transition-colors flex flex-col">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <div className="rounded-full p-2 bg-primary/10">
                                            <donation.icon className="h-5 w-5 text-primary"/>
                                        </div>
                                        <CardTitle className="text-xl">{donation.name}</CardTitle>
                                    </div>
                                </CardHeader>
                                <Separator className="opacity-50"/>
                                <CardContent className="pt-4 flex-1">
                                    <CardDescription className="text-sm">
                                        {donation.description}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        asChild
                                    >
                                        <a
                                            href={donation.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <donation.icon className="h-4 w-4"/>
                                            Donate via {donation.name}
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

