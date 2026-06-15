"use client";

import { useState } from "react";
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

export default function HomePage() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  // Released to overflow-visible once the entrance animation completes so
  // diacritics (ğ breve, ü umlaut) are never clipped at rest.
  const [nameRevealed, setNameRevealed] = useState(false);
  const shouldReduce = useReducedMotion();

  // Cubic bezier typed as a tuple — required by framer-motion's Easing type
  const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];

  const portraitVariants = {
    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
    visible: {
      clipPath: "inset(0% 0% 0% 0%)",
      transition: { duration: 1.1, ease: expo },
    },
  };

  const nameVariants = {
    hidden: { y: "108%" },
    visible: {
      y: "0%",
      transition: { duration: 1.0, ease: expo, delay: 0.25 },
    },
  };

  const introVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: "easeOut" as const },
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
      <nav
        aria-label="primary navigation"
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10"
        style={{ backgroundColor: "var(--brand-cream)" }}
      >
        <div className="flex items-center gap-3">
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
            · full-stack engineer @{" "}
            <UnderlineLink href="https://sensity.ai">sensity.ai</UnderlineLink>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <UnderlineLink href="#about">about</UnderlineLink>
          <UnderlineLink href="/cv">resume</UnderlineLink>
        </div>
      </nav>

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

        {/* Giant name — absolutely pinned to the bottom of the hero, rises from a mask.
             overflow-hidden only during the entrance; released on completion so
             tall diacritics (ğ / ü) are never clipped at rest. */}
        <div
          className={`absolute left-0 right-0 pointer-events-none
            bottom-20 sm:-bottom-2
            ${
              nameRevealed || shouldReduce
                ? "overflow-visible"
                : "overflow-hidden"
            }`}
          aria-hidden
        >
          <motion.h1
            // Bug 1: line-height 0.95 (was 0.82) — gives the breve / umlaut
            //   room inside the line box before overflow is released.
            // Bug 2: whitespace-normal on mobile → name wraps to two centered
            //   lines so neither edge is cut off by overflow-x:hidden on <main>.
            className="font-serif text-center w-full tracking-tighter select-none
              whitespace-normal sm:whitespace-nowrap
              text-[clamp(44px,15vw,90px)] sm:text-[clamp(64px,18.5vw,300px)]"
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
            onAnimationComplete={() => setNameRevealed(true)}
          >
            Doğukan Ürker
          </motion.h1>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        {/* Offset anchor: 96 px into the section so clicking "about" in the nav
            scrolls past the ğ glyph that bleeds in from the hero above. */}
        <span id="about" className="absolute top-24" aria-hidden />
        <motion.p
          className="font-serif text-center max-w-[21ch]"
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
          {" — fastapi services, react frontends. off the clock i"}{" "}
          <strong className="font-semibold">build in public</strong>:
          open-source tools, a homelab running local llms, and whatever i&apos;m
          curious about.{" "}
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
