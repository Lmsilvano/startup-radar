import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "SC Startup Radar | Innovation Ecosystem",
    description: "Santa Catarina Innovation Index - Startup & Tech Ecosystem Monitoring",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark">
            <body
                className={cn(
                    "min-h-screen bg-background font-sans antialiased selection:bg-primary/30 selection:text-primary",
                    inter.variable
                )}
            >
                <Providers>
                    <div className="relative flex min-h-screen flex-col">
                        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl transition-all duration-300">
                            <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8">
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                        SC
                                    </div>
                                    <h1 className="text-lg font-bold tracking-tight">
                                        Startup <span className="text-primary italic">Radar</span>
                                    </h1>
                                </div>
                                <Navbar />
                                <div className="md:hidden w-8 h-8 flex items-center justify-center rounded-md border bg-muted/50">
                                    <div className="w-4 h-[2px] bg-foreground relative after:content-[''] after:absolute after:top-[-6px] after:w-4 after:h-[2px] after:bg-foreground before:content-[''] before:absolute before:top-[6px] before:w-4 before:h-[2px] before:bg-foreground" />
                                </div>
                            </div>
                        </header>

                        <main className="flex-1">
                            {children}
                        </main>

                        <footer className="border-t bg-muted/20 py-12">
                            <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4 text-center md:text-left">
                                    <div className="flex items-center gap-2 justify-center md:justify-start grayscale opacity-50">
                                        <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center text-[10px] font-bold text-background">SC</div>
                                        <span className="text-sm font-bold tracking-tight">Startup Radar</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground max-w-xs mx-auto md:mx-0">
                                        Monitoramento contínuo do ecossistema de inovação de Santa Catarina.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center md:items-end gap-2">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                        © 2026 SC Startup Radar — All Rights Reserved
                                    </p>
                                    <div className="flex gap-2">
                                        <div className="w-12 h-1 rounded-full bg-primary/20"></div>
                                        <div className="w-8 h-1 rounded-full bg-primary"></div>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
