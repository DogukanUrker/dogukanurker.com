"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Cursor } from "@/components/Cursor";
import type { Contributor, Repo } from "@/lib/fetchRepos";

// ─── Motion constants (matching landing/CV/projects pages) ──────────────────

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

// ─── ProjectDetailsClient ───────────────────────────────────────────────────

interface ProjectDetailsClientProps {
  repo: Repo;
  languages: Record<string, number>;
  contributors: Contributor[];
}

export function ProjectDetailsClient({
  repo,
  languages,
  contributors,
}: ProjectDetailsClientProps) {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const shouldReduce = useReducedMotion();

  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  const lastUpdated = new Date(repo.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        <motion.div
          initial={shouldReduce ? "visible" : "hidden"}
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-12"
        >
          {/* Back & Donate Actions */}
          <motion.div
            variants={fadeUp}
            className="flex justify-between items-center"
          >
            <UnderlineLink href="/projects">back to projects</UnderlineLink>
            <UnderlineLink href="/donate">support</UnderlineLink>
          </motion.div>

          {/* Header */}
          <motion.header variants={fadeUp} className="space-y-4">
            <h1
              className="font-serif tracking-tighter lowercase"
              style={{
                fontSize: "clamp(44px, 10vw, 84px)",
                fontWeight: 400,
                lineHeight: 0.95,
                color: "var(--brand-ink)",
                fontOpticalSizing: "auto",
                margin: 0,
              }}
            >
              {repo.name.toLowerCase()}
            </h1>
            {repo.description && (
              <p
                className="font-serif lowercase"
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  lineHeight: 1.3,
                  fontWeight: 340,
                  color: "var(--brand-muted)",
                  fontOpticalSizing: "auto",
                  maxWidth: "32ch",
                  margin: "1.5rem 0 0 0",
                }}
              >
                {repo.description.toLowerCase()}
              </p>
            )}
          </motion.header>

          {/* Repo Info Grid */}
          <motion.section variants={fadeUp} className="space-y-6">
            <hr
              style={{
                border: "none",
                borderTop: "1px solid var(--brand-border)",
                margin: 0,
              }}
            />
            <dl className="grid grid-cols-[120px_1fr] gap-x-8 gap-y-3">
              <div className="contents">
                <dt
                  className="text-sm tracking-wide lowercase"
                  style={{ color: "var(--brand-dim)" }}
                >
                  repository
                </dt>
                <dd className="text-sm lowercase">
                  <UnderlineLink href={repo.html_url}>
                    view on github ↗
                  </UnderlineLink>
                </dd>
              </div>
              <div className="contents">
                <dt
                  className="text-sm tracking-wide lowercase"
                  style={{ color: "var(--brand-dim)" }}
                >
                  stars
                </dt>
                <dd
                  className="text-sm lowercase"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {repo.stargazers_count}
                </dd>
              </div>
              <div className="contents">
                <dt
                  className="text-sm tracking-wide lowercase"
                  style={{ color: "var(--brand-dim)" }}
                >
                  forks
                </dt>
                <dd
                  className="text-sm lowercase"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {repo.forks}
                </dd>
              </div>
              <div className="contents">
                <dt
                  className="text-sm tracking-wide lowercase"
                  style={{ color: "var(--brand-dim)" }}
                >
                  license
                </dt>
                <dd
                  className="text-sm lowercase"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {repo.license ? repo.license.spdx_id.toLowerCase() : "none"}
                </dd>
              </div>
              <div className="contents">
                <dt
                  className="text-sm tracking-wide lowercase"
                  style={{ color: "var(--brand-dim)" }}
                >
                  updated
                </dt>
                <dd
                  className="text-sm lowercase"
                  style={{ color: "var(--brand-ink)" }}
                >
                  {lastUpdated.toLowerCase()}
                </dd>
              </div>
            </dl>
          </motion.section>

          {/* Languages Section */}
          {Object.keys(languages).length > 0 && (
            <motion.section variants={fadeUp} className="space-y-6">
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--brand-border)",
                  margin: 0,
                }}
              />
              <h2
                className="font-serif lowercase"
                style={{
                  fontSize: "clamp(22px, 3.4vw, 30px)",
                  fontWeight: 420,
                  lineHeight: 1.1,
                  color: "var(--brand-ink)",
                  fontOpticalSizing: "auto",
                  margin: 0,
                }}
              >
                languages
              </h2>
              <dl className="grid grid-cols-[120px_1fr] gap-x-8 gap-y-3">
                {Object.entries(languages)
                  .sort(([, a], [, b]) => b - a)
                  .map(([lang, bytes]) => {
                    const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                    return (
                      <div key={lang} className="contents">
                        <dt
                          className="text-sm tracking-wide lowercase"
                          style={{ color: "var(--brand-dim)" }}
                        >
                          {lang.toLowerCase()}
                        </dt>
                        <dd
                          className="text-sm lowercase"
                          style={{ color: "var(--brand-muted)" }}
                        >
                          {percentage}%{" "}
                          <span className="text-[var(--brand-dim)]">
                            ({(bytes / 1024).toFixed(1)} kb)
                          </span>
                        </dd>
                      </div>
                    );
                  })}
              </dl>
            </motion.section>
          )}

          {/* Contributors Section */}
          {contributors.length > 0 && (
            <motion.section variants={fadeUp} className="space-y-6">
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--brand-border)",
                  margin: 0,
                }}
              />
              <h2
                className="font-serif lowercase"
                style={{
                  fontSize: "clamp(22px, 3.4vw, 30px)",
                  fontWeight: 420,
                  lineHeight: 1.1,
                  color: "var(--brand-ink)",
                  fontOpticalSizing: "auto",
                  margin: 0,
                }}
              >
                contributors
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contributors.map((contributor) => (
                  <a
                    key={contributor.login}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="flex items-center gap-3 text-sm text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors group"
                  >
                    {/* biome-ignore lint/performance/noImgElement: intentional avatar <img> */}
                    <img
                      src={contributor.avatar_url}
                      alt={contributor.login}
                      className="w-8 h-8 rounded-full grayscale transition-[filter,transform] duration-300 group-hover:grayscale-0 group-hover:scale-105 border border-[var(--brand-border)]"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium tracking-tight lowercase text-[var(--brand-ink)] truncate">
                        {contributor.login.toLowerCase()}
                      </span>
                      <span className="text-xs lowercase text-[var(--brand-dim)]">
                        {contributor.contributions}{" "}
                        {contributor.contributions === 1 ? "commit" : "commits"}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.section>
          )}
        </motion.div>
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
