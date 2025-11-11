"use client";

import { useEffect, useState } from "react";

const socials = [
  {
    name: "email",
    url: "mailto:dogukanurker@icloud.com",
  },
  {
    name: "github",
    url: "https://github.com/dogukanurker",
  },
  {
    name: "twitter",
    url: "https://twitter.com/dogukanurker",
  },
  {
    name: "youtube",
    url: "https://youtube.com/@dogukanurker",
  },
  {
    name: "linkedin",
    url: "https://linkedin.com/in/dogukanurker",
  },
  {
    name: "instagram",
    url: "https://instagram.com/dogukanurker",
  },
];

export default function SocialsPage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700"
        style={{
          backgroundImage: `url('/shooting-star-bg.png')`,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hidden lg:block"
        style={{
          backgroundImage: `url('/shooting-star-bg-desktop.png')`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      <div className="absolute top-12 right-6 lg:top-auto lg:bottom-12 lg:right-12 text-right">
        <div
          className={`transition-all duration-1000 lg:scale-110 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1
            className="text-white text-4xl font-light mb-2 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dogukan Urker
          </h1>

          <p className="text-gray-300 text-sm mb-6 opacity-80">
            full-stack engineer{" "}
            <a
              href="https://sensity.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-all duration-300 hover:text-white"
            >
              @sensity.ai
            </a>
          </p>

          <nav className="flex flex-col items-end gap-2">
            {socials.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-gray-400 text-sm transition-all duration-300 hover:text-white"
                style={{
                  transitionDelay: `${index * 50}ms`,
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(20px)",
                }}
              >
                <span className="relative">{social.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
