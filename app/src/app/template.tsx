"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];

  return (
    <motion.div
      initial={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: expo }}
    >
      {children}
    </motion.div>
  );
}
