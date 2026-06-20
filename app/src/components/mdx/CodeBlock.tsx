"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const getText = (node: React.ReactNode): string => {
      if (typeof node === "string") return node;
      if (Array.isArray(node)) return node.map(getText).join("");
      if (node && typeof node === "object" && "props" in node) {
        const element = node as { props: { children?: React.ReactNode } };
        return getText(element.props.children);
      }
      return "";
    };

    const code = getText(children);
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6 overflow-x-auto rounded-lg border border-[var(--brand-border)] bg-[var(--brand-cream-subtle)]">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md border border-[var(--brand-border)] bg-[var(--brand-cream)] p-2 opacity-0 transition-all hover:bg-[var(--brand-cream-subtle)] group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-700" />
        ) : (
          <Copy className="h-4 w-4 text-[var(--brand-muted)]" />
        )}
      </button>
      <pre className={`p-4 text-sm ${className || ""}`}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
