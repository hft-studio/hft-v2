import { RewardsContent } from "./rewards-content";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/account";
import { getUsdcAvailable } from "../explore/utils";
import { Social } from "@/app/components/social";
import { ContentContainer } from "@/components/layout/content-container";
import { Navbar } from "@/app/components/navbar";
import { stackServerApp } from "@/app/lib/stack.server";

export default async function Rewards() {

	const user = await stackServerApp.getUser({ or: "redirect" });

	const { smartAccount } = await getAccount(user.id);
	if (!smartAccount) {
		redirect("/handler/sign-in");
	}
    const smartAccountAddress = smartAccount.address;
    const usdcAvailable = await getUsdcAvailable(smartAccount.address);
    const userId = user.id;
    const name = user.displayName as string;
	return (
		<div className="relative min-h-screen">
            <div className="min-h-screen bg-black text-white">
			<Navbar
				userData={{ usdcAvailable, smartAccountAddress, userId, name }}
			/>
			<ContentContainer>
                <RewardsContent />
			</ContentContainer>
		</div>
			<div className="py-10">
				<Social position="relative" className="mt-12 mb-6" />
			</div>
		</div>
	);
}
