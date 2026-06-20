import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "donate — Doğukan Ürker",
  description:
    "support my work on open-source tools, scripts, and applications.",
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
