import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { UIProvider } from "@/contexts";

export const metadata: Metadata = {
    title: "SociaaNet, A social network for everyone",
    description: "Created by Nishan Bista"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <UIProvider>{children}</UIProvider>
                <Toaster />
            </body>
        </html>
    );
}
