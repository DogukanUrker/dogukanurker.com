import type {Metadata} from "next";
import {Geist, Geist_Mono, Inter} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Doğukan",
    description:
        "The personal website of Doğukan Ürker, a full-stack developer focusing on Python, TypeScript, and modern web apps.",
    keywords: [
        "Doğukan Ürker",
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
        title: "Doğukan Ürker | Developer Portfolio",
        description:
            "Showcasing projects and expertise in full-stack development with Python, TypeScript, and modern web technologies.",
        url: "https://dogukanurker.com",
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
        title: "Doğukan Ürker | Developer Portfolio",
        description:
            "Discover projects and skills in full-stack development with Flask and Next.js.",
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