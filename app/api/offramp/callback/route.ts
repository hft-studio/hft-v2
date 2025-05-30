import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { createRequest } from "@/lib/coinbase";
import { authOptions } from "@/lib/auth";
import { getAccount } from "@/lib/account";
import { getTokenBySymbol } from "@/lib/tokens";
import { ethers } from "ethers";
import { getBaseUrl } from "@/lib/utils";
import { cdpClient } from "@/lib/clients";
import { buildTransferCalls } from "@/lib/erc20";
import { stackServerApp } from "@/app/lib/stack.server";
const baseUrl = getBaseUrl();

export async function GET() {
	const user = await stackServerApp.getUser({ or: "redirect" });

	const { smartAccount } = await getAccount(user.id);
	if (!smartAccount) {
		throw new Error("Smart account not found");
	}

	const { url, jwt } = await createRequest({
		request_method: "GET",
		request_path: `/onramp/v1/sell/user/${user.id}/transactions`,
	});

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${jwt}`,
		},
	});

	const data = await response.json();
	const latestTransaction = data.transactions[0];
	if (!latestTransaction) {
		throw new Error("No recent transactions found");
	}

	const amount = latestTransaction.sell_amount.value;

	const symbol = latestTransaction.asset.toLocaleLowerCase();
	if (symbol !== "usdc") {
		throw new Error("Invalid asset");
	}
	const usdc = await getTokenBySymbol("USDC");
	const formattedAmount = ethers.utils.parseUnits(amount, 6);
	const calls = await buildTransferCalls(
		usdc.address as `0x${string}`,
		latestTransaction.to_address,
		formattedAmount.toBigInt(),
	);

	const result = await cdpClient.evm.sendUserOperation({
		smartAccount: smartAccount,
		network: "base",
		calls,
		paymasterUrl: process.env.PAYMASTER_URL,
	});

	const successUrl = new URL("/explore", baseUrl);

	return NextResponse.redirect(successUrl);
}
