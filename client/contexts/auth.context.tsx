"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IUser } from "@/types";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios-instance";
import { getCurrentUser } from "@/features";
import { useUI } from "./ui.context";

type AuthContextType = {
    isLoggedIn: boolean;
    isLoading: boolean;
    data: IUser | null;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { showLoader, hideLoader } = useUI();

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
            router.replace("/login");
        } finally {
            setIsLoading(false);
            hideLoader();
        }
    };
    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/login");
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
                logout
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
