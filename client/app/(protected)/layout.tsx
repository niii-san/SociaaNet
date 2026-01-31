
import { AppSidebar } from "@/components/app-sidebar";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto flex">
                <AppSidebar />
                <main className="flex-1 min-h-screen border-r border-border max-w-2xl">
                    {children}
                </main>
                {/* Placeholder for right sidebar if needed across protected routes, or can be page specific */}
                <aside className="hidden xl:block w-80 h-screen sticky top-0 p-4">
                    {/* Empty or global widgets could go here */}
                </aside>
            </div>
        </div>
    );
}
