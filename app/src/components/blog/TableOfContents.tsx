"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/lib/blog";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden xl:sticky xl:top-24 xl:block xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto">
      <div>
        <h3 className="mb-4 text-sm font-semibold text-zinc-100">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            const paddingLeft = `${(heading.level - 1) * 0.75}rem`;

            return (
              <li key={heading.id} style={{ paddingLeft }}>
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 transition-colors hover:text-zinc-100 ${
                    isActive ? "font-medium text-zinc-100" : "text-zinc-500"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
