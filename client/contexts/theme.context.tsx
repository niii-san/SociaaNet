"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ThemeMode } from "@/types";

type ThemeContextType = {
    theme: ThemeMode;
    setTheme: (theme: ThemeMode) => void;
    resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = "sociaa-theme";

function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: ThemeMode): "light" | "dark" {
    if (theme === "system") return getSystemTheme();
    return theme;
}

function applyTheme(resolved: "light" | "dark") {
    const root = document.documentElement;
    if (resolved === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
    root.style.colorScheme = resolved;
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<ThemeMode>(() => {
        if (typeof window === "undefined") return "system";
        return (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "system";
    });

    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
        return resolveTheme(theme);
    });

    const setTheme = useCallback((newTheme: ThemeMode) => {
        setThemeState(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
        const resolved = resolveTheme(newTheme);
        setResolvedTheme(resolved);

        // Enable smooth transition, then apply theme
        const root = document.documentElement;
        root.classList.add("theme-transition");
        applyTheme(resolved);

        // Remove transition class after animation completes
        const timeout = setTimeout(() => {
            root.classList.remove("theme-transition");
        }, 350);

        return () => clearTimeout(timeout);
    }, []);

    // Apply theme on mount and listen for system preference changes
    useEffect(() => {
        const resolved = resolveTheme(theme);
        setResolvedTheme(resolved);
        applyTheme(resolved);

        // Listen for system theme changes when theme is "system"
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            if (theme === "system") {
                const newResolved = getSystemTheme();
                setResolvedTheme(newResolved);
                applyTheme(newResolved);
            }
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
};
