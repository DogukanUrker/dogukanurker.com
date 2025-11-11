"use client";

import { useEffect, useState } from "react";

const socials = [
  {
    name: "github",
    url: "https://github.com/dogukanurker",
  },
  {
    name: "twitter",
    url: "https://twitter.com/dogukanurker",
  },
  {
    name: "instagram",
    url: "https://instagram.com/dogukanurker",
  },
  {
    name: "linkedin",
    url: "https://linkedin.com/in/dogukanurker",
  },
  {
    name: "youtube",
    url: "https://youtube.com/@dogukanurker",
  },
  {
    name: "email",
    url: "mailto:dogukanurker@icloud.com",
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

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`text-center transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1
            className="text-white text-4xl font-light mb-8 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Connect
          </h1>

          <nav className="flex flex-col items-center gap-4">
            {socials.map((social, index) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 text-lg transition-all duration-300 hover:text-white"
                style={{
                  transitionDelay: `${index * 50}ms`,
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(-20px)",
                }}
              >
                {social.name}
              </a>
            ))}
          </nav>

          <div className="mt-12">
            <a
              href="/"
              className="text-gray-500 text-sm transition-all duration-300 hover:text-gray-300"
              style={{
                opacity: loaded ? 1 : 0,
                transitionDelay: "350ms",
              }}
            >
              go home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
