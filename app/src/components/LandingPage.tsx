"use client";

import {
  type MotionValue,
  motion,
  useAnimate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Brand,
  brands,
  type LogoPulse,
  XGlyph,
  xPulse,
} from "@/components/brand";
import { Cursor } from "@/components/Cursor";
import { RoleLine } from "@/components/RoleLine";

// ─── Shared underline-link ─────────────────────────────────────────────────

interface UnderlineLinkProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

function UnderlineLink({
  href,
  onClick,
  children,
  className = "",
}: UnderlineLinkProps) {
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
  // company link with logo, brand color and logo pulse
  brand?: Brand;
  // the x (twitter) logo link. `text` becomes its aria-label.
  isXLink?: boolean;
}

// every link is followed by a word, never by punctuation: a "," or "." right
// after a logo looks messy.
const words: WordItem[] = [
  { text: "i" },
  { text: "build" },
  { text: "detection" },
  { text: "for" },
  { text: "ai-generated", isBold: true },
  { text: "media", isBold: true },
  { text: "at" },
  { text: "sensity-ai", brand: "sensity" },
  { text: "and" },
  { text: "take" },
  { text: "it" },
  { text: "from" },
  { text: "idea" },
  { text: "to" },
  { text: "shipped." },
  { text: "off" },
  { text: "the" },
  { text: "clock" },
  { text: "x (twitter)", isXLink: true },
  { text: "is" },
  { text: "where" },
  { text: "i" },
  { text: "build", isBold: true },
  { text: "in", isBold: true },
  { text: "public.", isBold: true },
  { text: "coding", isItalic: true },
  { text: "since", isItalic: true },
  { text: "12,", isItalic: true },
  { text: "still", isItalic: true },
  // one token on purpose: it never splits, so the last line is never just
  // "same feeling." (phones are too narrow for the width fix alone)
  { text: "chasing the same feeling.", isItalic: true },
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

  const revealOpacity = shouldReduce ? 1 : opacity;

  if (word.brand) {
    element = (
      <BrandLink
        brand={word.brand}
        opacity={revealOpacity}
        shouldReduce={shouldReduce}
      >
        {word.text}
      </BrandLink>
    );
  } else if (word.isXLink) {
    element = (
      <XLink
        label={word.text}
        opacity={revealOpacity}
        shouldReduce={shouldReduce}
      />
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

// ─── Company + x links in the paragraph ───────────────────────────────────

interface BrandLinkProps {
  brand: Brand;
  opacity: MotionValue<number> | number;
  shouldReduce: boolean | null;
  children: React.ReactNode;
}

// play a logo pulse once per hover or focus and always run it to the end.
// new hovers are ignored while it runs, so leaving early never snaps the
// logo back.
function useLogoPulse(pulse: LogoPulse, shouldReduce: boolean | null) {
  const [scope, animate] = useAnimate();
  const isPulsing = useRef(false);

  const playPulse = async () => {
    if (shouldReduce || isPulsing.current) return;
    isPulsing.current = true;
    await pulse(animate);
    isPulsing.current = false;
  };

  return { scope, playPulse };
}

function BrandLink({ brand, opacity, shouldReduce, children }: BrandLinkProps) {
  const { href, hoverClass, paragraphGap, Glyph, pulse } = brands[brand];
  const { scope, playPulse } = useLogoPulse(pulse, shouldReduce);

  return (
    <motion.a
      ref={scope}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      onHoverStart={playPulse}
      onFocus={playPulse}
      style={{ opacity }}
      className={`group relative inline-flex items-center transition-colors duration-300 text-[var(--brand-ink)] font-semibold ${paragraphGap} ${hoverClass}`}
    >
      <Glyph className="h-[0.75em] w-auto relative top-[0.1em]" />
      <span>{children}</span>
    </motion.a>
  );
}

interface XLinkProps {
  label: string;
  opacity: MotionValue<number> | number;
  shouldReduce: boolean | null;
}

// the x (twitter) link: logo only, ink at rest, x blue on hover, no
// underline. the logo sits on the baseline like a capital letter.
function XLink({ label, opacity, shouldReduce }: XLinkProps) {
  const { scope, playPulse } = useLogoPulse(xPulse, shouldReduce);

  return (
    <motion.a
      ref={scope}
      href="https://x.com/dogukanurker"
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="link"
      aria-label={label}
      onHoverStart={playPulse}
      onFocus={playPulse}
      style={{ opacity }}
      className="inline-block text-[var(--brand-ink)] hover:text-[#1D9BF0] transition-colors duration-300 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2"
    >
      <XGlyph className="h-[0.7em] w-auto align-baseline" />
    </motion.a>
  );
}

function HeroName() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const nameVariants = useMemo(
    () => ({
      hidden: { y: isMobile ? "250%" : "108%" },
      visible: {
        y: "0%",
        transition: { ...spring },
      },
    }),
    [isMobile],
  );

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

  const footerLocationOpacity = useTransform(
    smoothFooterProgress,
    [0, 0.3],
    [0, 1],
  );
  const footerLocationY = useTransform(smoothFooterProgress, [0, 0.3], [16, 0]);
  const footerMailOpacity = useTransform(
    smoothFooterProgress,
    [0.05, 0.35],
    [0, 1],
  );
  const footerMailY = useTransform(smoothFooterProgress, [0.05, 0.35], [16, 0]);
  const footerGithubOpacity = useTransform(
    smoothFooterProgress,
    [0.1, 0.4],
    [0, 1],
  );
  const footerGithubY = useTransform(smoothFooterProgress, [0.1, 0.4], [16, 0]);
  const footerTwitterOpacity = useTransform(
    smoothFooterProgress,
    [0.15, 0.45],
    [0, 1],
  );
  const footerTwitterY = useTransform(
    smoothFooterProgress,
    [0.15, 0.45],
    [16, 0],
  );
  const footerLinkedinOpacity = useTransform(
    smoothFooterProgress,
    [0.2, 0.5],
    [0, 1],
  );
  const footerLinkedinY = useTransform(
    smoothFooterProgress,
    [0.2, 0.5],
    [16, 0],
  );

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
          className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between px-6 py-4 md:py-5 md:px-10 select-none"
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
              className="hidden md:inline-flex items-center text-sm gap-1.5"
              style={{ color: "var(--brand-muted)" }}
            >
              <RoleLine />
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
            <RoleLine compact />
          </div>
        </motion.nav>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <motion.section
          ref={heroRef}
          className="relative h-[100svh] flex flex-col items-center justify-center select-none"
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
                src="/me.jpg"
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
              <HeroName />
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.div>

      <section
        id="about-mobile"
        className="relative min-h-[80dvh] sm:min-h-dvh flex items-center justify-center px-6 py-24"
      >
        <motion.p
          ref={paragraphRef}
          className="font-serif text-center max-w-[26ch] text-pretty"
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
          sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:pb-10 select-none"
        style={{ color: "var(--brand-muted)" }}
      >
        <motion.span
          className="text-sm"
          style={
            shouldReduce
              ? undefined
              : {
                  opacity: footerLocationOpacity,
                  y: footerLocationY,
                }
          }
        >
          izmir, türkiye
        </motion.span>
        <nav aria-label="social links" className="flex items-center gap-5">
          <motion.span
            style={
              shouldReduce
                ? undefined
                : {
                    opacity: footerMailOpacity,
                    y: footerMailY,
                  }
            }
          >
            <UnderlineLink href="mailto:dogukanurker@icloud.com">
              mail
            </UnderlineLink>
          </motion.span>
          <motion.span
            style={
              shouldReduce
                ? undefined
                : {
                    opacity: footerGithubOpacity,
                    y: footerGithubY,
                  }
            }
          >
            <UnderlineLink href="https://github.com/dogukanurker">
              github
            </UnderlineLink>
          </motion.span>
          <motion.span
            style={
              shouldReduce
                ? undefined
                : {
                    opacity: footerTwitterOpacity,
                    y: footerTwitterY,
                  }
            }
          >
            <UnderlineLink href="https://x.com/dogukanurker">
              twitter
            </UnderlineLink>
          </motion.span>
          <motion.span
            style={
              shouldReduce
                ? undefined
                : {
                    opacity: footerLinkedinOpacity,
                    y: footerLinkedinY,
                  }
            }
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
