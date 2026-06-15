"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface CursorProps {
  onEnable?: (enabled: boolean) => void;
}

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
      const target = (e.target as HTMLElement)?.closest("[data-cursor]");
      const v = target?.getAttribute("data-cursor");
      setVariant(v === "photo" ? "photo" : v === "link" ? "link" : "default");
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.getElementById("__custom-cursor-hide")?.remove();
    };
  }, [reduce, x, y, onEnable]);

  if (!enabled) return null;

  const size = variant === "photo" ? 70 : variant === "link" ? 46 : 9;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[999] rounded-full mix-blend-difference"
      style={{
        x: sx,
        y: sy,
        backgroundColor: "var(--brand-ink)",
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{ width: size, height: size }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    />
  );
}
