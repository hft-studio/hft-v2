import { base } from "viem/chains";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import type {
	SwapOptionsSwapRouter02,
	SwapRoute,
} from "@uniswap/smart-order-router";
import { TradeType, CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import type { EvmSmartAccount } from "@coinbase/cdp-sdk";
import { buildApproveCalls } from "./erc20";
import { alchemyProvider } from "./clients";
import { getTokenAmountFromSwapReceipt } from "@/app/api/workflows/create-position/utils";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { tokensTable } from "@/db/schema";
import { getToken } from "./tokens";
import { executeTransactionWithRetries } from "./account";

type TokenData = typeof tokensTable.$inferSelect;

export async function generateRoute(params: {
	tokenIn: TokenData;
	tokenOut: TokenData;
	walletAddress: string;
	rawAmount: string;
}): Promise<SwapRoute | null> {
	const { tokenIn, tokenOut, walletAddress, rawAmount } = params;
	const tokenInToken = new Token(
		base.id,
		tokenIn.address,
		tokenIn.decimals,
		tokenIn.symbol,
		tokenIn.symbol,
	);

	const tokenOutToken = new Token(
		base.id,
		tokenOut.address,
		tokenOut.decimals,
		tokenOut.symbol,
		tokenOut.symbol,
	);

	const router = new AlphaRouter({
		chainId: base.id,
		provider: alchemyProvider,
	});

	const options: SwapOptionsSwapRouter02 = {
		recipient: walletAddress,
		slippageTolerance: new Percent(100, 10_000),
		deadline: Math.floor(Date.now() / 1000 + 1800),
		type: SwapType.SWAP_ROUTER_02,
	};

	const route = await router.route(
		CurrencyAmount.fromRawAmount(tokenInToken, rawAmount),
		tokenOutToken,
		TradeType.EXACT_INPUT,
		options,
	);

	return route;
}

export async function buildSwapCalls(params: {
	smartAccount: EvmSmartAccount;
	tokenIn: TokenData;
	tokenOut: TokenData;
	amount: bigint;
}) {
	const route = await generateRoute({
		tokenIn: params.tokenIn,
		tokenOut: params.tokenOut,
		walletAddress: params.smartAccount.address,
		rawAmount: params.amount.toString(),
	});
	if (!route) {
		throw new Error("No route found");
	}
	const [approveCall] = buildApproveCalls({
		tokens: [
			{
				address: params.tokenIn.address,
				amount: params.amount,
			},
		],
		spenderAddress: route.methodParameters?.to as `0x${string}`,
	});
	const swapCall = {
		to: route.methodParameters?.to as `0x${string}`,
		data: route.methodParameters?.calldata as `0x${string}`,
		value: BigInt(0),
	};
	const calls = [approveCall, swapCall];
	return calls;
}

export async function sellAsset(params: {
	smartAccount: EvmSmartAccount;
	asset: {
		address: string,
		amount: string;
	};
}) {

	const usdcToken = await getToken(1);
	if (params.asset.address.toLowerCase() === usdcToken.address.toLowerCase()) {
		return {
			usdcAmount: params.asset.amount,
			tokenInAddress: params.asset.address,
			amountIn: params.asset.amount
		}
	}
	const token = await db.query.tokensTable.findFirst({
		where: eq(tokensTable.address, params.asset.address.toLowerCase())
	});
	if (!token) {
		throw new Error(`Token not found: ${params.asset.address}`);
	}
	const swapCalls = await buildSwapCalls({
		smartAccount: params.smartAccount,
		tokenIn: token,
		tokenOut: usdcToken,
		amount: BigInt(params.asset.amount)
	});
	const swapReceipt = await executeTransactionWithRetries(params.smartAccount, swapCalls);
	if (swapReceipt.status !== 'success') {
		throw new Error("Swap reverted");
	}

	const amount = await getTokenAmountFromSwapReceipt(swapReceipt, usdcToken.address as `0x${string}`, usdcToken.decimals as number);
	return {
		usdcAmount: amount.toString(),
		tokenInAddress: params.asset.address,
		amountIn: params.asset.amount
	}
}