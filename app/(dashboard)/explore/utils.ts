import { db } from "@/db";
import { poolsTable } from "@/db/schema";
import { readContract } from "viem/actions";
import { publicClient } from "@/lib/clients";
import { getTokenBySymbol } from "@/lib/tokens";
import { formatUnits } from "ethers/lib/utils";
export async function getPools() {
	const pools = await db.select().from(poolsTable);
	return pools;
}

export async function getUsdcAvailable(address: `0x${string}`) {
    const usdcAddress = (await getTokenBySymbol('USDC')).address as `0x${string}`
	const availableUsdc = await readContract(publicClient, {
		address: usdcAddress,
		abi: [{
			inputs: [{ name: "account", type: "address" }],
			name: "balanceOf",
			outputs: [{ name: "", type: "uint256" }],
			stateMutability: "view",
			type: "function",
		}],
		functionName: "balanceOf",
		args: [address],
	});
	return formatUnits(availableUsdc, 6);
}