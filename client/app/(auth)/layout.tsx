"use client";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn && !isLoading) {
            router.replace("/");
        }
    }, [isLoggedIn, isLoading]);

    return <>{children}</>;
}
