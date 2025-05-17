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
