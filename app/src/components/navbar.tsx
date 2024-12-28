"use client"

import {motion} from "framer-motion"

export function Navbar() {
    return (
        <motion.header
            initial={{y: -100}}
            animate={{y: 0}}
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background"
        >
            <div className="container flex h-14 items-center justify-center">
                <nav className="flex items-center space-x-8 text-sm font-medium">
                    <a className="transition-colors hover:text-primary font-bold" href="#about">Doğukan</a>
                    <a className="transition-colors hover:text-primary" href="#projects">Projects</a>
                    <a className="transition-colors hover:text-primary" href="#skills">Skills</a>
                    <a className="transition-colors hover:text-primary" href="#contact">Contact</a>
                </nav>
            </div>
        </motion.header>
    )
}

