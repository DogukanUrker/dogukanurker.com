"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Cursor } from "@/components/Cursor";

// ─── Shared underline-link ─────────────────────────────────────────────────

interface UnderlineLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function UnderlineLink({ href, children, className = "" }: UnderlineLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("//");
  const isHash = href.startsWith("#");

  const base =
    "group relative inline-flex items-center text-sm tracking-wide " +
    "text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors duration-200 " +
    "rounded-sm focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2 " +
    className;

  const underline = (
    <span
      aria-hidden
      className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--brand-ink)] transition-[width] duration-300 ease-out group-hover:w-full group-focus-visible:w-full"
    />
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className={base}
      >
        {children}
        {underline}
      </a>
    );
  }

  if (isHash) {
    return (
      <a href={href} data-cursor="link" className={base}>
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link href={href} data-cursor="link" className={base}>
      {children}
      {underline}
    </Link>
  );
}

// ─── Landing page ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const shouldReduce = useReducedMotion();


  // Detect mobile to push the name's hidden position further off-screen.
  // On small screens the text is smaller, so "108%" isn't enough to hide it
  // below the viewport edge — use a much larger translate instead.
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Cubic bezier typed as a tuple — required by framer-motion’s Easing type
  const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];

  // Overdamped spring for Y-axis entrances — natural deceleration, no bounce.
  const spring = { type: "spring" as const, stiffness: 100, damping: 22 };

  // Portrait: clipPath reveal uses duration-based easing to avoid spring overshoot on clip edges.
  const portraitVariants = {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 1.4, ease: expo, delay: 0.5 },
    },
  };

  // Hero name rises from below with spring physics for a physical, weighted feel.
  // On mobile we use a larger initial offset so the text starts fully off-screen.
  const nameVariants = {
    hidden: { y: isMobile ? "250%" : "108%" },
    visible: {
      y: "0%",
      transition: { ...spring, delay: 0 },
    },
  };

  // Scroll-triggered intro — expo easing consistent with all other animations.
  const introVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: expo },
    },
  };

  // Navbar slides in from the top with spring physics, same wave as the hero name.
  const navVariants = {
    hidden: { y: "-100%" },
    visible: {
      y: "0%",
      transition: { ...spring, delay: 0 },
    },
  };

  // Nav links: opacity-only fade — the nav slide already provides directional context.
  const navLinksVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.9, ease: expo, delay: 0.5 },
    },
  };

  return (
    <main
      className={`relative w-full min-h-screen overflow-x-hidden${cursorEnabled ? " cursor-none" : ""}`}
      style={{
        backgroundColor: "var(--brand-cream)",
        color: "var(--brand-ink)",
      }}
    >
      <Cursor onEnable={setCursorEnabled} />

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <motion.nav
        aria-label="primary navigation"
        className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 md:py-5 md:px-10"
        style={{
          backgroundColor: "rgba(243, 241, 234, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        variants={navVariants}
        initial={shouldReduce ? "visible" : "hidden"}
        animate="visible"
      >
        <div className="flex items-center gap-4">
          <span
            className="text-sm font-medium tracking-tight"
            style={{ color: "var(--brand-ink)" }}
          >
            Doğukan Ürker
          </span>
          <span
            className="hidden md:inline text-sm"
            style={{ color: "var(--brand-muted)" }}
          >
            full-stack engineer @{" "}
            <UnderlineLink href="https://sensity.ai">sensity.ai</UnderlineLink>
          </span>
        </div>
        <motion.div
          className="flex items-center gap-6"
          variants={navLinksVariants}
          initial={shouldReduce ? "visible" : "hidden"}
          animate="visible"
        >
          <UnderlineLink href="#about">about</UnderlineLink>
          <UnderlineLink href="/cv">resume</UnderlineLink>
        </motion.div>
        {/* Mobile-only role subtitle — sits below the first row */}
        <div
          className="w-full mt-1 md:hidden text-xs tracking-wide leading-relaxed"
          style={{ color: "var(--brand-muted)" }}
        >
          full-stack engineer @{" "}
          <UnderlineLink href="https://sensity.ai" className="text-xs">
            sensity.ai
          </UnderlineLink>
        </div>
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[100svh] flex flex-col items-center justify-center">
        {/* Portrait */}
        <div
          className="group relative z-10"
          style={{
            width: "clamp(220px, 26vw, 360px)",
            height: "clamp(220px, 26vw, 360px)",
          }}
          data-cursor="photo"
        >
          <motion.div
            className="w-full h-full overflow-hidden"
            variants={portraitVariants}
            initial={shouldReduce ? "visible" : "hidden"}
            animate="visible"
          >
            <Image
              src="/dogukan.jpg"
              alt="Doğukan Ürker"
              fill
              priority
              sizes="(max-width: 640px) 220px, (max-width: 1200px) 26vw, 360px"
              className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-[1.04]"
            />
          </motion.div>
        </div>

        {/* Giant name — absolutely pinned to the bottom of the hero.
             The wrapper clip acts as the mask (like overflow:hidden) during
             the rise, then opens its top to -30 px so the breve/umlaut have
             room at rest. Both transitions finish at the same time so the
             clip is already open when the text lands — no pop. */}
        <motion.div
          className="absolute left-0 right-0 pointer-events-none bottom-2 sm:-bottom-2"
          // -600 px sides allow the name to bleed past viewport edges.
          initial={
            shouldReduce
              ? { clipPath: "inset(-30px -600px -40px -600px)" }
              : { clipPath: "inset(0px -600px -40px -600px)" }
          }
          animate={{ clipPath: "inset(-30px -600px -40px -600px)" }}
          transition={{ duration: 1.6, ease: expo }}
          aria-hidden
        >
          <motion.h1
            // Bug 1: line-height 0.95 (was 0.82) — gives the breve / umlaut
            //   room inside the line box before overflow is released.
            // Bug 2: whitespace-normal on mobile → name wraps to two centered
            //   lines so neither edge is cut off by overflow-x:hidden on <main>.
            className="font-serif text-center w-full tracking-tighter select-none
              whitespace-normal sm:whitespace-nowrap
              text-[clamp(44px,15vw,90px)] sm:text-[clamp(64px,18vw,300px)]"
            style={
              {
                lineHeight: 0.95,
                color: "var(--brand-ink)",
                fontOpticalSizing: "auto",
              } as React.CSSProperties
            }
            variants={nameVariants}
            initial={shouldReduce ? "visible" : "hidden"}
            animate="visible"
          >
            Doğukan Ürker
          </motion.h1>
        </motion.div>

        {/* Scroll cue — animated fill/drain line on the left, desktop only */}
        {!shouldReduce && (
          <motion.div
            className="absolute left-6 md:left-10 bottom-12 hidden sm:block pointer-events-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
            aria-hidden
          >
            <div className="w-px h-12 overflow-hidden">
              <motion.div
                className="w-full h-full"
                style={{ backgroundColor: "var(--brand-dim)" }}
                animate={{ y: ["-100%", "0%", "0%", "100%"] }}
                transition={{
                  duration: 2.2,
                  times: [0, 0.35, 0.65, 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 0.5,
                }}
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        {/* Offset anchor: 96 px into the section so clicking "about" in the nav
            scrolls past the ğ glyph that bleeds in from the hero above. */}
        <span id="about" className="absolute top-24" aria-hidden />
        <motion.p
          className="font-serif text-center max-w-[23ch]"
          style={
            {
              fontSize: "clamp(26px, 3.6vw, 54px)",
              lineHeight: 1.22,
              color: "var(--brand-ink)",
              fontWeight: 340,
              fontOpticalSizing: "auto",
            } as React.CSSProperties
          }
          variants={introVariants}
          initial={shouldReduce ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          i build detection systems for{" "}
          <strong className="font-semibold">
            deepfakes &amp; ai-generated media
          </strong>{" "}
          at{" "}
          <a
            href="https://sensity.ai"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="group relative"
          >
            sensity.ai
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--brand-ink)] transition-[width] duration-300 ease-out group-hover:w-full"
            />
          </a>
          {
            " — owning features end to end: backend, frontend, tests, deploys. off the clock i"
          }{" "}
          <strong className="font-semibold">build in public</strong>:
          open-source tools, a local-llm homelab, and whatever i&apos;m curious
          about.{" "}
          <em style={{ color: "var(--brand-muted)" }}>
            coding since 12, still chasing the same feeling.
          </em>
        </motion.p>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="flex flex-col items-center gap-3 pb-10 px-6
          sm:flex-row sm:items-center sm:justify-between sm:px-10"
        style={{ color: "var(--brand-muted)" }}
      >
        <span className="text-sm">izmir, türkiye</span>
        <nav aria-label="social links" className="flex items-center gap-5">
          <UnderlineLink href="mailto:dogukanurker@icloud.me">
            mail
          </UnderlineLink>
          <UnderlineLink href="https://github.com/dogukanurker">
            github
          </UnderlineLink>
          <UnderlineLink href="https://twitter.com/dogukanurker">
            twitter
          </UnderlineLink>
          <UnderlineLink href="https://linkedin.com/in/dogukanurker">
            linkedin
          </UnderlineLink>
        </nav>
      </footer>
    </main>
  );
}
