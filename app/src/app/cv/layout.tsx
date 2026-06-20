import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doğukan Ürker — cv",
  description:
    "full-stack engineer at sensity.ai — experience, selected projects, and skills.",
  openGraph: {
    title: "Doğukan Ürker — cv",
    description:
      "full-stack engineer at sensity.ai — experience, selected projects, and skills.",
    url: "https://dogukanurker.com/cv",
    type: "profile",
  },
};

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
