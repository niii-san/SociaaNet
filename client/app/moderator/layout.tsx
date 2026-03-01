import { AuthProvider } from "@/contexts";
import { validateSessionServer } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";
import { ModeratorLayoutInner } from "./mod-layout-inner";

export default async function ModeratorLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const isSessionValid = await validateSessionServer();
    if (!isSessionValid) redirect("/login");

    return (
        <AuthProvider>
            <ModeratorLayoutInner>{children}</ModeratorLayoutInner>
        </AuthProvider>
    );
}
