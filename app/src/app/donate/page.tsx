"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Cursor } from "@/components/Cursor";

// ─── Motion constants (shared with CV and landing page) ─────────────────────

// expo-out cubic bezier — clip/opacity reveals, no overshoot.
const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];

// overdamped spring — Y-axis entrances, natural deceleration, no bounce.
const spring = { type: "spring" as const, stiffness: 100, damping: 22 };

// page-level entrance: stagger the header pieces on mount.
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

// nav slides in from the top.
const navVariants: Variants = {
  hidden: { y: -100 },
  visible: {
    y: 0,
    transition: { ...spring, staggerChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: expo } },
};

// section reveal on scroll.
const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: expo } },
};

// per-word fade for the intro paragraph (the signature reveal, on mount).
const wordContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.012, delayChildren: 0.3 } },
};
const wordItem: Variants = {
  hidden: { opacity: 0.12 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: expo } },
};

// ─── Shared underline link ──────────────────────────────────────────────────

interface UnderlineLinkProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

function UnderlineLink({
  href,
  onClick,
  children,
  className = "",
}: UnderlineLinkProps) {
  const base =
    "group relative inline-flex items-center text-sm tracking-wide " +
    "text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors duration-200 " +
    "rounded-sm focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2 " +
    "bg-transparent border-none p-0 cursor-pointer " +
    className;

  const underline = (
    <span
      aria-hidden
      className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--brand-ink)] transition-[width] duration-300 ease-out group-hover:w-full group-focus-visible:w-full"
    />
  );

  if (onClick) {
    return (
      <button onClick={onClick} data-cursor="link" className={base}>
        {children}
        {underline}
      </button>
    );
  }

  if (!href) return null;

  const isExternal = href.startsWith("http") || href.startsWith("//");
  const isMail = href.startsWith("mailto:");

  if (isExternal || isMail) {
    return (
      <a
        href={href}
        target={isMail ? undefined : "_blank"}
        rel={isMail ? undefined : "noopener noreferrer"}
        data-cursor="link"
        className={base}
      >
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

// ─── Reusable section wrapper ───────────────────────────────────────────────

function Section({
  heading,
  meta,
  children,
  shouldReduce,
  revealOnMount = false,
}: {
  heading: string;
  meta?: string;
  children: React.ReactNode;
  shouldReduce: boolean | null;
  revealOnMount?: boolean;
}) {
  return (
    <motion.section
      className="cv-section"
      initial={shouldReduce ? "visible" : "hidden"}
      animate={revealOnMount ? "visible" : undefined}
      whileInView={revealOnMount ? undefined : "visible"}
      viewport={revealOnMount ? undefined : { once: true, margin: "-8% 0px" }}
      variants={sectionReveal}
    >
      <hr
        style={{
          border: "none",
          borderTop: "1px solid var(--brand-border)",
          margin: "0 0 28px",
        }}
      />
      <div className="mb-7">
        <h2
          className="font-serif lowercase"
          style={{
            fontSize: "clamp(22px, 3.4vw, 30px)",
            fontWeight: 420,
            lineHeight: 1.1,
            color: "var(--brand-ink)",
            fontOpticalSizing: "auto",
            letterSpacing: "-0.01em",
            margin: 0,
          }}
        >
          {heading}
        </h2>
        {meta && (
          <p
            className="mt-1.5 text-sm tracking-wide"
            style={{ color: "var(--brand-dim)" }}
          >
            {meta}
          </p>
        )}
      </div>
      {children}
    </motion.section>
  );
}

// row: a title block on the left, dates/meta on the right.
function HeadRow({
  title,
  subtitle,
  right,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h3
          className="text-base font-medium tracking-tight"
          style={{ color: "var(--brand-ink)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && (
        <div className="shrink-0 text-sm tracking-wide sm:text-right">
          {right}
        </div>
      )}
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────────────────────

const introWords = [
  { text: "i" },
  { text: "build" },
  { text: "open-source", bold: true },
  { text: "tools," },
  { text: "scripts," },
  { text: "and" },
  { text: "applications" },
  { text: "in" },
  { text: "public." },
  { text: "if" },
  { text: "you" },
  { text: "enjoy" },
  { text: "my" },
  { text: "work" },
  { text: "and" },
  { text: "would" },
  { text: "like" },
  { text: "to" },
  { text: "support" },
  { text: "me," },
  { text: "you" },
  { text: "can" },
  { text: "make" },
  { text: "a" },
  { text: "donation", bold: true },
  { text: "through" },
  { text: "any" },
  { text: "of" },
  { text: "the" },
  { text: "platforms" },
  { text: "below.", italic: true },
];

const donations = [
  {
    name: "github sponsors",
    url: "https://github.com/sponsors/dogukanurker",
    subtitle: "sponsor open-source projects directly",
    type: "monthly / one-time",
    description:
      "support me directly on github. you can choose a recurring sponsorship tier or make a one-time contribution. all sponsors are highlighted on my github profile.",
  },
  {
    name: "patreon",
    url: "https://patreon.com/dogukanurker",
    subtitle: "become a patron of my work",
    type: "monthly",
    description:
      "support my ongoing projects on a recurring monthly basis. this helps cover homelab hardware costs, hosting fees, and domains.",
  },
  {
    name: "ko-fi",
    url: "https://ko-fi.com/dogukanurker",
    subtitle: "buy a coffee or support monthly",
    type: "one-time / monthly",
    description:
      "a friendly way to buy me a coffee. supports one-time contributions or monthly subscriptions with zero platform fees.",
  },
  {
    name: "buy me a coffee",
    url: "https://buymeacoffee.com/dogukanurker",
    subtitle: "simple one-time donations",
    type: "one-time",
    description:
      "quickly support my work by buying me a coffee or two. no account creation required for supporters.",
  },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function DonatePage() {
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
        {/* mobile role subtitle on a second row */}
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

      {/* ── Document ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl px-6 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-32 sm:px-10 sm:pt-40">
        {/* Header */}
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
          >
            support my work
          </motion.h1>

          {/* Intro — word-by-word reveal */}
          <motion.p
            variants={shouldReduce ? fadeUp : wordContainer}
            className="mt-9 font-serif"
            style={{
              fontSize: "clamp(20px, 2.7vw, 30px)",
              lineHeight: 1.32,
              fontWeight: 360,
              color: "var(--brand-ink)",
              fontOpticalSizing: "auto",
              maxWidth: "30ch",
            }}
          >
            {introWords.map((w, i) => {
              let node: React.ReactNode = (
                <motion.span
                  variants={shouldReduce ? undefined : wordItem}
                  className="inline-block"
                >
                  {w.text}
                </motion.span>
              );
              if (w.bold) {
                node = <strong className="font-semibold">{node}</strong>;
              } else if (w.italic) {
                node = <em style={{ color: "var(--brand-muted)" }}>{node}</em>;
              }
              return <span key={i}>{node} </span>;
            })}
          </motion.p>
        </motion.header>

        <div className="mt-14 flex flex-col gap-14">
          <Section
            heading="platforms"
            shouldReduce={shouldReduce}
            revealOnMount
          >
            <div className="flex flex-col gap-11">
              {donations.map((donation) => (
                <div key={donation.name}>
                  <HeadRow
                    title={
                      <UnderlineLink href={donation.url}>
                        <span style={{ color: "var(--brand-ink)" }}>
                          {donation.name}
                        </span>
                      </UnderlineLink>
                    }
                    subtitle={donation.subtitle}
                    right={
                      <span style={{ color: "var(--brand-muted)" }}>
                        {donation.type}
                      </span>
                    }
                  />
                  <p
                    className="mt-3 text-sm"
                    style={{
                      color: "var(--brand-muted)",
                      lineHeight: 1.65,
                      maxWidth: "62ch",
                    }}
                  >
                    {donation.description}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer
        className="flex flex-col items-center gap-3 px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] select-none sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:pb-10"
        style={{ color: "var(--brand-muted)" }}
      >
        <span className="text-sm">izmir, türkiye</span>
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
