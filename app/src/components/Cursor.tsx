"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface CursorProps {
  onEnable?: (enabled: boolean) => void;
}

/** How far back (ms) we look when computing instantaneous speed. */
const VELOCITY_WINDOW = 100;
/** Speed threshold (px/s) to start scaling. */
const SPEED_THRESHOLD = 1500;
/** Speed at which scale reaches its maximum. */
const SPEED_MAX = 5000;
/** Maximum scale multiplier. */
const SCALE_MAX = 4;
/** How quickly (0‑1 per frame) the scale decays back to 1× when the mouse slows. */
const DECAY = 0.08;

export function Cursor({ onEnable }: CursorProps) {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "link" | "photo">(
    "default",
  );

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  // --- velocity tracking state (mutable refs to avoid re-renders) ----------
  const trail = useRef<{ t: number; x: number; y: number }[]>([]);
  const scaleRef = useRef(1);
  const rafId = useRef<number | null>(null);
  const scaleMotion = useMotionValue(1);
  const scaleSpring = useSpring(scaleMotion, {
    stiffness: 300,
    damping: 25,
    mass: 0.4,
  });

  // Animate the decay loop — runs every frame while mounted.
  const tick = useCallback(() => {
    const now = performance.now();
    const pts = trail.current;

    // Prune points older than the window.
    while (pts.length > 0 && now - pts[0].t > VELOCITY_WINDOW) pts.shift();

    if (pts.length >= 2) {
      const first = pts[0];
      const last = pts[pts.length - 1];
      const dt = (last.t - first.t) / 1000; // seconds
      if (dt > 0) {
        const dist = Math.hypot(last.x - first.x, last.y - first.y);
        const speed = dist / dt; // px/s

        if (speed > SPEED_THRESHOLD) {
          // Map speed → scale [1, SCALE_MAX]
          const t = Math.min(
            (speed - SPEED_THRESHOLD) / (SPEED_MAX - SPEED_THRESHOLD),
            1,
          );
          const target = 1 + t * (SCALE_MAX - 1);
          // Only grow — never jump‑shrink from the speed signal.
          scaleRef.current = Math.max(scaleRef.current, target);
        }
      }
    }

    // Decay towards 1.
    scaleRef.current = 1 + (scaleRef.current - 1) * (1 - DECAY);
    if (scaleRef.current < 1.01) scaleRef.current = 1;

    scaleMotion.set(scaleRef.current);
    rafId.current = requestAnimationFrame(tick);
  }, [scaleMotion]);

  useEffect(() => {
    if (reduce) {
      setEnabled(false);
      onEnable?.(false);
      return;
    }
    if (!window.matchMedia("(pointer: fine)").matches) {
      setEnabled(false);
      onEnable?.(false);
      return;
    }

    setEnabled(true);
    onEnable?.(true);

    // Suppress the OS pointer on every element so the custom dot is the only
    // cursor visible. Removed automatically when the component unmounts.
    const style = document.createElement("style");
    style.id = "__custom-cursor-hide";
    style.textContent = "* { cursor: none !important; }";
    document.head.appendChild(style);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      // Record position for velocity measurement.
      trail.current.push({ t: performance.now(), x: e.clientX, y: e.clientY });

      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      const v = target?.getAttribute("data-cursor");
      setVariant(v === "photo" ? "photo" : v === "link" ? "link" : "default");
    };

    window.addEventListener("mousemove", move);

    // Start the animation loop.
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      document.getElementById("__custom-cursor-hide")?.remove();
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [reduce, x, y, onEnable, tick]);

  if (!enabled) return null;

  const size = variant === "photo" ? 70 : variant === "link" ? 46 : 9;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] rounded-full mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        scale: scaleSpring,
        backgroundColor: "var(--brand-ink)",
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{ width: size, height: size }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    />
  );
}
