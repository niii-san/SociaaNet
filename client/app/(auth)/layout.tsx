"use client";
import { GuestNavbar } from "@/components/guest-navbar";
import { AuthProvider } from "@/contexts";

export default function AuthLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <GuestNavbar />
            <AuthProvider>{children}</AuthProvider>
        </>
    );
}
