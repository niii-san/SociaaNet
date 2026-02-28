import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, FollowProvider, ChatProvider } from "@/contexts";
import { validateSessionServer } from "@/lib/auth.server";
import { redirect } from "next/navigation";

export default async function Layout({
    children
}: {
    children: React.ReactNode;
}) {
    const isSessionValid = await validateSessionServer();

    if (!isSessionValid) redirect("/login");

    return (
        <AuthProvider>
            <FollowProvider>
                <ChatProvider>
                    <div className="min-h-screen bg-background">
                        <div className="max-w-7xl mx-auto flex">
                            <AppSidebar />
                            <main className="flex-1 min-h-screen border-r border-border max-w-2xl">
                                {children}
                            </main>
                            <aside className="hidden xl:block w-80 h-screen sticky top-0 p-4"></aside>
                        </div>
                    </div>
                </ChatProvider>
            </FollowProvider>
        </AuthProvider>
    );
}
