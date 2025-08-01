import { Navbar } from "@/app/components/navbar";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { betaSignUpsTable } from "@/db/schema/domain";
import { stackServerApp } from "@/lib/stack/stack.server";
import { eq } from "drizzle-orm";
import { MagicLinkSignIn } from "@/app/components/sign-in-component";
import Image from "next/image";
import PageClient from "./page-clientt";
export default async function BetaPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>;
}) {
    // const user = await stackServerApp.getUser({ or: "redirect" });
    // if (!user) {
    //     redirect("/handler/sign-in");
    // }
    // const betaSignUp = await db.select().from(betaSignUpsTable).where(eq(betaSignUpsTable.user_id, user.id));
    const params = await searchParams;
    //const account = await getAccount(user.id);

    // const usdcAvailable = await getUsdcAvailable(
    // 	account?.smartAccount?.address as `0x${string}`,
    // );
    // const handleSignUp = async () => {
    //     "use server";
    //     await db.insert(betaSignUpsTable).values({
    //         user_id: user.id,
    //         created_at: new Date(),
    //     });
    //     redirect("/beta?success=true");
    // }

    return (
        <div className="relative min-h-screen bg-black text-white">
            {/* Navbar */}
            <Navbar showTabs={false} showWallet={false} showAuth={false} />

            <PageClient />
            {/* Main Content */}
            
        </div>
    );
}