import { ExploreContent } from "./explore-content";
import { Social } from "@/app/components/social";
import { getPositions } from "@/lib/positions";
import { getAccount } from "@/lib/account";
import { getUsdcAvailable } from "./utils";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/lib/stack/stack.server";

export default async function DashboardPage() {

	redirect("/beta");

	// const user = await stackServerApp.getUser({ or: "redirect" });

	// const permission = await user.getPermission('beta');
	// if (!permission) {
	// 	redirect("/beta");
	// }
	// const { smartAccount } = await getAccount(user.id);
	// if (!smartAccount) {
	// 	redirect("/handler/sign-in");
	// }
	// const positions = await getPositions(smartAccount.address);
	// const usdcAvailable = await getUsdcAvailable(
	// 	smartAccount.address,
	// );
	// const usdcAvailableFormatted = Number.parseFloat(usdcAvailable).toFixed(2);
	// return (
	// 	<div className="relative min-h-screen">
	// 		<ExploreContent
	// 			positions={positions}
	// 			usdcAvailable={usdcAvailableFormatted}
	// 			userId={user.id}
	// 			smartAccountAddress={smartAccount.address}
	// 			name={user.displayName as string}
	// 		/>
	// 		<div className="py-10">
	// 			<Social position="relative" className="mt-12 mb-6" />
	// 		</div>
	// 	</div>
	// );
}
