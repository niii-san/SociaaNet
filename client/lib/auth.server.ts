import { cookies } from "next/headers";
import { API_ENDPOINT } from "./constants";

export async function validateSessionServer() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) return null;

    try {
        const res = await fetch(`${API_ENDPOINT}/auth/validate-session`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${sessionId}`
            },
            cache: "no-store"
        });

        if (!res.ok) return null;

        return await res.ok;
    } catch {
        return false;
    }
}
