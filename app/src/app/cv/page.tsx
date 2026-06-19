"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Cursor } from "@/components/Cursor";
import {
  contacts,
  experience,
  introWords,
  projects,
  skills,
  statsFor,
  type RepoStats,
} from "@/lib/cv";

// ─── Motion constants (shared with the landing page) ────────────────────────

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

// ─── Primary brand link: the one accent moment (sensity.ai) ─────────────────

function SensityLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://sensity.ai"
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      className={
        "group relative inline-flex items-center gap-[0.15em] font-semibold " +
        "text-[var(--brand-ink)] hover:text-[#373CE0] transition-colors duration-300 " +
        className
      }
    >
      <svg
        width="0.75em"
        height="0.75em"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="inline-block relative top-[0.08em]"
        aria-hidden
      >
        <path
          d="M122 130H71.5C70.67 130 70 129.33 70 128.5V77.9999C70 73.5799 73.58 69.9999 78 69.9999H128.5C129.33 69.9999 130 70.6699 130 71.4999V122C130 126.42 126.42 130 122 130Z"
          fill="currentColor"
        />
        <path
          d="M38 140H8C3.58 140 0 136.42 0 132V7.99994C0 3.57994 3.58 -6.10352e-05 8 -6.10352e-05H132C136.42 -6.10352e-05 140 3.57994 140 7.99994V37.9999C140 39.0999 139.1 39.9999 138 39.9999H44C41.79 39.9999 40 41.7899 40 43.9999V138C40 139.1 39.1 140 38 140Z"
          fill="currentColor"
        />
        <path
          d="M162 59.9999H192C196.42 59.9999 200 63.5799 200 67.9999V192C200 196.42 196.42 200 192 200H68C63.58 200 60 196.42 60 192V162C60 160.9 60.9 160 62 160H156C158.21 160 160 158.21 160 156V61.9999C160 60.8999 160.89 59.9999 162 59.9999Z"
          fill="currentColor"
        />
      </svg>
      <span>sensity.ai</span>
    </a>
  );
}

// ─── Download CV button ─────────────────────────────────────────────────────
// Fetches the server-rendered pdf as a blob and saves it directly — the user
// never leaves the page. The label crossfades through its states with the same
// spring/word-reveal motion as the rest of the site, and the signature
// underline grows left-to-right as a progress indicator while it works.

type DownloadState = "idle" | "preparing" | "saved";

const downloadLabels: Record<DownloadState, string> = {
  idle: "download",
  preparing: "preparing…",
  saved: "saved",
};

function DownloadButton() {
  const shouldReduce = useReducedMotion();
  const [state, setState] = useState<DownloadState>("idle");
  const [hover, setHover] = useState(false);

  const handleDownload = async () => {
    if (state !== "idle") return;
    setState("preparing");
    try {
      const res = await fetch("/cv/pdf");
      if (!res.ok) throw new Error("pdf request failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dogukan-urker-cv.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState("saved");
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("idle");
    }
  };

  // underline doubles as a progress bar: fills while preparing, completes on
  // success, otherwise follows hover/focus like every other link.
  const underlineWidth =
    state === "preparing" ? "90%" : state === "saved" || hover ? "100%" : "0%";

  return (
    <button
      type="button"
      onClick={handleDownload}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      data-cursor="link"
      aria-label="download cv as pdf"
      aria-busy={state === "preparing"}
      className="group relative inline-flex items-center text-sm tracking-wide transition-colors duration-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2 bg-transparent border-none p-0 cursor-pointer"
      style={{
        color:
          state === "idle" && !hover
            ? "var(--brand-muted)"
            : "var(--brand-ink)",
      }}
    >
      <span className="relative inline-block whitespace-nowrap">
        {/* invisible sizer: reserves the widest label's width so the
            neighbouring nav link never shifts as the label changes */}
        <span aria-hidden className="invisible">
          {downloadLabels.preparing}
        </span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state}
            className="absolute left-0 top-0 inline-block whitespace-nowrap"
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -7 }}
            transition={{ duration: 0.28, ease: expo }}
          >
            {downloadLabels[state]}
            <motion.span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px bg-[var(--brand-ink)]"
              initial={false}
              animate={{ width: underlineWidth }}
              transition={
                shouldReduce
                  ? { duration: 0 }
                  : state === "preparing"
                    ? { duration: 1.4, ease: expo }
                    : { duration: 0.3, ease: "easeOut" }
              }
            />
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
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
  // reveal immediately on load instead of waiting for scroll — used for the
  // first section so mobile users see there's more below the fold.
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function CVPage() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const [repoStats, setRepoStats] = useState<Record<string, RepoStats> | null>(
    null,
  );
  const shouldReduce = useReducedMotion();

  // pull live stars/forks from github so the on-page numbers stay current; the
  // static fallbacks render until this resolves, and on failure we keep them.
  useEffect(() => {
    let active = true;
    fetch("/api/github/stats")
      .then((r) => (r.ok ? r.json() : {}))
      .then((map) => {
        if (active) setRepoStats(map);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main
      className={`cv-root relative min-h-screen w-full overflow-x-hidden${
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
          <DownloadButton />
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
        {/* Header / letterhead */}
        <motion.header
          initial={shouldReduce ? "visible" : "hidden"}
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            variants={fadeUp}
            className="cv-name font-serif tracking-tighter"
            style={{
              fontSize: "clamp(40px, 11vw, 92px)",
              fontWeight: 400,
              lineHeight: 0.95,
              color: "var(--brand-ink)",
              fontOpticalSizing: "auto",
              margin: 0,
            }}
          >
            Doğukan Ürker
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
          >
            <div>
              <p className="text-base" style={{ color: "var(--brand-ink)" }}>
                full-stack engineer
              </p>
              <p
                className="text-sm tracking-wide"
                style={{ color: "var(--brand-muted)" }}
              >
                izmir, türkiye
              </p>
            </div>
            <nav
              aria-label="contact links"
              className="flex flex-col gap-1 sm:items-end"
            >
              {contacts.map((c) => (
                <UnderlineLink key={c.href} href={c.href}>
                  {c.label}
                </UnderlineLink>
              ))}
            </nav>
          </motion.div>

          {/* Intro — the signature word-by-word reveal */}
          <motion.p
            variants={shouldReduce ? fadeUp : wordContainer}
            className="cv-intro mt-9 font-serif"
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
              if (w.accent) {
                return (
                  <span key={i}>
                    <motion.span
                      variants={shouldReduce ? undefined : wordItem}
                      className="inline-block align-baseline"
                    >
                      <SensityLink />
                    </motion.span>{" "}
                  </span>
                );
              }
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
          {/* Experience — revealed on load so mobile users see content below
              the name/about and know to keep scrolling. */}
          <Section
            heading="experience"
            shouldReduce={shouldReduce}
            revealOnMount
          >
            <div className="flex flex-col gap-11">
              {experience.map((job) => (
                <div key={`${job.company}-${job.role}`}>
                  <HeadRow
                    title={
                      job.companyHref ? (
                        <UnderlineLink href={job.companyHref}>
                          <span style={{ color: "var(--brand-ink)" }}>
                            {job.company}
                          </span>
                        </UnderlineLink>
                      ) : (
                        job.company
                      )
                    }
                    subtitle={job.role}
                    right={
                      <div style={{ color: "var(--brand-muted)" }}>
                        <p>{job.period}</p>
                        <p style={{ color: "var(--brand-dim)" }}>
                          {job.location}
                        </p>
                      </div>
                    }
                  />
                  <ul className="mt-3 flex flex-col gap-2 pl-0">
                    {job.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex gap-3 text-sm"
                        style={{
                          color: "var(--brand-muted)",
                          lineHeight: 1.65,
                        }}
                      >
                        <span
                          aria-hidden
                          className="select-none"
                          style={{ color: "var(--brand-dim)" }}
                        >
                          —
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          {/* Selected projects */}
          <Section
            heading="selected projects"
            meta="a handful from 105+ things i've built since i was 12"
            shouldReduce={shouldReduce}
          >
            <div className="flex flex-col gap-9">
              {projects.map((project) => {
                const stat = statsFor(project, repoStats);
                return (
                  <div key={project.name}>
                    <HeadRow
                      title={
                        project.href ? (
                          <UnderlineLink href={project.href}>
                            <span style={{ color: "var(--brand-ink)" }}>
                              {project.name}
                            </span>
                          </UnderlineLink>
                        ) : (
                          project.name
                        )
                      }
                      subtitle={project.subtitle}
                      right={
                        stat ? (
                          <span style={{ color: "var(--brand-dim)" }}>
                            {stat}
                          </span>
                        ) : undefined
                      }
                    />
                    <p
                      className="mt-2.5 text-sm"
                      style={{
                        color: "var(--brand-muted)",
                        lineHeight: 1.65,
                        maxWidth: "62ch",
                      }}
                    >
                      {project.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* Skills */}
          <Section heading="skills" shouldReduce={shouldReduce}>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[140px_1fr]">
              {skills.map(({ term, def }) => (
                <div key={term} className="contents">
                  <dt
                    className="text-sm tracking-wide"
                    style={{ color: "var(--brand-dim)" }}
                  >
                    {term}
                  </dt>
                  <dd
                    className="text-sm"
                    style={{
                      color: "var(--brand-muted)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {def}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          {/* Education */}
          <Section heading="education" shouldReduce={shouldReduce}>
            <HeadRow
              title="Yaşar University"
              subtitle="b.sc. software engineering"
              right={
                <span style={{ color: "var(--brand-muted)" }}>
                  expected jun 2028
                </span>
              }
            />
          </Section>

          {/* Languages */}
          <Section heading="languages" shouldReduce={shouldReduce}>
            <p className="text-sm" style={{ color: "var(--brand-muted)" }}>
              turkish{" "}
              <span style={{ color: "var(--brand-dim)" }}>(native)</span>{" "}
              &middot; english{" "}
              <span style={{ color: "var(--brand-dim)" }}>(c1)</span>
            </p>
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
