"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IUser, UserSettings } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/axios-instance";
import { getCurrentUser } from "@/features";
import { getUserSettings } from "@/features/settings/settings.api";
import { useUI } from "./ui.context";

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    data: IUser | null;
    settings: UserSettings | null;
    logout: () => void;
    validateSession: () => Promise<void>;
    invalidateCurrentUser: () => Promise<void>;
    refetchSettings: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { showLoader, hideLoader } = useUI();

    const pathname = usePathname();

    const validateSession = async () => {
        try {
            showLoader();
            await api.get("/auth/validate-session");

            // session valid → fetch user and settings
            const userData = await getCurrentUser();
            const userSettings = await getUserSettings();
            console.log("auth.context", userData);

            setUser(userData);
            setSettings(userSettings);
            setIsLoggedIn(true);
        } catch (err) {
            setUser(null);
            setSettings(null);
            setIsLoggedIn(false);
            if (pathname !== "/login" && pathname !== "/register") {
                router.replace("/login");
            }
        } finally {
            setIsLoading(false);
            hideLoader();
            console.log("Session validated");
        }
    };
    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/login");
    };

    const invalidateCurrentUser = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
            setIsLoggedIn(true);
            console.log("Current user refetched:", userData);
        } catch (err) {
            console.error("Failed to refetch current user:", err);
        }
    };

    const refetchSettings = async () => {
        try {
            const userSettings = await getUserSettings();
            setSettings(userSettings);
            console.log("Settings refetched:", userSettings);
        } catch (err) {
            console.error("Failed to refetch settings:", err);
        }
    };

    useEffect(() => {
        validateSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                data: user,
                settings,
                isLoggedIn,
                isLoading,
                logout,
                validateSession,
                invalidateCurrentUser,
                refetchSettings
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// clean hook to use the auth context
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
};
