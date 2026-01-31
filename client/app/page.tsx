"use client";

import { AuthHome } from "@/components/home/auth-home";
import { UnAuthHome } from "@/components/home/unauth-home";
import { useAuth } from "@/contexts";

export default function Page() {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) return <AuthHome />;
    return <UnAuthHome />;
}
