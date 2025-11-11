"use client";

import { useEffect, useState } from "react";
import {
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";

const socials = [
  {
    name: "github",
    icon: Github,
    url: "https://github.com/dogukanurker",
    username: "@dogukanurker",
  },
  {
    name: "twitter",
    icon: Twitter,
    url: "https://twitter.com/dogukanurker",
    username: "@dogukanurker",
  },
  {
    name: "instagram",
    icon: Instagram,
    url: "https://instagram.com/dogukanurker",
    username: "@dogukanurker",
  },
  {
    name: "linkedin",
    icon: Linkedin,
    url: "https://linkedin.com/in/dogukanurker",
    username: "dogukanurker",
  },
  {
    name: "youtube",
    icon: Youtube,
    url: "https://youtube.com/@dogukanurker",
    username: "@dogukanurker",
  },
  {
    name: "email",
    icon: Mail,
    url: "mailto:dogukanurker@icloud.com",
    username: "dogukanurker@icloud.com",
  },
];

export default function SocialsPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div
          className={`mb-16 space-y-4 text-center transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1 className="text-4xl font-bold tracking-tight text-zinc-100 sm:text-5xl">
            Connect
          </h1>
          <p className="text-base text-zinc-400">
            Find me across the web
          </p>
        </div>

        <div className="space-y-3">
          {socials.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-6 py-4 transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40 ${loaded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800/50 transition-colors group-hover:bg-zinc-800">
                  <Icon className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-100" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-zinc-100 transition-colors group-hover:text-white">
                    {social.name}
                  </div>
                  <div className="text-xs text-zinc-500 transition-colors group-hover:text-zinc-400">
                    {social.username}
                  </div>
                </div>
                <div className="text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-zinc-400">
                  →
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
