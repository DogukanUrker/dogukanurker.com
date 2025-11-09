"use client";

import { useState } from "react";

interface ShareButtonProps {
  url: string;
}

export function ShareButton({ url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
      aria-label="Share article"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}

