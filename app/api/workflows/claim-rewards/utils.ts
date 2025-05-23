import { readContract } from "viem/actions";
import { publicClient } from "@/lib/clients";
import { poolsTable } from "@/db/schema";
import { db } from "@/db";
import { ethers } from "ethers";
import { encodeFunctionData } from "viem";

export const readAmountEarned = async (
	gaugeAddress: `0x${string}`,
	address: `0x${string}`,
) => {
	const earned = (await readContract(publicClient, {
		address: gaugeAddress,
		functionName: "earned",
		args: [address],
		abi: [
			{
				inputs: [{ name: "account", type: "address" }],
				name: "earned",
				outputs: [{ name: "", type: "uint256" }],
				stateMutability: "view",
				type: "function",
			},
		],
	})) as bigint;
	return earned;
};

export const getRewardsTokenPrice = async () => {
	const url =
		"https://api.coinbase.com/api/v3/brokerage/market/products/AERO-USD";
	const response = await fetch(url);
	const data = await response.json();
	return data.price;
};

export const calculateTotalEarnedInUSD = async (address: `0x${string}`) => {
	const pools = await db.select().from(poolsTable);
	const totalEarned = await Promise.all(
		pools.map(async (pool) => {
			const earned = await readAmountEarned(
				pool.gauge_address as `0x${string}`,
				address,
			);
			const earnedInReadable = ethers.utils.formatUnits(earned, 18);
			const price = await getRewardsTokenPrice();
			return {
				earned: Number(earnedInReadable) * price,
				gaugeAddress: pool.gauge_address,
			};
		}),
	);
	return {
		totalEarned: totalEarned.reduce((sum, amount) => sum + amount.earned, 0),
		earningsArray: totalEarned,
	};
};

export const buildClaimCalls = async (
	accountAddress: `0x${string}`,
	pools: { earned: number; gaugeAddress: string }[],
) => {
    const calls: {to: `0x${string}`, data: `0x${string}`, value: bigint}[] = [];
	for (const pool of pools) {
		if (pool.earned > 0) {
			calls.push({
				to: pool.gaugeAddress as `0x${string}`,
				data: encodeFunctionData({
					abi: [
						{
							name: "getReward",
							type: "function",
							inputs: [{ name: "account", type: "address" }],
							outputs: [],
							stateMutability: "nonpayable",
						},
					],
					functionName: "getReward",
					args: [accountAddress],
				}),
				value: BigInt(0),
			});
		}
	}
	return calls;
};
