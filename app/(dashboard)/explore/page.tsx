import { ExploreContent } from "./explore-content";
import { Social } from "@/app/components/social";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPositions } from "@/lib/positions";
import { getAccount } from "@/lib/account";
import { getUsdcAvailable } from "./utils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		redirect("/login");
	}
	const { smartAccount } = await getAccount(session?.user?.id as string);
	if (!smartAccount) {
		redirect("/login");
	}
	const positions = await getPositions(smartAccount.address);
	const usdcAvailable = await getUsdcAvailable(
		smartAccount.address,
	);
	const usdcAvailableFormatted = Number.parseFloat(usdcAvailable).toFixed(2);
	return (
		<div className="relative min-h-screen">
			<ExploreContent
				positions={positions}
				usdcAvailable={usdcAvailableFormatted}
				userId={session?.user?.id}
				smartAccountAddress={smartAccount.address}
				name={session?.user?.name as string}
			/>
			<div className="py-10">
				<Social position="relative" className="mt-12 mb-6" />
			</div>
		</div>
	);
}
