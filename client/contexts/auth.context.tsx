"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IUser } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/lib/axios-instance";
import { getCurrentUser } from "@/features";
import { useUI } from "./ui.context";

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    data: IUser | null;
    logout: () => void;
    validateSession: () => Promise<void>;
    invalidateCurrentUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { showLoader, hideLoader } = useUI();

    const pathname = usePathname();

    const validateSession = async () => {
        try {
            showLoader();
            await api.get("/auth/validate-session");

            // session valid → fetch user once
            const userData = await getCurrentUser();
            console.log("auth.context", userData);

            setUser(userData);
            setIsLoggedIn(true);
        } catch (err) {
            setUser(null);
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

    useEffect(() => {
        validateSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                data: user,
                isLoggedIn,
                isLoading,
                logout,
                validateSession,
                invalidateCurrentUser
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
