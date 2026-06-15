import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
