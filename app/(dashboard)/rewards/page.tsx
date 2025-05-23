import { RewardsContent } from "./rewards-content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAccount } from "@/lib/account";
import { getUsdcAvailable } from "../explore/utils";
import { Social } from "@/app/components/social";
import { ContentContainer } from "@/components/layout/content-container";
import { Navbar } from "@/app/components/navbar";
export default async function Rewards() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		redirect("/login");
	}
	const { smartAccount } = await getAccount(session?.user?.id as string);
	if (!smartAccount) {
		redirect("/login");
	}
	const usdcAvailable = await getUsdcAvailable(smartAccount.address);
    const smartAccountAddress = smartAccount.address;
    const userId = session?.user?.id as string;
    const name = session?.user?.name as string;
	return (
		<div className="relative min-h-screen">
            <div className="min-h-screen bg-black text-white">
			<Navbar
				usdcAvailable={usdcAvailable}
				smartAccountAddress={smartAccountAddress}
				userId={userId}
				name={name}
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
