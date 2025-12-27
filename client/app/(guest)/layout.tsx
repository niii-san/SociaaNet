import { GuestNavbar } from "@/components/guest-navbar";
import { Footer } from "@/components/footer";

export default function GuestLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <GuestNavbar />
            {children}
            <Footer />
        </>
    );
}
