import { AuthHome } from "@/components/home/auth-home";
import { UnAuthHome } from "@/components/home/unauth-home";
import { validateSessionServer } from "@/lib/auth.server";
import { AuthProvider, FollowProvider, ChatProvider } from "@/contexts";
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
            <FollowProvider>
                <ChatProvider>
                    <AuthHome />
                </ChatProvider>
            </FollowProvider>
        </AuthProvider>
    );
}
