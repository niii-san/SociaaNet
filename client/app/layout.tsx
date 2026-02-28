import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { UIProvider, ThemeProvider } from "@/contexts";
import { themeScript } from "@/lib/theme-script";

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
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className={`antialiased`}>
                <ThemeProvider>
                    <UIProvider>{children}</UIProvider>
                    <Toaster richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
