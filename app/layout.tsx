import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Moview - Onchain Movie Reviews",
    description: "Discover, rate, and review movies with blockchain-powered transparency",
    keywords: ["movies", "reviews", "blockchain", "celo", "web3"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <Header />
                    <main className="min-h-screen">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
