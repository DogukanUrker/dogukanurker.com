"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Cursor } from "@/components/Cursor";
import type { Repo } from "@/lib/fetchRepos";

// ─── Motion constants (matching landing/CV pages) ──────────────────────────

const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const spring = { type: "spring" as const, stiffness: 100, damping: 22 };

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

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

// ─── Shared UnderlineLink ───────────────────────────────────────────────────

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

// ─── ProjectsClient ─────────────────────────────────────────────────────────

interface ProjectsClientProps {
  repos: Repo[];
}

export function ProjectsClient({ repos }: ProjectsClientProps) {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const shouldReduce = useReducedMotion();

  const totalStars = repos.reduce(
    (acc, repo) => acc + repo.stargazers_count,
    0,
  );
  const totalForks = repos.reduce((acc, repo) => acc + repo.forks, 0);

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
          >
            projects
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 text-sm tracking-wide lowercase"
            style={{ color: "var(--brand-muted)" }}
          >
            a collection of open-source work &mdash; {totalStars} stars and{" "}
            {totalForks} forks across all repositories, with more than 60k
            downloads overall
          </motion.p>
        </motion.header>

        {/* ── Projects List ────────────────────────────────────────────── */}
        <div className="mt-14 flex flex-col gap-14">
          <motion.div
            className="flex flex-col gap-10"
            initial={shouldReduce ? "visible" : "hidden"}
            animate="visible"
            variants={containerVariants}
          >
            {repos.map((repo) => (
              <motion.div key={repo.id} variants={fadeUp} className="group">
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid var(--brand-border)",
                    margin: "0 0 28px",
                  }}
                />
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <h2 className="text-base font-medium tracking-tight">
                      <UnderlineLink href={`/${repo.name.toLowerCase()}`}>
                        <span style={{ color: "var(--brand-ink)" }}>
                          {repo.name.toLowerCase()}
                        </span>
                      </UnderlineLink>
                    </h2>
                    {repo.language && (
                      <p
                        className="text-xs mt-1 lowercase"
                        style={{ color: "var(--brand-dim)" }}
                      >
                        {repo.language.toLowerCase()}
                      </p>
                    )}
                  </div>
                  <div
                    className="shrink-0 text-sm tracking-wide sm:text-right mt-1 sm:mt-0 lowercase"
                    style={{ color: "var(--brand-dim)" }}
                  >
                    <span>
                      {repo.stargazers_count}{" "}
                      {repo.stargazers_count === 1 ? "star" : "stars"}
                    </span>
                    <span className="mx-2 select-none">&middot;</span>
                    <span>
                      {repo.forks} {repo.forks === 1 ? "fork" : "forks"}
                    </span>
                  </div>
                </div>
                {repo.description && (
                  <p
                    className="mt-3 text-sm lowercase"
                    style={{
                      color: "var(--brand-muted)",
                      lineHeight: 1.65,
                      maxWidth: "62ch",
                    }}
                  >
                    {repo.description.toLowerCase()}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────── */}
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
