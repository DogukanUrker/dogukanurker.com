"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = typeof children === "string" ? children : "";
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative my-6">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 rounded-md bg-zinc-800 p-2 opacity-0 transition-all hover:bg-zinc-700 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-zinc-400" />
        )}
      </button>
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
