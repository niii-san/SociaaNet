import { AuthHome } from "@/components/home/auth-home";
import { UnAuthHome } from "@/components/home/unauth-home";
import { validateSessionServer } from "@/lib/auth.server";
import { AuthProvider } from "@/contexts";
import { GuestNavbar } from "@/components/guest-navbar";

export default async function Page() {
    const isSessionValid = await validateSessionServer();

    if (!isSessionValid) {
        return (
            <>
                <GuestNavbar />
                <UnAuthHome />;
            </>
        );
    }

    return (
        <AuthProvider>
            <AuthHome />
        </AuthProvider>
    );
}
