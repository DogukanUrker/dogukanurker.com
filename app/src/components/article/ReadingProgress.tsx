"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    updateProgress(); // Initial calculation

    return () => window.removeEventListener("scroll", requestTick);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress
        value={progress}
        className="h-1 rounded-none [&>div]:bg-[var(--brand-ink)]/40 [&>div]:transition-transform [&>div]:duration-150 [&>div]:ease-out"
        style={{ backgroundColor: "var(--brand-cream-subtle)" }}
      />
    </div>
  );
}
