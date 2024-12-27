"use client"

import {useState} from "react"
import {motion} from "framer-motion"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"

export function Contact() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess("")

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({name, email, subject, message}),
            })

            if (!response.ok) {
                throw new Error("Something went wrong")
            }

            setSuccess("Message sent successfully!")
            setName("")
            setEmail("")
            setSubject("")
            setMessage("")
        } catch (error) {
            console.error(error)
            setError("Failed to send message. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="contact" className="container py-12">
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5}}
                className="flex flex-col items-center justify-center gap-4"
            >
                <h2 className="text-3xl font-bold">Contact Me</h2>
                <p className="text-muted-foreground">Let&apos;s work together</p>
            </motion.div>
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.5, delay: 0.2}}
                className="mt-8"
            >
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle>Send me a message</CardTitle>
                        <CardDescription>
                            I&apos;ll get back to you as soon as possible.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Input
                                    placeholder="Subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Textarea
                                    placeholder="Message"
                                    className="min-h-[100px]"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <Button className="w-full" type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send Message"}
                            </Button>
                            {error && <p className="text-red-500">{error}</p>}
                            {success && <p className="text-green-500">{success}</p>}
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </section>
    )
}