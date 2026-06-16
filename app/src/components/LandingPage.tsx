"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Cursor } from "@/components/Cursor";

// ─── Shared underline-link ─────────────────────────────────────────────────

interface UnderlineLinkProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

function UnderlineLink({ href, onClick, children, className = "" }: UnderlineLinkProps) {
  const base =
    "group relative inline-flex items-center text-sm tracking-wide " +
    "text-[var(--brand-muted)] hover:text-[var(--brand-ink)] transition-colors duration-200 " +
    "rounded-sm focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2 " +
    "bg-transparent border-none p-0 cursor-pointer " +
    className;

  const underline = (
    <span
      aria-hidden
      className="absolute -bottom-0.5 left-0 h-px w-0 bg-[var(--brand-ink)] transition-[width] duration-300 ease-out group-hover:w-full group-focus-visible:w-full"
    />
  );

  if (onClick) {
    return (
      <button onClick={onClick} data-cursor="link" className={base}>
        {children}
        {underline}
      </button>
    );
  }

  if (!href) return null;

  const isExternal = href.startsWith("http") || href.startsWith("//");
  const isHash = href.startsWith("#");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className={base}
      >
        {children}
        {underline}
      </a>
    );
  }

  if (isHash) {
    return (
      <a href={href} data-cursor="link" className={base}>
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link href={href} data-cursor="link" className={base}>
      {children}
      {underline}
    </Link>
  );
}

// ─── Word reveal child component ───────────────────────────────────────────

interface WordItem {
  text: string;
  isBold?: boolean;
  isItalic?: boolean;
  isLink?: boolean;
}

const words: WordItem[] = [
  { text: "i" },
  { text: "build" },
  { text: "detection" },
  { text: "systems" },
  { text: "for" },
  { text: "deepfakes", isBold: true },
  { text: "&", isBold: true },
  { text: "ai-generated", isBold: true },
  { text: "media", isBold: true },
  { text: "at" },
  { text: "sensity.ai", isLink: true },
  { text: "—" },
  { text: "owning" },
  { text: "features" },
  { text: "end" },
  { text: "to" },
  { text: "end:" },
  { text: "backend," },
  { text: "frontend," },
  { text: "tests," },
  { text: "deploys." },
  { text: "off" },
  { text: "the" },
  { text: "clock" },
  { text: "i" },
  { text: "build", isBold: true },
  { text: "in", isBold: true },
  { text: "public:", isBold: true },
  { text: "open-source" },
  { text: "tools," },
  { text: "a" },
  { text: "local-llm" },
  { text: "homelab," },
  { text: "and" },
  { text: "whatever" },
  { text: "i'm" },
  { text: "curious" },
  { text: "about." },
  { text: "coding", isItalic: true },
  { text: "since", isItalic: true },
  { text: "12,", isItalic: true },
  { text: "still", isItalic: true },
  { text: "chasing", isItalic: true },
  { text: "the", isItalic: true },
  { text: "same", isItalic: true },
  { text: "feeling.", isItalic: true },
];

interface WordProps {
  word: WordItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  shouldReduce: boolean | null;
}

function Word({ word, index, total, progress, shouldReduce }: WordProps) {
  const start = (index / total) * 0.8;
  const end = start + 0.2;
  const opacity = useTransform(progress, [start, end], [0.12, 1]);

  const content = (
    <motion.span
      style={{ opacity: shouldReduce ? 1 : opacity }}
      className="inline-block"
    >
      {word.text}
    </motion.span>
  );

  let element = content;

  if (word.isBold) {
    element = <strong className="font-semibold">{element}</strong>;
  } else if (word.isItalic) {
    element = <em style={{ color: "var(--brand-muted)" }}>{element}</em>;
  }

  if (word.isLink) {
    element = (
      <motion.a
        href="https://sensity.ai"
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        style={{ opacity: shouldReduce ? 1 : opacity }}
        className="group relative inline-flex items-center gap-[0.15em] transition-colors duration-300 text-[var(--brand-ink)] hover:text-[#373CE0] font-semibold"
      >
        <svg
          width="0.75em"
          height="0.75em"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="inline-block transition-colors duration-300"
        >
          <path
            d="M122 130H71.5C70.67 130 70 129.33 70 128.5V77.9999C70 73.5799 73.58 69.9999 78 69.9999H128.5C129.33 69.9999 130 70.6699 130 71.4999V122C130 126.42 126.42 130 122 130Z"
            fill="currentColor"
          />
          <path
            d="M38 140H8C3.58 140 0 136.42 0 132V7.99994C0 3.57994 3.58 -6.10352e-05 8 -6.10352e-05H132C136.42 -6.10352e-05 140 3.57994 140 7.99994V37.9999C140 39.0999 139.1 39.9999 138 39.9999H44C41.79 39.9999 40 41.7899 40 43.9999V138C40 139.1 39.1 140 38 140Z"
            fill="currentColor"
          />
          <path
            d="M162 59.9999H192C196.42 59.9999 200 63.5799 200 67.9999V192C200 196.42 196.42 200 192 200H68C63.58 200 60 196.42 60 192V162C60 160.9 60.9 160 62 160H156C158.21 160 160 158.21 160 156V61.9999C160 60.8999 160.89 59.9999 162 59.9999Z"
            fill="currentColor"
          />
        </svg>
        <span>{word.text}</span>
      </motion.a>
    );
  }

  return <>{element} </>;
}

// cubic bezier typed as a tuple - required by framer-motion's Easing type
const expo = [0.16, 1, 0.3, 1] as [number, number, number, number];

// overdamped spring for Y-axis entrances - natural deceleration, no bounce.
const spring = { type: "spring" as const, stiffness: 100, damping: 22 };

// parent variants for hero entrance coordination
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// navbar slides in from the top with spring physics.
const navVariants = {
  hidden: { y: -100 },
  visible: {
    y: 0,
    transition: {
      ...spring,
      staggerChildren: 0.1,
    },
  },
};

// nav links: opacity-only fade.
const navLinksVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.9, ease: expo },
  },
};

// hero section variant wrapper to trigger staggers.
const heroSectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// portrait: clipPath reveal uses duration-based easing to avoid spring overshoot on clip edges.
const portraitVariants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: expo },
  },
};


interface HeroNameProps {
  shouldReduce: boolean | null;
}

function HeroName({ shouldReduce }: HeroNameProps) {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const nameVariants = useMemo(() => ({
    hidden: { y: isMobile ? "250%" : "108%" },
    visible: {
      y: "0%",
      transition: { ...spring },
    },
  }), [isMobile]);

  return (
    <motion.div
      className="font-serif text-center w-full tracking-tighter select-none
        whitespace-normal sm:whitespace-nowrap
        text-[clamp(44px,15vw,90px)] sm:text-[clamp(64px,18vw,300px)]"
      style={
        {
          lineHeight: 0.95,
          color: "var(--brand-ink)",
          fontOpticalSizing: "auto",
        } as React.CSSProperties
      }
      variants={nameVariants}
    >
      Doğukan Ürker
    </motion.div>
  );
}

// ─── Landing page ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const shouldReduce = useReducedMotion();

  const heroRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const scrollToAbout = () => {
    const isMobileViewport = window.matchMedia("(max-width: 639px)").matches;
    const targetId = isMobileViewport ? "about-mobile" : "about-desktop";
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { scrollY } = useScroll();
  const cueOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const yRaw = useTransform(heroScrollProgress, [0, 1], [0, 200]);
  const opacityRaw = useTransform(heroScrollProgress, [0, 1], [1, 0.4]);

  const ySpring = useSpring(yRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const opacitySpring = useSpring(opacityRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const nameY = shouldReduce ? 0 : ySpring;
  const nameOpacity = shouldReduce ? 1 : opacitySpring;

  const { scrollYProgress: paragraphProgress } = useScroll({
    target: paragraphRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const smoothParagraphProgress = useSpring(paragraphProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { scrollYProgress: footerScrollProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const smoothFooterProgress = useSpring(footerScrollProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const footerLocationOpacity = useTransform(smoothFooterProgress, [0, 0.3], [0, 1]);
  const footerLocationY = useTransform(smoothFooterProgress, [0, 0.3], [16, 0]);
  const footerMailOpacity = useTransform(smoothFooterProgress, [0.05, 0.35], [0, 1]);
  const footerMailY = useTransform(smoothFooterProgress, [0.05, 0.35], [16, 0]);
  const footerGithubOpacity = useTransform(smoothFooterProgress, [0.1, 0.4], [0, 1]);
  const footerGithubY = useTransform(smoothFooterProgress, [0.1, 0.4], [16, 0]);
  const footerTwitterOpacity = useTransform(smoothFooterProgress, [0.15, 0.45], [0, 1]);
  const footerTwitterY = useTransform(smoothFooterProgress, [0.15, 0.45], [16, 0]);
  const footerLinkedinOpacity = useTransform(smoothFooterProgress, [0.2, 0.5], [0, 1]);
  const footerLinkedinY = useTransform(smoothFooterProgress, [0.2, 0.5], [16, 0]);

  // memoized dynamic name variants to prevent recalculation shifts on re-renders
  const nameWrapperVariants = useMemo(
    () => ({
      hidden: {
        clipPath: shouldReduce
          ? "inset(-30px -600px -40px -600px)"
          : "inset(0px -600px -40px -600px)",
      },
      visible: {
        clipPath: "inset(-30px -600px -40px -600px)",
        transition: { duration: 1.6, ease: expo },
      },
    }),
    [shouldReduce],
  );

  return (
    <main
      className={`relative w-full min-h-screen overflow-x-hidden${cursorEnabled ? " cursor-none" : ""}`}
      style={{
        backgroundColor: "var(--brand-cream)",
        color: "var(--brand-ink)",
      }}
    >
      <Cursor onEnable={setCursorEnabled} />

      <motion.div
        initial={shouldReduce ? "visible" : "hidden"}
        animate="visible"
        variants={containerVariants}
      >
        {/* ── Nav ─────────────────────────────────────────────────────────── */}
        <motion.nav
          aria-label="primary navigation"
          className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 md:py-5 md:px-10"
          style={{
            backgroundColor: "rgba(243, 241, 234, 0.85)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            willChange: "transform",
          }}
          variants={navVariants}
        >
          <div className="flex items-center gap-4">
            <span
              className="text-sm font-medium tracking-tight"
              style={{ color: "var(--brand-ink)" }}
            >
              Doğukan Ürker
            </span>
            <span
              className="hidden md:inline-flex items-center text-sm gap-1"
              style={{ color: "var(--brand-muted)" }}
            >
              <span>full-stack engineer @</span>
              <UnderlineLink href="https://sensity.ai">
                sensity.ai
              </UnderlineLink>
            </span>
          </div>
          <motion.div
            className="flex items-center gap-6"
            variants={navLinksVariants}
          >
            <UnderlineLink onClick={scrollToAbout}>about</UnderlineLink>
            <UnderlineLink href="/cv">resume</UnderlineLink>
          </motion.div>
          {/* mobile-only role subtitle - sits below the first row */}
          <div
            className="w-full mt-1 md:hidden flex items-center gap-1 text-xs tracking-wide leading-relaxed"
            style={{ color: "var(--brand-muted)" }}
          >
            <span>full-stack engineer @</span>
            <UnderlineLink href="https://sensity.ai" className="text-xs">
              sensity.ai
            </UnderlineLink>
          </div>
        </motion.nav>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <motion.section
          ref={heroRef}
          className="relative h-[100svh] flex flex-col items-center justify-center"
          variants={heroSectionVariants}
        >
          {/* Portrait */}
          <div
            className="group relative z-10"
            style={{
              width: "clamp(220px, 26vw, 360px)",
              height: "clamp(220px, 26vw, 360px)",
            }}
            data-cursor="photo"
          >
            <motion.div
              className="w-full h-full overflow-hidden relative"
              variants={portraitVariants}
            >
              <Image
                src="/dogukan.jpg"
                alt="Doğukan Ürker"
                fill
                priority
                sizes="(max-width: 640px) 220px, (max-width: 1200px) 26vw, 360px"
                className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:grayscale-0 group-hover:scale-[1.04]"
              />
            </motion.div>
          </div>

          {/* Accessible SEO Heading */}
          <h1 className="sr-only">Doğukan Ürker</h1>

          {/* Giant decorative name */}
          <motion.div
            className="absolute left-0 right-0 pointer-events-none bottom-2 sm:-bottom-2"
            variants={nameWrapperVariants}
            aria-hidden
          >
            <motion.div style={{ y: nameY, opacity: nameOpacity }}>
              <HeroName shouldReduce={shouldReduce} />
            </motion.div>
          </motion.div>

          {/* Scroll cue - fades in at top, fades out on scroll */}
          {!shouldReduce && (
            <motion.div
              className="absolute left-6 md:left-10 bottom-12 hidden sm:block pointer-events-none select-none"
              style={{ opacity: cueOpacity }}
              aria-hidden
            >
              <div className="w-px h-12 overflow-hidden">
                <motion.div
                  className="w-full h-full"
                  style={{ backgroundColor: "var(--brand-dim)" }}
                  animate={{ y: ["-100%", "0%", "0%", "100%"] }}
                  transition={{
                    duration: 2.2,
                    times: [0, 0.35, 0.65, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 0.5,
                  }}
                />
              </div>
            </motion.div>
          )}
        </motion.section>
      </motion.div>

      <section id="about-mobile" className="relative min-h-[80dvh] sm:min-h-dvh flex items-center justify-center px-6 py-24">
        <motion.p
          ref={paragraphRef}
          className="font-serif text-center max-w-[23ch]"
          style={
            {
              fontSize: "clamp(26px, 3.6vw, 54px)",
              lineHeight: 1.22,
              color: "var(--brand-ink)",
              fontWeight: 340,
              fontOpticalSizing: "auto",
            } as React.CSSProperties
          }
        >
          {words.map((word, index) => (
            <Word
              key={index}
              word={word}
              index={index}
              total={words.length}
              progress={smoothParagraphProgress}
              shouldReduce={shouldReduce}
            />
          ))}
        </motion.p>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        id="about-desktop"
        ref={footerRef}
        className="flex flex-col items-center gap-3 pb-[calc(3rem+env(safe-area-inset-bottom))] px-6
          sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:pb-10"
        style={{ color: "var(--brand-muted)" }}
      >
        <motion.span
          className="text-sm"
          style={shouldReduce ? undefined : {
            opacity: footerLocationOpacity,
            y: footerLocationY,
          }}
        >
          izmir, türkiye
        </motion.span>
        <nav
          aria-label="social links"
          className="flex items-center gap-5"
        >
          <motion.span
            style={shouldReduce ? undefined : {
              opacity: footerMailOpacity,
              y: footerMailY,
            }}
          >
            <UnderlineLink href="mailto:dogukanurker@icloud.com">
              mail
            </UnderlineLink>
          </motion.span>
          <motion.span
            style={shouldReduce ? undefined : {
              opacity: footerGithubOpacity,
              y: footerGithubY,
            }}
          >
            <UnderlineLink href="https://github.com/dogukanurker">
              github
            </UnderlineLink>
          </motion.span>
          <motion.span
            style={shouldReduce ? undefined : {
              opacity: footerTwitterOpacity,
              y: footerTwitterY,
            }}
          >
            <UnderlineLink href="https://twitter.com/dogukanurker">
              twitter
            </UnderlineLink>
          </motion.span>
          <motion.span
            style={shouldReduce ? undefined : {
              opacity: footerLinkedinOpacity,
              y: footerLinkedinY,
            }}
          >
            <UnderlineLink href="https://linkedin.com/in/dogukanurker">
              linkedin
            </UnderlineLink>
          </motion.span>
        </nav>
      </footer>
    </main>
  );
}
