"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Cursor } from "@/components/Cursor";

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

// giant name rises into a mask.
const nameRise: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { ...spring } },
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

// ─── Content ────────────────────────────────────────────────────────────────

// intro words — bold = ink emphasis, italic = muted serif, accent = sensity link
interface Word {
  text: string;
  bold?: boolean;
  italic?: boolean;
  accent?: boolean;
}

const introWords: Word[] = [
  { text: "full-stack" },
  { text: "engineer" },
  { text: "at" },
  { text: "sensity.ai", accent: true },
  { text: "—" },
  { text: "building" },
  { text: "detection" },
  { text: "for" },
  { text: "deepfakes", bold: true },
  { text: "&", bold: true },
  { text: "ai-generated", bold: true },
  { text: "media.", bold: true },
  { text: "off" },
  { text: "the" },
  { text: "clock" },
  { text: "i" },
  { text: "co-lead" },
  { text: "engineering" },
  { text: "for" },
  { text: "gdg" },
  { text: "on" },
  { text: "campus" },
  { text: "yaşar" },
  { text: "and" },
  { text: "maintain" },
  { text: "open-source" },
  { text: "tools" },
  { text: "with" },
  { text: "54k+" },
  { text: "combined" },
  { text: "downloads.", bold: true },
  { text: "coding", italic: true },
  { text: "since", italic: true },
  { text: "12,", italic: true },
  { text: "still", italic: true },
  { text: "chasing", italic: true },
  { text: "the", italic: true },
  { text: "same", italic: true },
  { text: "feeling.", italic: true },
];

interface Job {
  company: string;
  companyHref?: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

const experience: Job[] = [
  {
    company: "Sensity AI",
    companyHref: "https://www.sensity.ai",
    role: "full-stack engineer",
    period: "aug 2025 – present",
    location: "remote (eu)",
    bullets: [
      "ship full-stack features across FastAPI microservices and a React & Vue frontend",
      "help migrate legacy Django services onto the modern FastAPI stack",
      "build internal review platforms, developer-facing tooling, and integration tests",
      "review pull requests across both frontend and backend",
    ],
  },
  {
    company: "Sensity AI",
    companyHref: "https://www.sensity.ai",
    role: "backend intern",
    period: "mar 2025 – aug 2025",
    location: "remote (eu)",
    bullets: [
      "five-month backend internship focused on FastAPI microservices; converted to full-time engineering",
    ],
  },
  {
    company: "GDG on Campus Yaşar University",
    companyHref: "https://www.gdgoncampusyu.com/",
    role: "software team, core member",
    period: "sep 2024 – present",
    location: "izmir",
    bullets: [
      "co-lead a six-engineer software team; own architecture and task distribution alongside the team lead",
      "designed the monorepo from scratch: 4 FastAPI microservices (user, form, mail, event) and 3 React frontends",
      "defined team conventions: tooling (uv, bun, Ruff, Biome), directory structure, git workflow, conventional commits, squash-merge policy",
      "break initiatives into issues, distribute tasks, review pull requests, mentor contributors",
      "stack: Python 3.14, FastAPI, Motor (MongoDB), React 19, TypeScript, Vite, TailwindCSS",
    ],
  },
];

interface Project {
  name: string;
  subtitle: string;
  stats?: string;
  description: string;
  href?: string;
}

const projects: Project[] = [
  {
    name: "Tamga",
    subtitle: "open-source python logging library",
    stats: "24k+ downloads on pypi · 71 stars",
    description:
      "colorful tailwind-inspired console output, file/json logging with rotation, sqlite and mongodb integration, and email notifications for critical logs — used across personal projects and in production at gdg yaşar.",
    href: "https://github.com/dogukanurker/tamga",
  },
  {
    name: "FlaskBlog",
    subtitle: "full-stack blogging platform",
    stats: "190 stars · 78 forks",
    description:
      "self-hostable flask blog with authentication, post management, and a responsive ui; adopted for real-world deployments.",
    href: "https://github.com/dogukanurker/flaskBlog",
  },
  {
    name: "BenchKit",
    subtitle: "cli tool for benchmarking local llms",
    description:
      "ran 30+ open-weight models from 9 families on a single rtx 3060 12gb and published a public humaneval leaderboard — built for people running llms at home on constrained gpus.",
    href: "https://github.com/dogukanurker/benchkit",
  },
  {
    name: "DogiZed",
    subtitle: "theme for the zed editor",
    stats: "30k+ downloads on the zed marketplace",
    description:
      "minimalist dark/light dual theme with pure black and white backgrounds and vibrant syntax.",
    href: "https://github.com/dogukanurker/dogized",
  },
  {
    name: "Kira",
    subtitle: "self-hosted personal assistant",
    description:
      'telegram frontend, a local 14b llm via ollama, running on my homeserver — designed around a "dumb llm, smart tooling" architecture: the model only classifies intent while every action, api call, and scheduled task runs in python.',
  },
];

const skills: { term: string; def: string }[] = [
  { term: "languages", def: "python, typescript, javascript, html, css" },
  {
    term: "backend",
    def: "fastapi, flask, django, motor, pydantic, async/await patterns",
  },
  { term: "frontend", def: "react 19, vue, typescript, vite, tailwindcss, shadcn" },
  {
    term: "ai / ml",
    def: "ollama, local llm deployment, prompt engineering, benchmarking, pytorch",
  },
  { term: "infrastructure", def: "docker, tailscale, makefile, systemd, debian" },
  { term: "databases", def: "mongodb, sqlite" },
  { term: "tooling", def: "git, uv, bun, ruff, biome, zed, claude code" },
];

const contacts = [
  { label: "dogukanurker@icloud.com", href: "mailto:dogukanurker@icloud.com" },
  { label: "github.com/dogukanurker", href: "https://github.com/dogukanurker" },
  { label: "twitter.com/dogukanurker", href: "https://twitter.com/dogukanurker" },
  {
    label: "linkedin.com/in/dogukanurker",
    href: "https://linkedin.com/in/dogukanurker",
  },
];

// ─── Reusable section wrapper ───────────────────────────────────────────────

function Section({
  heading,
  meta,
  children,
  shouldReduce,
}: {
  heading: string;
  meta?: string;
  children: React.ReactNode;
  shouldReduce: boolean | null;
}) {
  return (
    <motion.section
      className="cv-section"
      initial={shouldReduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      variants={sectionReveal}
    >
      <hr
        className="cv-rule"
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
  const shouldReduce = useReducedMotion();

  const print = () => window.print();

  return (
    <>
      <style>{printStyles}</style>

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
          className="cv-chrome fixed left-0 right-0 top-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 md:px-10 md:py-5 select-none"
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
              <SensityLink className="text-sm" />
            </span>
          </div>
          <div className="flex items-center gap-6">
            <UnderlineLink href="/">home</UnderlineLink>
            <UnderlineLink onClick={print}>print</UnderlineLink>
          </div>
          {/* mobile role subtitle on a second row */}
          <div
            className="mt-1 flex w-full items-center gap-1 text-xs leading-relaxed tracking-wide md:hidden"
            style={{ color: "var(--brand-muted)" }}
          >
            <span>full-stack engineer @</span>
            <SensityLink className="text-xs" />
          </div>
        </motion.nav>

        {/* ── Document ─────────────────────────────────────────────────── */}
        <div className="cv-doc mx-auto max-w-2xl px-6 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-32 sm:px-10 sm:pt-40">
          {/* Header / letterhead */}
          <motion.header
            initial={shouldReduce ? "visible" : "hidden"}
            animate="visible"
            variants={containerVariants}
          >
            <div className="overflow-hidden pb-1">
              <motion.h1
                variants={shouldReduce ? fadeUp : nameRise}
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
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <p
                  className="text-base"
                  style={{ color: "var(--brand-ink)" }}
                >
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
                      <SensityLink className="align-baseline" />{" "}
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
                  node = (
                    <em style={{ color: "var(--brand-muted)" }}>{node}</em>
                  );
                }
                return <span key={i}>{node} </span>;
              })}
            </motion.p>
          </motion.header>

          <div className="mt-14 flex flex-col gap-14">
            {/* Experience */}
            <Section heading="experience" shouldReduce={shouldReduce}>
              <div className="flex flex-col gap-11">
                {experience.map((job) => (
                  <div key={`${job.company}-${job.role}`} className="cv-item">
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
              meta="a handful from 105+ things i've built since i was 13"
              shouldReduce={shouldReduce}
            >
              <div className="flex flex-col gap-9">
                {projects.map((project) => (
                  <div key={project.name} className="cv-item">
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
                        project.stats ? (
                          <span style={{ color: "var(--brand-dim)" }}>
                            {project.stats}
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
                ))}
              </div>
            </Section>

            {/* Skills */}
            <Section heading="skills" shouldReduce={shouldReduce}>
              <dl className="cv-skills grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[140px_1fr]">
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
              <div className="cv-item">
                <HeadRow
                  title="Yaşar University"
                  subtitle="b.sc. software engineering"
                  right={
                    <span style={{ color: "var(--brand-muted)" }}>
                      expected jun 2028
                    </span>
                  }
                />
              </div>
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
          className="cv-chrome flex flex-col items-center gap-3 px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] select-none sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:pb-10"
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
    </>
  );
}

// ─── Print / PDF ────────────────────────────────────────────────────────────
// Faithful to the brand on paper: cream field, warm ink type, Fraunces headings.
// Site chrome (nav, footer, cursor) is dropped; items never split across pages.

const printStyles = `
  @media print {
    @page {
      margin: 14mm;
      size: A4;
    }

    html, body {
      background: var(--brand-cream) !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .cv-root {
      min-height: 0 !important;
    }

    .cv-chrome { display: none !important; }

    .cv-doc {
      max-width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .cv-name {
      font-size: 2.4rem !important;
    }

    .cv-intro {
      font-size: 1.05rem !important;
      max-width: 100% !important;
      line-height: 1.45 !important;
    }

    .cv-section { break-inside: avoid; }
    .cv-item { break-inside: avoid; }

    /* keep words at full opacity regardless of animation state */
    .cv-intro span,
    .cv-intro strong,
    .cv-intro em { opacity: 1 !important; }

    /* links read as plain ink on paper */
    a { color: var(--brand-ink) !important; }
    a span[aria-hidden] { display: none !important; }

    .mt-14 { margin-top: 1.75rem !important; }
    .gap-14 { gap: 1.75rem !important; }
  }
`;
