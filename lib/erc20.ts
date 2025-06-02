import { encodeFunctionData, erc20Abi } from "viem";
import { readContract } from "viem/actions";
import { publicClient } from "./clients";
import type { EvmSmartAccount } from "@coinbase/cdp-sdk";
import { executeTransactionWithRetries } from "./account";

export function buildApproveCalls(params: {
	tokens: {
		address: string;
		amount: bigint;
	}[];
	spenderAddress: string;
}) {
	const calls = params.tokens.map((token) => {
		return {
			to: token.address as `0x${string}`,
			data: encodeFunctionData({
				abi: [
					{
						inputs: [
							{ name: "spender", type: "address" },
							{ name: "amount", type: "uint256" },
						],
						name: "approve",
						outputs: [{ name: "", type: "bool" }],
						stateMutability: "nonpayable",
						type: "function",
					},
				],
				functionName: "approve",
				args: [params.spenderAddress as `0x${string}`, token.amount],
			}),
			value: BigInt(0),
		};
	});
	return calls;
}

export const getRawBalance = async (
	tokenAddress: `0x${string}`,
	acountAddress: `0x${string}`,
) => {
	const balance = await readContract(publicClient, {
		address: tokenAddress,
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
		args: [acountAddress],
	});
	return balance;
};

export const transfer = async (
	tokenAddress: `0x${string}`,
	to: `0x${string}`,
	amount: bigint,
	smartAccount: EvmSmartAccount,
) => {
	const calls = [
		{
			to: tokenAddress,
			data: encodeFunctionData({
				abi: erc20Abi,
				functionName: "transfer",
				args: [to, amount],
			}),
			value: BigInt(0),
		},
	];

	const receipt = await executeTransactionWithRetries(smartAccount, calls);

	return {
		success: receipt.status === 'success',
		txHash: receipt.transactionHash,
	};
};


export const buildTransferCalls = async (
	tokenAddress: `0x${string}`,
	to: `0x${string}`,
	amount: bigint,
) => {
	const calls = [
		{
			to: tokenAddress,
			data: encodeFunctionData({
				abi: erc20Abi,
				functionName: "transfer",
				args: [to, amount],
			}),
			value: BigInt(0),
		},
	];

	return calls;
};