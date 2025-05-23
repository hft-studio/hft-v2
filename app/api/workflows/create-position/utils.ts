import { ethers } from "ethers";
import type{ TransactionReceipt } from "./types";

export async function getTokenAmountFromSwapReceipt(
	receipt: TransactionReceipt,
	tokenAddress: string,
	decimals: number,
) {
	if (!ethers.utils.isAddress(tokenAddress)) {
		throw new Error("Invalid token address");
	}
	if (!Number.isInteger(decimals) || decimals < 0) {
		throw new Error("Invalid decimals: Must be a non-negative integer");
	}

	const tokenAddrLower = tokenAddress.toLowerCase();
	for (const log of receipt.logs) {
		if (log.address.toLowerCase() === tokenAddrLower) {
			if (log.data && log.data !== "0x") {
				const amount = ethers.BigNumber.from(log.data);
				return amount.toBigInt();
			}
		}
	}

	return BigInt(0);
}

export function extractLpTokenInfoFromReceipt(
	receipt: TransactionReceipt & { receipt?: { logs: Array<{ topics: string[]; address: string; data: string }> } },
	smartAccountAddress: string,
): { lpTokenAddress?: string; lpTokenAmount?: bigint } {
	const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'; // Transfer event topic
	let lpTokenAddress: string | undefined;
	let lpTokenAmount: bigint | undefined;

	// Find the LP token address by looking for Transfer events
	const logs = receipt.receipt?.logs || [];
	for (const log of logs) {
		// Check if it's a Transfer event
		if (log.topics[0] === transferTopic) {
			// Check if recipient is the smart account (topics[2] contains the 'to' address)
			if (log.topics.length >= 3) {
				const topic2 = log.topics[2];
				if (typeof topic2 === 'string') {
					const toAddress = `0x${topic2.slice(-40).toLowerCase()}`;
					
					// If the recipient is our smart account
					if (toAddress === smartAccountAddress.toLowerCase()) {
						// This is likely the LP token
						lpTokenAddress = log.address;
						
						// Extract the amount from data
						if (log.data && log.data !== "0x") {
							lpTokenAmount = BigInt(log.data);
						}
						break;
					}
				}
			}
		}
	}

	return {
		lpTokenAddress,
		lpTokenAmount,
	};
}
