// Shared CV content + helpers. Isomorphic (no React, no node-only imports) so it
// can be consumed by both the client page and the server-side PDF renderer.

export const profile = {
  name: "Doğukan Ürker",
  role: "full-stack engineer",
  location: "izmir, türkiye",
};

// intro words — bold = ink emphasis, italic = muted serif, accent = sensity link
export interface Word {
  text: string;
  bold?: boolean;
  italic?: boolean;
  accent?: boolean;
}

export const introWords: Word[] = [
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

export interface Job {
  company: string;
  companyHref?: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
}

export const experience: Job[] = [
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

export interface Project {
  name: string;
  subtitle: string;
  description: string;
  href?: string;
  // github repo name (lowercase) — live stars/forks are pulled from the api.
  repo?: string;
  showForks?: boolean;
  // non-github stat, e.g. package-registry downloads.
  extra?: string;
  // shown until the api responds (and if it ever fails).
  fallbackStars?: number;
  fallbackForks?: number;
}

export const projects: Project[] = [
  {
    name: "Tamga",
    subtitle: "open-source python logging library",
    description:
      "colorful tailwind-inspired console output, file/json logging with rotation, sqlite and mongodb integration, and email notifications for critical logs — used across personal projects and in production at gdg yaşar.",
    href: "https://github.com/dogukanurker/tamga",
    repo: "tamga",
    extra: "24k+ downloads on pypi",
    fallbackStars: 71,
  },
  {
    name: "FlaskBlog",
    subtitle: "full-stack blogging platform",
    description:
      "self-hostable flask blog with authentication, post management, and a responsive ui; adopted for real-world deployments.",
    href: "https://github.com/dogukanurker/flaskBlog",
    repo: "flaskblog",
    showForks: true,
    fallbackStars: 190,
    fallbackForks: 78,
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
    description:
      "minimalist dark/light dual theme with pure black and white backgrounds and vibrant syntax.",
    href: "https://github.com/dogukanurker/dogized",
    extra: "30k+ downloads on the zed marketplace",
  },
  {
    name: "Kira",
    subtitle: "self-hosted personal assistant",
    description:
      'telegram frontend, a local 14b llm via ollama, running on my homeserver — designed around a "dumb llm, smart tooling" architecture: the model only classifies intent while every action, api call, and scheduled task runs in python.',
  },
];

export const skills: { term: string; def: string }[] = [
  { term: "languages", def: "python, typescript, javascript, html, css" },
  {
    term: "backend",
    def: "fastapi, flask, django, motor, pydantic, async/await patterns",
  },
  {
    term: "frontend",
    def: "react 19, vue, typescript, vite, tailwindcss, shadcn",
  },
  {
    term: "ai / ml",
    def: "ollama, local llm deployment, prompt engineering, benchmarking, pytorch",
  },
  {
    term: "infrastructure",
    def: "docker, tailscale, makefile, systemd, debian",
  },
  { term: "databases", def: "mongodb, sqlite" },
  { term: "tooling", def: "git, uv, bun, ruff, biome, zed, claude code" },
];

export const education = {
  school: "Yaşar University",
  degree: "b.sc. software engineering",
  period: "expected jun 2028",
};

export const languages: { name: string; level: string }[] = [
  { name: "turkish", level: "native" },
  { name: "english", level: "c1" },
];

export const contacts = [
  { label: "dogukanurker@icloud.com", href: "mailto:dogukanurker@icloud.com" },
  { label: "github.com/dogukanurker", href: "https://github.com/dogukanurker" },
  {
    label: "twitter.com/dogukanurker",
    href: "https://twitter.com/dogukanurker",
  },
  {
    label: "linkedin.com/in/dogukanurker",
    href: "https://linkedin.com/in/dogukanurker",
  },
];

// ─── GitHub stats ───────────────────────────────────────────────────────────

const GITHUB_USER = "dogukanurker";

// live repo metrics keyed by lowercased repo name.
export type RepoStats = { stars: number; forks: number };

// build the "extra · stars · forks" line, preferring live numbers and falling
// back to the static ones so the row is never empty or jumps to nothing.
export function statsFor(
  p: Project,
  live: Record<string, RepoStats> | null,
): string | null {
  const parts: string[] = [];
  if (p.extra) parts.push(p.extra);
  if (p.repo) {
    const s = live?.[p.repo];
    const stars = s ? s.stars : p.fallbackStars;
    const forks = s ? s.forks : p.fallbackForks;
    if (typeof stars === "number") {
      parts.push(`${stars.toLocaleString("en-US")} stars`);
    }
    if (p.showForks && typeof forks === "number") {
      parts.push(`${forks.toLocaleString("en-US")} forks`);
    }
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

// fetch stars/forks for all public repos. Works on client and server; returns an
// empty map on any failure so callers fall back to the static numbers.
export async function fetchRepoStats(
  token?: string,
): Promise<Record<string, RepoStats>> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`,
      {
        headers: token
          ? { Authorization: `Bearer ${token.trim()}` }
          : undefined,
        // revalidate hourly on the server; ignored on the client.
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return {};
    const data: unknown = await res.json();
    if (!Array.isArray(data)) return {};
    const map: Record<string, RepoStats> = {};
    for (const r of data as {
      name?: string;
      stargazers_count?: number;
      forks_count?: number;
    }[]) {
      if (r && typeof r.name === "string") {
        map[r.name.toLowerCase()] = {
          stars: r.stargazers_count ?? 0,
          forks: r.forks_count ?? 0,
        };
      }
    }
    return map;
  } catch {
    return {};
  }
}
