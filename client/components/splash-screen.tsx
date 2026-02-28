"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev + 1) % 4);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
            {/* Logo area */}
            <div className="flex flex-col items-center gap-8">
                {/* Instagram-style gradient icon */}
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-2xl bg-linear-to-tr from-primary via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 rounded-2xl bg-linear-to-tr from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <span className="text-white text-3xl font-bold">S</span>
                    </div>
                </div>

                {/* App name */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold bg-linear-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        SociaaNet
                    </h1>
                </div>
            </div>

            {/* Bottom section */}
            <div className="absolute bottom-12 flex flex-col items-center gap-3">
                {/* Loading spinner */}
                <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">
                    Loading{".".repeat(dots)}
                </p>
            </div>
        </div>
    );
}
