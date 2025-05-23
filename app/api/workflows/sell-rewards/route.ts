import { db } from "@/db";
import type { NextRequest } from "next/server";
import { exchangesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { readContract } from "viem/actions";
import { getAccount } from "@/lib/account";
import { sellAsset } from "@/lib/swap";
import { getToken } from "@/lib/tokens";
import { NextResponse } from "next/server";
import { publicClient } from "@/lib/clients";

interface SellRewardsBody {
	userId: string;
}

const API_KEY = process.env.WORKFLOW_API_KEY;
if (!API_KEY) {
	throw new Error("WORKFLOW_API_KEY is not defined");
}

export const POST = async (request: NextRequest) => {
	const accessToken = request.headers.get("x-access-token");
	if (accessToken !== API_KEY) {
		return NextResponse.json(
			{ error: "Invalid access token" },
			{ status: 401 },
		);
	}       
	const exchange = await db
		.select()
		.from(exchangesTable)
		.where(eq(exchangesTable.id, 1));
	const body = (await request.json()) as SellRewardsBody;
	const { userId } = body;
	const { smartAccount } = await getAccount(userId);
	if (!smartAccount) {
		return new Response("Smart account not found", { status: 400 });
	}
	const rewardTokenId = exchange[0].reward_token_id;
    const rewardToken = await getToken(rewardTokenId);

	const rewardTokenAmount = await readContract(publicClient, {
		address: rewardToken.address as `0x${string}`,
		abi: [
			{
				inputs: [{ name: "account", type: "address" }],
				name: "balanceOf",
				outputs: [{ name: "", type: "uint256" }],
				stateMutability: "view",
				type: "function",
			},
		],
		functionName: "balanceOf",
		args: [smartAccount.address],
	});
	const sellAssetResponse = await sellAsset({
		smartAccount,
		asset: {
			address: rewardToken.address,
			amount: rewardTokenAmount.toString(),
		},
	});
	console.log("sellAssetResponse", sellAssetResponse);
	return new Response("OK", { status: 200 });
};
