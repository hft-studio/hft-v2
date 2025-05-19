import { db } from "@/db";
import { poolsTable } from "@/db/schema/domain";
import { createPublicClient } from "viem";
import { http } from "viem";
import { readContract } from "viem/actions";
import { base } from "viem/chains";

const publicClient = createPublicClient({
	chain: base,
	transport: http(process.env.PAYMASTER_URL),
});

export const getPositions = async (smartAccountAddress: `0x${string}`) => {
	const pools = await db.select().from(poolsTable);
	const positions = await Promise.all(
		pools.map(async (pool) => {
			const [balance, totalSupply] = await Promise.all([
				readContract(publicClient, {
					address: pool.gauge_address as `0x${string}`,
					functionName: "balanceOf",
					args: [smartAccountAddress],
					abi: [
						{
							inputs: [{ name: "account", type: "address" }],
							name: "balanceOf",
							outputs: [{ name: "", type: "uint256" }],
							stateMutability: "view",
							type: "function",
						},
					],
				}) as Promise<bigint>,
				readContract(publicClient, {
					address: pool.gauge_address as `0x${string}`,
					functionName: "totalSupply",
					args: [],
					abi: [
						{
							inputs: [],
							name: "totalSupply",
							outputs: [{ name: "", type: "uint256" }],
							stateMutability: "view",
							type: "function",
						},
					],
				}) as Promise<bigint>,
			]);
			const share = Number(balance) / Number(totalSupply);
			const token0Amount = share * pool.reserve0_usd;
			const token1Amount = share * pool.reserve1_usd;

			return {
				pool: pool,
				token0Amount: token0Amount.toString(),
				token1Amount: token1Amount.toString(),
				totalAmount: (token0Amount + token1Amount).toString(),
			};
		}),
	);
	return positions;
};
