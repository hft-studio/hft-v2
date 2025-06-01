import { Navbar } from "@/app/components/navbar";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { betaSignUpsTable } from "@/db/schema/domain";
import { stackServerApp } from "@/app/lib/stack.server";
import { eq } from "drizzle-orm";
import { BetaSignupForm } from "./beta-signup-form";
import { getAccount } from "@/lib/account";
import { getUsdcAvailable } from "../explore/utils";

export default async function BetaPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>;
}) {
    const user = await stackServerApp.getUser({ or: "redirect" });
    if (!user) {
        redirect("/handler/sign-in");
    }
    const betaSignUp = await db.select().from(betaSignUpsTable).where(eq(betaSignUpsTable.user_id, user.id));
    const params = await searchParams;
    const account = await getAccount(user.id);

    const usdcAvailable = await getUsdcAvailable(
		account?.smartAccount?.address as `0x${string}`,
	);
    const handleSignUp = async () => {
        "use server";
        await db.insert(betaSignUpsTable).values({
            user_id: user.id,
            created_at: new Date(),
        });
        redirect("/beta?success=true");
    }

    return (
        <div className="relative min-h-screen">
            <div className="min-h-screen bg-black text-white">
                    <Navbar userData={{
                        usdcAvailable: usdcAvailable as string,
                        smartAccountAddress: account?.smartAccount?.address as string,
                        userId: user.id,
                        name: user.displayName as string,
                    }} 
                    showTabs={false}
                    showWallet={false}
                    />
                {betaSignUp.length > 0 ? (
                    <div className="flex flex-col items-center justify-center h-screen">
                        <Typography type="h1">Beta</Typography>
                        <p className="text-gray-400 text-center mt-4 mb-8 max-w-md">
                            You are on our closed beta waitlist. We'll be in touch soon.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-screen">
                        <Typography type="h1">Beta</Typography>
                        <p className="text-gray-400 text-center mt-4 mb-8 max-w-md">
                            We're currently in closed beta. Join our waitlist to get early access to our platform.
                        </p>
                        <BetaSignupForm 
                            handleSignUp={handleSignUp}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}