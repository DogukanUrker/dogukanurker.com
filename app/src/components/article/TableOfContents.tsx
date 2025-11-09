"use client";

import { useEffect, useState } from "react";
import { Heading } from "@/lib/article";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Handle scroll to find the currently visible heading
    const handleScroll = () => {
      // Check if we're at the bottom of the page
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

      // If at bottom, activate the last heading
      if (isAtBottom && headings.length > 0) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      // Find all heading elements and their positions
      const headingElements = headings
        .map(({ id }) => {
          const element = document.getElementById(id);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { id, top: rect.top };
        })
        .filter((item): item is { id: string; top: number } => item !== null);

      // Find the heading that's currently visible (closest to top but still on screen)
      const OFFSET = 100; // Offset from top of viewport
      let currentId = "";

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i];
        if (heading.top <= OFFSET) {
          currentId = heading.id;
          break;
        }
      }

      // If no heading is above the offset, use the first one
      if (!currentId && headingElements.length > 0) {
        currentId = headingElements[0].id;
      }

      if (currentId) {
        setActiveId(currentId);
      }
    };

    // Initial call
    handleScroll();

    // Add scroll listener with throttling
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden xl:sticky xl:top-8 xl:block xl:max-h-[calc(100vh-5rem)] xl:overflow-y-auto">
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
                    const element = document.getElementById(heading.id);
                    if (element) {
                      // Get element position and scroll with offset
                      const offset = 20; // Reduced padding for better visibility
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.scrollY - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                      // Update active state immediately for better UX
                      setActiveId(heading.id);
                    } else {
                      console.warn(`Element with id "${heading.id}" not found`);
                    }
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
