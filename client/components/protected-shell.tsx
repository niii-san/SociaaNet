"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts";
import { useChat } from "@/contexts/chat.context";
import { SplashScreen } from "@/components/splash-screen";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
    const { isLoading, isLoggedIn } = useAuth();
    const { isConnected } = useChat();
    const [timedOut, setTimedOut] = useState(false);

    // Timeout after 8 seconds so the app doesn't hang forever
    useEffect(() => {
        const timer = setTimeout(() => setTimedOut(true), 8000);
        return () => clearTimeout(timer);
    }, []);

    // Show splash while auth loads or socket connects (with timeout fallback)
    const showSplash = isLoading || (isLoggedIn && !isConnected && !timedOut);

    if (showSplash) {
        return <SplashScreen />;
    }

    return <>{children}</>;
}
