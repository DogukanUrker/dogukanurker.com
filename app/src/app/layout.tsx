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
    description: "Building apps",
    keywords: ["dogukan", "urker", "dogukanurker", "flaskblog", "fullstack", "developer"],
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}>
        {children}
        </body>
        </html>
    );
}