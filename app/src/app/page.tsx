"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
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
          className={`transition-all duration-1500 lg:scale-110 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h1
            className="text-white text-4xl font-light mb-2 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dogukan Urker
          </h1>

          <p className="text-gray-300 text-sm mb-6 opacity-80">
            software engineer{" "}
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
            {[
              { name: "github", url: "https://github.com/dogukanurker" },
              { name: "twitter", url: "https://twitter.com/dogukanurker" },
              { name: "linkedin", url: "https://linkedin.com/in/dogukanurker" },
              { name: "resume", url: "/cv.pdf" },
            ].map((link, index) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative text-gray-400 text-sm transition-all duration-300 hover:text-white"
                style={{
                  transitionDelay: `${index * 50}ms`,
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateX(0)" : "translateX(20px)",
                }}
              >
                <span className="relative">{link.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-px h-px bg-white rounded-full animate-shooting-star"
          style={{
            boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8)",
            animation: "shooting 3s linear infinite",
            animationDelay: "5s",
          }}
        />
      </div>
    </div>
  );
}
