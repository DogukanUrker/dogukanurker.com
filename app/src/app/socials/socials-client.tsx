"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Cursor } from "@/components/Cursor";
import UnderlineLink from "@/components/ui/UnderlineLink";

// ─── Motion constants ─────────────────────────────────────────────────────

const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const spring = { type: "spring" as const, stiffness: 100, damping: 22 };

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const navVariants: Variants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { ...spring, staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: expo } },
};

// ─── Social data ────────────────────────────────────────────────────────────

const socials = [
  {
    label: "github",
    url: "https://github.com/dogukanurker",
    description: "dogukanurker",
  },
  {
    label: "twitter",
    url: "https://twitter.com/dogukanurker",
    description: "@dogukanurker",
  },
  {
    label: "linkedin",
    url: "https://linkedin.com/in/dogukanurker",
    description: "dogukanurker",
  },
  {
    label: "mail",
    url: "mailto:dogukanurker@icloud.com",
    description: "dogukanurker@icloud.com",
  },
];

// ─── Client ─────────────────────────────────────────────────────────────────

export default function SocialsClient() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <main
      className={`relative min-h-screen w-full overflow-x-hidden${
        cursorEnabled ? " cursor-none" : ""
      }`}
      style={{
        backgroundColor: "var(--brand-cream)",
        color: "var(--brand-ink)",
      }}
    >
      <Cursor onEnable={setCursorEnabled} />

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <motion.nav
        aria-label="primary navigation"
        className="fixed left-0 right-0 top-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 md:px-10 md:py-5 select-none"
        style={{
          backgroundColor: "rgba(243, 241, 234, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          willChange: "transform",
        }}
        initial={shouldReduce ? "visible" : "hidden"}
        animate="visible"
        variants={navVariants}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            data-cursor="link"
            className="text-sm font-medium tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2 rounded-sm"
            style={{ color: "var(--brand-ink)" }}
          >
            Doğukan Ürker
          </Link>
          <span
            className="hidden items-center gap-1 text-sm md:inline-flex"
            style={{ color: "var(--brand-muted)" }}
          >
            <span>full-stack engineer @</span>
            <UnderlineLink href="https://sensity.ai">sensity.ai</UnderlineLink>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <UnderlineLink href="/">home</UnderlineLink>
          <UnderlineLink href="/cv">resume</UnderlineLink>
        </div>
        {/* mobile role subtitle */}
        <div
          className="mt-1 flex w-full items-center gap-1 text-xs leading-relaxed tracking-wide md:hidden"
          style={{ color: "var(--brand-muted)" }}
        >
          <span>full-stack engineer @</span>
          <UnderlineLink href="https://sensity.ai" className="text-xs">
            sensity.ai
          </UnderlineLink>
        </div>
      </motion.nav>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-6 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-32 sm:px-10 sm:pt-40">
        <motion.header
          initial={shouldReduce ? "visible" : "hidden"}
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            variants={fadeUp}
            className="font-serif tracking-tighter lowercase"
            style={{
              fontSize: "clamp(40px, 11vw, 92px)",
              fontWeight: 400,
              lineHeight: 0.95,
              color: "var(--brand-ink)",
              fontOpticalSizing: "auto",
              margin: 0,
            }}
            aria-hidden
          >
            socials
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-sm tracking-wide lowercase"
            style={{ color: "var(--brand-muted)" }}
          >
            find me on the internet
          </motion.p>
        </motion.header>

        {/* ── Social Links ───────────────────────────────────────────── */}
        <motion.div
          className="mt-14 flex flex-col gap-8"
          initial={shouldReduce ? "visible" : "hidden"}
          animate="visible"
          variants={containerVariants}
        >
          {socials.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="group">
              <UnderlineLink href={s.url} className="text-base">
                {s.label}
              </UnderlineLink>
              <p
                className="mt-1 text-xs lowercase"
                style={{
                  color: "var(--brand-dim)",
                  marginLeft: "0.5rem",
                }}
              >
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer
        className="flex flex-col items-center gap-3 px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] select-none sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:pb-10"
        style={{ color: "var(--brand-muted)" }}
      >
        <span className="text-sm lowercase">izmir, türkiye</span>
        <nav aria-label="social links" className="flex items-center gap-5">
          <UnderlineLink href="mailto:dogukanurker@icloud.com">
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
