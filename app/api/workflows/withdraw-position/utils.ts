import type { EvmSmartAccount } from "@coinbase/cdp-sdk";
import { getPoolData } from "@/lib/pools";
import { publicClient } from "@/lib/clients";
import type { TransactionReceipt } from "viem";
import { erc20Abi } from "viem";
import { readContract } from "viem/actions";
import { formatUnits, parseUnits } from "ethers/lib/utils";

export function getReceivedTokenAmount(
	receipt: TransactionReceipt,
	recipientAddress: string,
	tokenAddress: string,
	tokenDecimals: number,
): string | null {
	const recipient = recipientAddress.toLowerCase();
	const token = tokenAddress.toLowerCase();

	const transferTopic =
		"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

	for (const log of receipt.logs) {
		if (
			log.address.toLowerCase() === token &&
			log.topics[0] === transferTopic
		) {
			if (log.topics.length >= 3) {
				const topic2 = log.topics[2];
				if (typeof topic2 === "string") {
					const toAddress = `0x${topic2.slice(-40).toLowerCase()}`;
					if (toAddress === recipient) {
						const amountHex = log.data;
						try {
							const amount = parseUnits(
								formatUnits(BigInt(amountHex), tokenDecimals),
								tokenDecimals,
							);
							return amount.toString();
						} catch (error) {
							console.error(`Error parsing amount from log: ${error}`);
						}
					}
				}
			}
		}
	}

	return null;
}



export const getStakedBalance = async (poolId: number, smartAccount: EvmSmartAccount) => {
    const poolData = await getPoolData(poolId);
    const gaugeAddress = poolData?.gauge_address;
    const stakedBalance = await readContract(
        publicClient,
        {
            address: gaugeAddress as `0x${string}`,
            abi: [{
                inputs: [{ name: "account", type: "address" }],
                name: "balanceOf",
                outputs: [{ name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function"
            }],
            functionName: "balanceOf",
            args: [smartAccount.address]
        }
    ) as bigint;

    return stakedBalance;
}

export const getUnstakedBalance = async ({
    poolId,
    smartAccount
}: {
    poolId: number,
    smartAccount: EvmSmartAccount
}) => {
    const poolData = await getPoolData(poolId);
    if (!poolData) {
        throw new Error(`Pool not found: ${poolId}`);
    }
    const unstakedBalance = await readContract(
        publicClient,
        {
            address: poolData.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [smartAccount.address]
        }
    ) as bigint;
    return unstakedBalance;
}