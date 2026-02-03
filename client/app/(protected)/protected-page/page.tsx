"use client";

import { useAuth } from "@/contexts";

export default function Page() {
    const { data: currentUserData } = useAuth();
    console.log("current user data in protected-page.tsx", currentUserData);

    return (
        <>
            <div>Protected Page</div>
        </>
    );
}
