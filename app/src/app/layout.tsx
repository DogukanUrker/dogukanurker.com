import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Fraunces } from "next/font/google";
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

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Doğukan",
  description: "Software engineer building modern web applications.",
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
  ],
  openGraph: {
    title: "Doğukan Ürker | Full-Stack Engineer",
    description: "Software engineer building modern web applications.",
    url: "https://dogukanurker.com",
    siteName: "Doğukan Ürker Portfolio",
    type: "website",
    // og:image is auto-generated from app/src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    site: "@dogukanurker",
    title: "Doğukan Ürker | Full-Stack Engineer",
    description: "Software engineer building modern web applications.",
    // twitter:image is auto-generated from app/src/app/opengraph-image.tsx
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${inter.className} antialiased`}
      >
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </body>
    </html>
  );
}
