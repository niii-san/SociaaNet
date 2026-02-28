import { UnAuthHome } from "@/components/home/unauth-home";
import { validateSessionServer } from "@/lib/auth.server";
import { GuestNavbar } from "@/components/guest-navbar";
import { redirect } from "next/navigation";

export default async function Page() {
    const isSessionValid = await validateSessionServer();

    if (isSessionValid) {
        redirect("/home");
    }

    return (
        <>
            <GuestNavbar />
            <UnAuthHome />
        </>
    );
}
