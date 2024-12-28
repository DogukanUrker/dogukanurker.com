"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Github,
  Link,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";
export function Hero() {
  return (
    <section
      id="about"
      className="min-h-[calc(100vh-3.5rem)] w-full relative select-none mx-auto py-8 md:py-0"
    >
      <div className="container h-full">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-3.5rem)] gap-4 md:gap-8 items-center">
          {/* Left side - Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none order-1 lg:order-1"
          >
            <div className="absolute inset-0 overflow-hidden rounded">
              <img
                src="/me.webp"
                alt="Doğukan Ürker - Full Stack Developer"
                className="grayscale w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                style={{
                  objectPosition: "50% 40%", // Adjust this value to center your face in the frame
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
          </motion.div>

          {/* Right side - Content */}
          <div className="flex flex-col justify-center order-2 lg:order-2 space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h2 className="text-primary font-semibold tracking-wide uppercase text-sm md:text-base">
                Full Stack Developer
              </h2>
              <h1 className="py-2 text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 leading-tight">
                Doğukan Ürker
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed"
            >
              Crafting exceptional digital experiences through innovative
              full-stack development. Specialized in building modern web
              applications that combine stunning design with powerful
              functionality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => (window.location.href = "#projects")}
              >
                View Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => window.open("/cv")}
              >
                Go to CV
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 md:gap-4"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-transform"
                onClick={() =>
                  window.open("https://github.com/dogukanurker", "_blank")
                }
              >
                <Github className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-transform"
                onClick={() =>
                  window.open("https://linkedin.com/in/dogukanurker", "_blank")
                }
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-transform"
                onClick={() =>
                  window.open("mailto:dogukanurker@example.com", "_blank")
                }
              >
                <Mail className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-transform"
                onClick={() =>
                  window.open("https://x.com/dogukanurker", "_blank")
                }
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-transform"
                onClick={() =>
                  window.open("https://youtube.com/@dogukanurker", "_blank")
                }
              >
                <Youtube className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:scale-110 transition-transform"
                onClick={() => window.open("/socials", "_blank")}
              >
                <Link className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
