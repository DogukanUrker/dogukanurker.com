import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/components/analytics-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz"],
});

// shown in google results and link previews. the real company name here (not
// the site's "sensity-ai" style) so searches for it match.
const SHARE_TITLE = "Doğukan Ürker | engineer at Sensity AI";
const DESCRIPTION =
  "i build detection for ai-generated media at Sensity AI and take it from idea to shipped.";

export const metadata: Metadata = {
  title: "Doğukan",
  description: DESCRIPTION,
  keywords: [
    "Doğukan Ürker",
    "software engineer",
    "developer",
    "portfolio",
    "Flask",
    "FastAPI",
    "React",
    "Next.js",
    "full-stack development",
    "frontend",
    "backend",
    "web apps",
    "Sensity AI",
    "llms",
    "llm evaluation",
    "ai-generated media detection",
  ],
  openGraph: {
    title: SHARE_TITLE,
    description: DESCRIPTION,
    url: "https://dogukanurker.com",
    siteName: "Doğukan Ürker Portfolio",
    type: "website",
    // og:image is auto-generated from app/src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    site: "@dogukanurker",
    title: SHARE_TITLE,
    description: DESCRIPTION,
    // twitter:image is auto-generated from app/src/app/opengraph-image.tsx
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f1ea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${inter.className} antialiased`}
      >
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
