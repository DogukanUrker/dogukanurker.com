import type { Viewport } from "next";

// Override the root layout's black themeColor with the CV page's cream background.
export const viewport: Viewport = {
  themeColor: "#f3f1ea",
};

export default function CVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
