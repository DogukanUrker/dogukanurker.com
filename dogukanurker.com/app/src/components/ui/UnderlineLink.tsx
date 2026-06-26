"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

interface UnderlineLinkProps extends Omit<ComponentProps<"a">, "href"> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function UnderlineLink({
  href,
  children,
  className = "",
  ...rest
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

  const isExternal = href.startsWith("http") || href.startsWith("//");
  const isMail = href.startsWith("mailto:");

  if (isExternal || isMail) {
    return (
      <a
        href={href}
        target={isMail ? undefined : "_blank"}
        rel={isMail ? undefined : "noopener noreferrer"}
        data-cursor="link"
        className={base}
        {...rest}
      >
        {children}
        {underline}
      </a>
    );
  }

  return (
    <Link href={href} data-cursor="link" className={base} {...rest}>
      {children}
      {underline}
    </Link>
  );
}
