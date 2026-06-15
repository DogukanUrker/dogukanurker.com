"use client";

import { Fragment, useEffect, useState } from "react";

const cvStyles = `
  .cv-page {
    --cv-bg: var(--brand-cream);
    --cv-bg-subtle: var(--brand-cream-subtle);
    --cv-fg: var(--brand-ink);
    --cv-fg-muted: var(--brand-muted);
    --cv-fg-dim: var(--brand-dim);
    --cv-accent: var(--brand-ink);
    --cv-border: var(--brand-border);
    background-color: var(--cv-bg);
    color: var(--cv-fg);
    min-height: 100vh;
    padding: 80px 24px 120px;
  }

  .cv-container {
    max-width: 720px;
    margin: 0 auto;
  }

  .cv-name {
    font-family: var(--font-fraunces), Georgia, serif;
    font-style: italic;
    font-size: clamp(2.8rem, 8vw, 4.5rem);
    font-weight: 400;
    line-height: 1.05;
    color: var(--cv-fg);
    letter-spacing: -0.02em;
    margin: 0 0 24px;
  }

  .cv-section-heading {
    font-family: var(--font-fraunces), Georgia, serif;
    font-size: 1.4rem;
    font-weight: 400;
    color: var(--cv-fg);
    margin: 0 0 32px;
  }

  .cv-divider {
    border: none;
    border-top: 1px solid var(--cv-border);
    margin: 56px 0 36px;
  }

  .cv-mono {
    font-family: var(--font-geist-mono), 'Courier New', Courier, monospace;
    font-size: 12px;
    color: var(--cv-fg-dim);
    line-height: 1.6;
  }

  .cv-link {
    color: var(--cv-fg-muted);
    text-decoration: none;
    transition: color 0.15s ease-out, text-decoration-color 0.15s ease-out;
    text-underline-offset: 3px;
  }

  .cv-link:hover {
    color: var(--cv-accent);
    text-decoration: underline;
    text-decoration-color: var(--cv-accent);
  }

  .cv-link:focus-visible {
    outline: 2px solid var(--cv-accent);
    outline-offset: 3px;
    border-radius: 2px;
  }

  .cv-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    flex-wrap: wrap;
  }

  .cv-dates {
    text-align: right;
    flex-shrink: 0;
  }

  @media (max-width: 560px) {
    .cv-name { font-size: 2.5rem; }
    .cv-dates { text-align: left; }
  }

  .cv-chip {
    font-family: var(--font-geist-mono), 'Courier New', Courier, monospace;
    font-size: 11px;
    color: var(--cv-fg-dim);
    background: var(--cv-bg-subtle);
    border: 1px solid var(--cv-border);
    padding: 3px 8px;
    border-radius: 3px;
    white-space: nowrap;
  }

  .cv-export-btn {
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: var(--cv-accent);
    color: var(--brand-cream);
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--font-geist-mono), 'Courier New', Courier, monospace;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: opacity 0.15s ease-out;
  }

  .cv-export-btn:hover { opacity: 0.85; }

  .cv-export-btn:focus-visible {
    outline: 2px solid var(--cv-accent);
    outline-offset: 3px;
    border-radius: 4px;
  }

  .cv-skills-grid {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 12px 20px;
  }

  @media (max-width: 420px) {
    .cv-skills-grid {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }

  @media print {
    .cv-page {
      --cv-accent: #111111;
      background-color: #ffffff !important;
      color: #111111 !important;
      padding: 0 !important;
      min-height: unset;
    }

    .cv-container {
      max-width: 100% !important;
      padding: 24px 40px !important;
    }

    .cv-name {
      font-family: Georgia, 'Times New Roman', serif !important;
      font-size: 2.2rem !important;
      color: #1a1a1a !important;
    }

    .cv-section-heading {
      font-family: Georgia, 'Times New Roman', serif !important;
      font-size: 1rem !important;
      color: #1a1a1a !important;
    }

    .cv-divider {
      border-top-color: #cccccc !important;
      margin: 36px 0 20px !important;
    }

    .cv-mono {
      color: #555555 !important;
    }

    .cv-link {
      color: #333333 !important;
      text-decoration: none !important;
    }

    .cv-chip {
      background: #f0f0f0 !important;
      border-color: #cccccc !important;
      color: #555555 !important;
    }

    .cv-export-btn {
      display: none !important;
    }

    body {
      background: #ffffff !important;
      font-family: Arial, Helvetica, sans-serif !important;
    }

    @page {
      margin: 0;
      size: A4;
    }
  }
`;

const experience = [
  {
    company: "Sensity AI",
    companyHref: "https://www.sensity.ai",
    role: "Full-Stack Engineer",
    period: "Aug 2025 - Present",
    location: "Remote (EU)",
    bullets: [
      "Ship full-stack features across FastAPI microservices and a React & Vue frontend",
      "Contribute to migrating legacy Django services onto the modern FastAPI stack",
      "Work on internal review platforms, developer-facing tooling, and integration testing",
      "Review PRs across both frontend and backend",
    ],
  },
  {
    company: "Sensity AI",
    companyHref: "https://www.sensity.ai",
    role: "Backend Intern",
    period: "Mar 2025 - Aug 2025",
    location: "Remote (EU)",
    bullets: [
      "5-month backend internship focused on FastAPI microservices; converted to full-time engineering.",
    ],
  },
  {
    company: "GDG on Campus Yaşar University",
    companyHref: "https://www.gdgoncampusyu.com/",
    role: "Software Team, Core Member",
    period: "Sep 2024 - Present",
    location: "İzmir",
    bullets: [
      "Co-lead a 6-engineer software team; own architecture and task distribution alongside the team lead",
      "Designed the monorepo from scratch: 4 FastAPI microservices (user, form, mail, event) and 3 React frontends",
      "Defined team conventions: tooling (uv, bun, Ruff, Biome), directory structure, Git workflow, conventional commits, squash-merge policy",
      "Break down initiatives into issues, distribute tasks, review PRs, mentor contributors",
      "Stack: Python 3.14, FastAPI, Motor (MongoDB), React 19, TypeScript, Vite, TailwindCSS",
    ],
  },
];

const projects = [
  {
    name: "Tamga",
    subtitle: "open-source python logging library",
    stats: "24k+ downloads on pypi · 71 stars",
    description:
      "colorful tailwind-inspired console output, file/json logging with rotation, sqlite and mongodb integration, email notifications for critical logs. used across personal projects and in production at gdg yaşar.",
    href: "https://github.com/dogukanurker/tamga",
  },
  {
    name: "FlaskBlog",
    subtitle: "full-stack blogging platform",
    stats: "190 stars · 78 forks",
    description:
      "self-hostable flask blog with authentication, post management, and responsive ui; adopted for real-world deployments.",
    href: "https://github.com/dogukanurker/flaskBlog",
  },
  {
    name: "BenchKit",
    subtitle: "cli tool for benchmarking local llms",
    stats: null,
    description:
      "ran 30+ open-weight models from 9 families on a single rtx 3060 12gb and published a public humaneval leaderboard. built for people running llms at home on constrained gpus.",
    href: "https://github.com/dogukanurker/benchkit",
  },
  {
    name: "DogiZed",
    subtitle: "theme for the zed editor",
    stats: "30k+ downloads on the zed extension marketplace",
    description:
      "minimalist dark/light dual theme with pure black/white backgrounds and vibrant syntax.",
    href: "https://github.com/dogukanurker/dogized",
  },
  {
    name: "Kira",
    subtitle: "self-hosted personal assistant",
    stats: null,
    description:
      'telegram frontend, local 14b llm via ollama, running on my homeserver. designed around a "dumb llm, smart tooling" architecture: the model only classifies intent while every action, api call, and scheduled task runs in python.',
    href: null,
  },
];

const skills = [
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

export default function CVPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Set the html background to cream so mobile Safari's overscroll area
  // matches the page instead of showing the default dark root background.
  useEffect(() => {
    const prev = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = "#f3f1ea";
    return () => {
      document.documentElement.style.backgroundColor = prev;
    };
  }, []);

  return (
    <>
      <style>{cvStyles}</style>
      <main
        className="cv-page"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 600ms ease-out",
        }}
      >
        <div className="cv-container">
          {/* header */}
          <header>
            <h1 className="cv-name">Doğukan Ürker</h1>

            <div
              className="cv-row"
              style={{ marginBottom: "32px", alignItems: "flex-start" }}
            >
              <div>
                <p
                  style={{
                    color: "var(--cv-fg)",
                    fontSize: "1rem",
                    marginBottom: "4px",
                  }}
                >
                  Full-Stack Engineer
                </p>
                <p className="cv-mono">İzmir, Turkey</p>
              </div>

              <nav
                aria-label="contact links"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "4px",
                }}
              >
                {[
                  {
                    label: "github.com/dogukanurker",
                    href: "https://github.com/dogukanurker",
                  },
                  {
                    label: "twitter.com/dogukanurker",
                    href: "https://twitter.com/dogukanurker",
                  },
                  {
                    label: "linkedin.com/in/dogukanurker",
                    href: "https://linkedin.com/in/dogukanurker",
                  },
                  {
                    label: "dogukanurker@icloud.com",
                    href: "mailto:dogukanurker@icloud.com",
                  },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={
                      link.href.startsWith("mailto") ? undefined : "_blank"
                    }
                    rel="noopener noreferrer"
                    className="cv-link cv-mono"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <blockquote
              style={{
                borderLeft: "2px solid var(--cv-accent)",
                paddingLeft: "20px",
                margin: "0",
                color: "var(--cv-fg-muted)",
                fontSize: "0.9375rem",
                lineHeight: "1.75",
                fontStyle: "italic",
              }}
            >
              20-year-old full-stack engineer at Sensity AI, working on deepfake
              and AI-generated content detection. Off the clock, I co-lead
              engineering for GDG on Campus Yaşar&apos;s software team and
              maintain open-source tools with 54k+ combined downloads.
            </blockquote>
          </header>

          {/* experience */}
          <hr className="cv-divider" />
          <section>
            <h2 className="cv-section-heading">Experience</h2>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "44px" }}
            >
              {experience.map((job) => (
                <div key={`${job.company}-${job.role}`}>
                  <div className="cv-row" style={{ marginBottom: "12px" }}>
                    <div>
                      <h3
                        style={{
                          color: "var(--cv-fg)",
                          fontSize: "0.9375rem",
                          fontWeight: 500,
                          marginBottom: "3px",
                        }}
                      >
                        {job.companyHref ? (
                          <a
                            href={job.companyHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cv-link"
                            style={{ color: "var(--cv-fg)" }}
                          >
                            {job.company}
                          </a>
                        ) : (
                          job.company
                        )}
                      </h3>
                      <p
                        style={{
                          color: "var(--cv-fg-muted)",
                          fontSize: "0.875rem",
                        }}
                      >
                        {job.role}
                      </p>
                    </div>
                    <div className="cv-dates">
                      <p className="cv-mono">{job.period}</p>
                      <p className="cv-mono">{job.location}</p>
                    </div>
                  </div>
                  <ul
                    style={{
                      paddingLeft: "18px",
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {job.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        style={{
                          color: "var(--cv-fg-muted)",
                          fontSize: "0.875rem",
                          lineHeight: "1.7",
                        }}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* selected projects */}
          <hr className="cv-divider" />
          <section>
            <div style={{ marginBottom: "32px" }}>
              <h2 className="cv-section-heading" style={{ margin: "0 0 6px" }}>
                Selected Projects
              </h2>
              <p className="cv-mono" style={{ color: "var(--cv-fg-dim)" }}>
                selected from 105+ projects i&apos;ve built since i was 13
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {projects.map((project, index) => (
                <div
                  key={project.name}
                  className="cv-project-row"
                  style={{
                    paddingBottom: index < projects.length - 1 ? "36px" : "0",
                    marginBottom: index < projects.length - 1 ? "36px" : "0",
                    borderBottom:
                      index < projects.length - 1
                        ? "1px solid var(--cv-border)"
                        : "none",
                  }}
                >
                  <div
                    className="cv-row"
                    style={{ marginBottom: "10px", alignItems: "flex-start" }}
                  >
                    <div>
                      <h3
                        style={{
                          color: "var(--cv-fg)",
                          fontSize: "0.9375rem",
                          fontWeight: 500,
                          marginBottom: "3px",
                        }}
                      >
                        {project.href ? (
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cv-link"
                            style={{ color: "var(--cv-fg)" }}
                          >
                            {project.name}
                          </a>
                        ) : (
                          project.name
                        )}
                      </h3>
                      <p
                        style={{
                          color: "var(--cv-fg-muted)",
                          fontSize: "0.8125rem",
                        }}
                      >
                        {project.subtitle}
                      </p>
                    </div>
                    {project.stats && (
                      <span className="cv-chip">{project.stats}</span>
                    )}
                  </div>
                  <p
                    style={{
                      color: "var(--cv-fg-muted)",
                      fontSize: "0.875rem",
                      lineHeight: "1.7",
                      margin: "0",
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* skills */}
          <hr className="cv-divider" />
          <section>
            <h2 className="cv-section-heading">Skills</h2>
            <dl className="cv-skills-grid" style={{ margin: 0 }}>
              {skills.map(({ term, def }) => (
                <Fragment key={term}>
                  <dt
                    className="cv-mono"
                    style={{ color: "var(--cv-fg-dim)", paddingTop: "1px" }}
                  >
                    {term}
                  </dt>
                  <dd
                    style={{
                      color: "var(--cv-fg-muted)",
                      fontSize: "0.875rem",
                      lineHeight: "1.6",
                      margin: 0,
                    }}
                  >
                    {def}
                  </dd>
                </Fragment>
              ))}
            </dl>
          </section>

          {/* education */}
          <hr className="cv-divider" />
          <section>
            <h2 className="cv-section-heading">Education</h2>
            <div className="cv-row">
              <div>
                <h3
                  style={{
                    color: "var(--cv-fg)",
                    fontSize: "0.9375rem",
                    fontWeight: 500,
                    marginBottom: "3px",
                  }}
                >
                  Yaşar University
                </h3>
                <p
                  style={{
                    color: "var(--cv-fg-muted)",
                    fontSize: "0.875rem",
                  }}
                >
                  B.Sc. Software Engineering
                </p>
              </div>
              <p className="cv-mono cv-dates">expected jun 2028</p>
            </div>
          </section>

          {/* languages */}
          <hr className="cv-divider" />
          <section>
            <h2 className="cv-section-heading">Languages</h2>
            <p style={{ color: "var(--cv-fg-muted)", fontSize: "0.875rem" }}>
              Turkish{" "}
              <span className="cv-mono" style={{ color: "var(--cv-fg-dim)" }}>
                (native)
              </span>{" "}
              &middot; English{" "}
              <span className="cv-mono" style={{ color: "var(--cv-fg-dim)" }}>
                (C1)
              </span>
            </p>
          </section>
        </div>

        {/* export pdf button */}
        <button
          className="cv-export-btn"
          onClick={() => window.print()}
          aria-label="export cv as pdf"
        >
          export pdf
        </button>
      </main>
    </>
  );
}
