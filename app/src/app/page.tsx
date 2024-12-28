import {Navbar} from "@/components/navbar"
import {Hero} from "@/components/hero"
import {Projects} from "@/components/projects"
import {Skills} from "@/components/skills"
import {Contact} from "@/components/contact"

export default function Home() {
    return (
        <div className="min-h-screen md:w-full w-11/12 mx-auto">
            <Navbar/>
            <main>
                <Hero/>
                <Projects/>
                <Skills/>
                <Contact/>
            </main>
        </div>
    )
}

