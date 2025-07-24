import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Doğukan",
  description: "Software engineer building modern web applications.",
  themeColor: "#000000",
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
    title: "Doğukan Ürker | Software Engineer",
    description: "Software engineer building modern web applications.",
    url: "https://dogukanurker.com",
    siteName: "Doğukan Ürker Portfolio",
    type: "website",
    images: [
      {
        url: "https://dogukanurker.com/ogImage.png",
        width: 1200,
        height: 630,
        alt: "Doğukan Ürker's portfolio site, featuring modern web development projects.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dogukanurker",
    title: "Doğukan Ürker | Software Engineer",
    description: "Software engineer building modern web applications.",
    images: ["https://dogukanurker.com/ogImage.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
