import type { EvmSmartAccount } from "@coinbase/cdp-sdk";
import { getPoolData } from "@/lib/pools";
import { cdpClient, bundlerClient, publicClient } from "@/lib/clients";
import type { TransactionReceipt } from "viem";
import { encodeFunctionData } from "viem";
import { readContract } from "viem/actions";
import { formatUnits, parseUnits } from "ethers/lib/utils";

export const withdrawFromPool = async ({
	poolId,
	smartAccount,
	unstakedBalance,
}: {
	poolId: number;
	smartAccount: EvmSmartAccount;
	unstakedBalance: bigint;
}) => {
	const poolData = await getPoolData(poolId);
	if (!poolData) {
		throw new Error(`Pool not found: ${poolId}`);
	}
	const approveCalls = [
		{
			to: poolData.address as `0x${string}`,
			data: encodeFunctionData({
				abi: [
					{
						constant: false,
						inputs: [
							{ name: "spender", type: "address" },
							{ name: "amount", type: "uint256" },
						],
						name: "approve",
						outputs: [{ name: "", type: "bool" }],
						payable: false,
						stateMutability: "nonpayable",
						type: "function",
					},
				],
				functionName: "approve",
				args: ["0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43", unstakedBalance],
			}),
		},
	];

	const removeLiquidityCalls = [
		{
			to: "0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43" as `0x${string}`,
			data: encodeFunctionData({
				abi: [
					{
						inputs: [
							{ name: "tokenA", type: "address" },
							{ name: "tokenB", type: "address" },
							{ name: "stable", type: "bool" },
							{ name: "liquidity", type: "uint256" },
							{ name: "amountAMin", type: "uint256" },
							{ name: "amountBMin", type: "uint256" },
							{ name: "to", type: "address" },
							{ name: "deadline", type: "uint256" },
						],
						name: "removeLiquidity",
						outputs: [
							{ name: "amountA", type: "uint256" },
							{ name: "amountB", type: "uint256" },
						],
						stateMutability: "nonpayable",
						type: "function",
					},
				],
				functionName: "removeLiquidity",
				args: [
					poolData.token0Data.address as `0x${string}`,
					poolData.token1Data.address as `0x${string}`,
					poolData.is_stable,
					unstakedBalance,
					BigInt(0),
					BigInt(0),
					smartAccount.address,
					BigInt(Math.floor(Date.now() / 1000) + 3600),
				],
			}),
		},
	];

	const withdrawFromPoolOperation = await cdpClient.evm.sendUserOperation({
		smartAccount: smartAccount,
		network: "base",
		calls: [...approveCalls, ...removeLiquidityCalls],
		paymasterUrl: process.env.PAYMASTER_URL,
	});

	const withdrawFromPoolReceipt =
		await bundlerClient.waitForUserOperationReceipt({
			hash: withdrawFromPoolOperation.userOpHash,
		});

	return withdrawFromPoolReceipt;
};

export const getUnstakedBalance = async ({
	poolId,
	smartAccount,
}: {
	poolId: number;
	smartAccount: EvmSmartAccount;
}) => {
	const poolData = await getPoolData(poolId);
	if (!poolData) {
		throw new Error(`Pool not found: ${poolId}`);
	}
	const unstakedBalance = (await readContract(publicClient, {
		address: poolData.address as `0x${string}`,
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
	})) as bigint;
	return unstakedBalance;
};

export const withdrawFromGauge = async ({
	poolId,
	smartAccount,
}: {
	poolId: number;
	smartAccount: EvmSmartAccount;
}) => {
	const poolData = await getPoolData(poolId);
	if (!poolData) {
		throw new Error(`Pool not found: ${poolId}`);
	}
	const gaugeAddress = poolData.gauge_address;
	const stakedBalance = (await readContract(publicClient, {
		address: gaugeAddress as `0x${string}`,
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
	})) as bigint;
	const calls = [
		{
			to: gaugeAddress as `0x${string}`,
			data: encodeFunctionData({
				abi: [
					{
						inputs: [{ name: "amount", type: "uint256" }],
						name: "withdraw",
						outputs: [],
						stateMutability: "nonpayable",
						type: "function",
					},
				],
				functionName: "withdraw",
				args: [stakedBalance],
			}),
			value: BigInt(0),
		},
	];
	const receipt = await cdpClient.evm.sendUserOperation({
		smartAccount: smartAccount,
		network: "base",
		calls: calls,
		paymasterUrl: process.env.PAYMASTER_URL,
	});

	return receipt;
};

export const getStakedBalance = async (
	poolId: number,
	smartAccount: EvmSmartAccount,
) => {
	const poolData = await getPoolData(poolId);
	const gaugeAddress = poolData?.gauge_address;
	const stakedBalance = (await readContract(publicClient, {
		address: gaugeAddress as `0x${string}`,
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
	})) as bigint;

	return stakedBalance;
};

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
