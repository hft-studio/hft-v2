import { getPoolData } from "@/lib/pools";
import { buildSwapCalls } from "@/lib/swap";
import { db } from "@/db";
import { poolsTable } from "@/db/schema";
import { ADD_LIQUIDITY_ABI, GAUGE_DEPOSIT_ABI } from "./types";
import { buildApproveCalls } from "@/lib/erc20";
import type { EvmSmartAccount } from "@coinbase/cdp-sdk";
import { eq } from "drizzle-orm";
import { encodeFunctionData, erc20Abi } from "viem";
import { getToken, getTokenBySymbol } from "@/lib/tokens";
import {
	getTokenAmountFromSwapReceipt,
} from "./utils";
import { ethers } from "ethers";
import { executeTransactionWithRetries } from "@/lib/account";
import { publicClient } from "@/lib/clients";

export async function balanceAssets(params: {
	poolId: number;
	usdcAmount: string;
	smartAccount: EvmSmartAccount;
}) {
	const rawUsdcAmount = ethers.utils
		.parseUnits(params.usdcAmount.toString(), 6)
		.toBigInt();

	const poolData = await db
		.select()
		.from(poolsTable)
		.where(eq(poolsTable.id, params.poolId))
		.limit(1);

	if (!poolData) {
		throw new Error("Pool not found");
	}
	const token0 = await getToken(poolData[0].token0);
	const token1 = await getToken(poolData[0].token1);
	const tokens = [token0, token1];
	if (!token0 || !token1) {
		throw new Error("Pool not found");
	}
	const amountToBuy = rawUsdcAmount / BigInt(2);
	const tokenIn = await getTokenBySymbol('USDC');
	const assets = [];
	for (const token of tokens) {
		if (token?.symbol !== "USDC") {
			const rawAmount = await buyAsset({
				usdcAmount: amountToBuy,
				smartAccount: params.smartAccount,
				tokenIn: tokenIn.id,
				tokenOut: token.id,
			});
			assets.push({
				tokenId: token.id,
				amount: rawAmount,
			});
		} else {
			assets.push({
				tokenId: token.id,
				amount: amountToBuy,
			});
		}
	}
	const rawAssets = assets.map((asset) => ({
		tokenId: asset.tokenId ?? 0,
		amount: BigInt(
			asset.amount.toString() === "0x" ? "0" : asset.amount.toString(),
		),
	}));
	return rawAssets;
}

export async function buyAsset(params: {
	usdcAmount: bigint;
	smartAccount: EvmSmartAccount;
	tokenIn: number;
	tokenOut: number;
}) {
	const tokenIn = await getToken(params.tokenIn);
	const tokenOut = await getToken(params.tokenOut);

	const calls = await buildSwapCalls({
		smartAccount: params.smartAccount,
		tokenIn,
		tokenOut,
		amount: params.usdcAmount,
	});

	const receipt = await executeTransactionWithRetries(params.smartAccount, calls);
	const amount = await getTokenAmountFromSwapReceipt(
		receipt,
		tokenOut.address,
		tokenOut.decimals,
	);
	return amount;
}

export async function depositInPool(params: {
	poolId: number;
	assets: {
		tokenId: number;
		amount: bigint;
	}[];
	smartAccount: EvmSmartAccount;
}) {
	const poolData = await getPoolData(params.poolId);
	if (!poolData) {
		throw new Error("Pool not found");
	}

	if (!poolData.token0Data || !poolData.token1Data) {
		throw new Error("Pool token data is incomplete");
	}

	const token0Asset = params.assets.find(
		(asset) => asset.tokenId === poolData.token0Data?.id,
	);
	const token1Asset = params.assets.find(
		(asset) => asset.tokenId === poolData.token1Data?.id,
	);

	if (!token0Asset || !token1Asset) {
		throw new Error("Missing asset data for one or both tokens");
	}

	const token0 = {
		address: poolData.token0Data.address as string,
		symbol: poolData.token0Data.symbol as string,
		decimals: poolData.token0Data.decimals as number,
		amount: token0Asset.amount,
	};

	const token1 = {
		address: poolData.token1Data.address as string,
		symbol: poolData.token1Data.symbol as string,
		decimals: poolData.token1Data.decimals as number,
		amount: token1Asset.amount,
	};
	const approveCalls = buildApproveCalls({
		tokens: [token0, token1],
		spenderAddress: poolData.swapExchangeData?.swap_address as `0x${string}`,
	});

	const amountAMin = BigInt(0);
	const amountBMin = BigInt(0);
	const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

	const depositCall = {
		to: poolData.swapExchangeData?.swap_address as `0x${string}`,
		value: BigInt(0),
		data: encodeFunctionData({
			abi: ADD_LIQUIDITY_ABI,
			functionName: "addLiquidity",
			args: [
				token0.address as `0x${string}`,
				token1.address as `0x${string}`,
				false,
				token0.amount,
				token1.amount,
				amountAMin,
				amountBMin,
				params.smartAccount.address,
				deadline,
			],
		}),
	};

	const receipt = await executeTransactionWithRetries(params.smartAccount, [...approveCalls, depositCall]);

	return receipt;
}

export async function depositInGauge(params: {
	poolId: number;
	smartAccount: EvmSmartAccount;
}) {
	const poolData = await getPoolData(params.poolId);
	const lpTokenAddress = poolData?.address;
	const lpTokenAmount = await publicClient.readContract({
		address: lpTokenAddress as `0x${string}`,
		abi: erc20Abi,
		functionName: "balanceOf",
		args: [params.smartAccount.address],
	});
	

	const [approveCall] = buildApproveCalls({
		tokens: [
			{
				address: lpTokenAddress as `0x${string}`,
				amount: lpTokenAmount,
			},
		],
		spenderAddress: poolData?.gauge_address as `0x${string}`,
	});

	const depositCall = {
		to: poolData?.gauge_address as `0x${string}`,
		value: BigInt(0),
		data: encodeFunctionData({
			abi: GAUGE_DEPOSIT_ABI,
			functionName: "deposit",
			args: [lpTokenAmount],
		}),
	};

	const receipt = await executeTransactionWithRetries(params.smartAccount, [approveCall, depositCall]);
	return receipt;
}
