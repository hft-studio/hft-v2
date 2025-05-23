import { getAccount } from "@/lib/account";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { buildClaimCalls, calculateTotalEarnedInUSD } from "./utils";
import { cdpClient, bundlerClient } from "@/lib/clients";
import { sellAsset } from "@/lib/swap";
import { getTokenBySymbol } from "@/lib/tokens";
import { getRawBalance, transfer } from "@/lib/erc20";
import { ethers } from "ethers";

const VAULT_ADDRESS = process.env.VAULT_ADDRESS;
if (!VAULT_ADDRESS) {
	throw new Error("VAULT_ADDRESS is not defined");
}

export interface ClaimRewardsInput {
	userId: string;
	walletAddress: string;
}

const API_KEY = process.env.WORKFLOW_API_KEY;
if (!API_KEY) {
	throw new Error("WORKFLOW_API_KEY is not defined");
}

export async function POST(request: NextRequest) {
	const accessToken = request.headers.get("x-access-token");
	if (accessToken !== API_KEY) {
		return NextResponse.json(
			{ error: "Invalid access token" },
			{ status: 401 },
		);
	}
	const { userId, walletAddress } = (await request.json()) as ClaimRewardsInput;
	const { smartAccount } = await getAccount(userId);
	if (!smartAccount) {
		return NextResponse.json(
			{ error: "Smart account not found" },
			{ status: 400 },
		);
	}
	const { totalEarned, earningsArray } = await calculateTotalEarnedInUSD(
		walletAddress as `0x${string}`,
	);
	if (totalEarned < 0) {
		return NextResponse.json({ success: true, message: "Ballance is too low" });
	}


	const calls = await buildClaimCalls(
		walletAddress as `0x${string}`,
		earningsArray,
	);
	if (calls.length > 0) {
		const result = await cdpClient.evm.sendUserOperation({
			smartAccount: smartAccount,
			network: "base",
			calls: calls,
			paymasterUrl: process.env.PAYMASTER_URL,
		});
		const receipt = await bundlerClient.waitForUserOperationReceipt({
			hash: result.userOpHash,
		});
		const token = await getTokenBySymbol("AERO");
		const balance = await getRawBalance(
			token.address as `0x${string}`,
			walletAddress as `0x${string}`,
		);
		const sellAssetReceipt = await sellAsset({
			smartAccount: smartAccount,
			asset: {
				address: token.address as `0x${string}`,
				amount: balance.toString(),
			},
		});
		const usdc = await getTokenBySymbol("USDC");
		const { decimals, address: usdcAddress } = usdc;
		const feeAmount = ethers.utils.parseUnits("0.1", decimals);
		const transferReceipt = await transfer(
			usdcAddress as `0x${string}`,
			VAULT_ADDRESS as `0x${string}`,
			feeAmount.toBigInt(),
			smartAccount,
		);
		if (!transferReceipt.success) {
			return NextResponse.json({ success: false, message: "Transfer failed" });
		}

		return NextResponse.json({ success: true });
	}
	return NextResponse.json({ success: true, message: "Ballance is too low" });
}
