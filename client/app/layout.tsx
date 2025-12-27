import type { Metadata } from "next";
import "./globals.css";
import { GuestNavbar } from "@/components/guest-navbar";
import { Footer } from "@/components/footer";

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
                <GuestNavbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
