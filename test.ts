import { db } from "./db";
import { getPositions } from "./lib/positions";
import { wallets } from "./db/schema";
import { eq } from "drizzle-orm";

const addresses = await db.select().from(wallets);
addresses.forEach(async (address) => {
const claimRewardResult = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/workflows/claim-rewards`, {
	method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-access-token": process.env.WORKFLOW_API_KEY as string,
    },
	body: JSON.stringify({
		userId: address.user_id,
		walletAddress: address.smart_account_address
		}),
	});
	console.log(claimRewardResult);
});