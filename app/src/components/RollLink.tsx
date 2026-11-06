"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// the site's standard text link. on hover each letter rolls up into a copy of
// itself, one after another. inside a `.roll-group` (a nav or footer) the
// other links fade softly while one is hovered (the "spotlight"). styles live
// in globals.css under "roll link".

// the pointer has to rest this long before a roll starts, so a fast sweep
// across links does nothing.
const INTENT_MS = 70;
// keep in sync with the roll animation in globals.css
const ROLL_MS = 500;
const STAGGER_MS = 22;

// plays one full roll at a time and always lets it finish, even if the
// pointer leaves. the rolled-in copy looks the same as the original, so
// dropping the class at the end resets the letters without any visible jump.
function useRoll(letters: number) {
  const [rolling, setRolling] = useState(false);
  const isRolling = useRef(false);
  const intent = useRef<ReturnType<typeof setTimeout>>(undefined);
  const done = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      clearTimeout(intent.current);
      clearTimeout(done.current);
    },
    [],
  );

  const start = () => {
    if (isRolling.current) return;
    isRolling.current = true;
    setRolling(true);
    done.current = setTimeout(
      () => {
        isRolling.current = false;
        setRolling(false);
      },
      ROLL_MS + STAGGER_MS * (letters - 1) + 30,
    );
  };

  return {
    rolling,
    handlers: {
      onMouseEnter: () => {
        clearTimeout(intent.current);
        intent.current = setTimeout(start, INTENT_MS);
      },
      // leaving only cancels a roll that hasn't started yet
      onMouseLeave: () => clearTimeout(intent.current),
      // keyboard focus rolls right away
      onFocus: start,
    },
  };
}

interface RollLinkProps {
  href?: string;
  onClick?: () => void;
  // muted (default) turns ink on hover. ink stays ink, for titles in lists.
  tone?: "muted" | "ink";
  children: React.ReactNode;
  className?: string;
}

// two stacked copies of each letter: the top one rolls out, the bottom one
// rolls in. `--i` staggers the letters. the whole thing is hidden from screen
// readers; the link's aria-label gives them the word once.
function RollText({ text }: { text: string }) {
  return (
    <span aria-hidden className="inline-flex">
      {[...text].map((char, i) => (
        <span
          key={i}
          className="roll-char"
          style={{ "--i": i } as React.CSSProperties}
        >
          <span>{char}</span>
          <span>{char}</span>
        </span>
      ))}
    </span>
  );
}

export function RollLink({
  href,
  onClick,
  tone = "muted",
  children,
  className = "",
}: RollLinkProps) {
  // only plain text can roll. anything else renders as is.
  const text = typeof children === "string" ? children : undefined;
  const content = text ? <RollText text={text} /> : children;
  const { rolling, handlers } = useRoll(text ? [...text].length : 0);
  const rollProps = text ? handlers : {};
  const toneClass =
    tone === "ink"
      ? "text-[var(--brand-ink)]"
      : "text-[var(--brand-muted)] hover:text-[var(--brand-ink)]";
  const base =
    `roll-link relative inline-flex items-center text-sm tracking-wide ${toneClass} ` +
    "rounded-sm focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-[var(--brand-ink)] focus-visible:ring-offset-2 " +
    `bg-transparent border-none p-0 cursor-pointer ${rolling ? "is-rolling " : ""}${className}`;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        data-cursor="link"
        {...rollProps}
        aria-label={text}
        className={base}
      >
        {content}
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
        {...rollProps}
        aria-label={text}
        className={base}
      >
        {content}
      </a>
    );
  }

  if (isHash) {
    return (
      <a
        href={href}
        data-cursor="link"
        aria-label={text}
        className={base}
        {...rollProps}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      data-cursor="link"
      aria-label={text}
      className={base}
      {...rollProps}
    >
      {content}
    </Link>
  );
}
