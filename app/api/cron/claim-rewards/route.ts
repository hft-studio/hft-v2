import { db } from "@/db";
import type { NextRequest } from "next/server";
import { wallets as walletsTable } from "@/db/schema";
import type { ClaimRewardsInput } from "@/app/api/workflows/claim-rewards/route";
import { getBaseUrl } from "@/lib/utils";
const cronSecret = process.env.CRON_SECRET;
if (!cronSecret) {
	throw new Error("CRON_SECRET is not set");
}

const baseUrl = getBaseUrl();

if (!cronSecret) {
	throw new Error("CRON_SECRET is not set");
}

const workflowApiKey = process.env.WORKFLOW_API_KEY;
if (!workflowApiKey) {
	throw new Error("WORKFLOW_API_KEY is not set");
}

export const GET = async (request: NextRequest) => {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${cronSecret}`) {
		return new Response("Unauthorized", {
			status: 401,
		});
	}
	const wallets = await db.select().from(walletsTable);
	for (const wallet of wallets) {
		const body: ClaimRewardsInput = {
			userId: wallet.user_id,
			walletAddress: wallet.smart_account_address,
		};
		fetch(`${baseUrl}/api/workflows/claim-rewards`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
				"x-access-token": workflowApiKey,
			},
		});
	}
	return new Response("OK", {
		status: 200,
	});
};
