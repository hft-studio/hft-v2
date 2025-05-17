import { base } from "viem/chains";
import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import type {
	SwapOptionsSwapRouter02,
	SwapRoute,
} from "@uniswap/smart-order-router";
import { TradeType, CurrencyAmount, Percent, Token } from "@uniswap/sdk-core";
import type { EvmSmartAccount } from "@coinbase/cdp-sdk";
import { buildApproveCalls } from "./erc20";
import type { tokensTable } from "@/db/schema";
import { alchemyProvider } from "./alchemy-providers";

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
    console.log('building route')
    console.log('rawAmount', rawAmount);
    console.log('tokenInToken', tokenInToken);

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
    console.log('amoutn in buildSwapCalls!!!!!!!!', params.amount);
	const route = await generateRoute({
		tokenIn: params.tokenIn,
		tokenOut: params.tokenOut,
		walletAddress: params.smartAccount.address,
		rawAmount: params.amount.toString(),
	});
	if (!route) {
		throw new Error("No route found");
	}
    console.log('route', route);
	const [approveCall] = buildApproveCalls({
		tokens: [
			{
				address: params.tokenIn.address,
				symbol: params.tokenIn.symbol,
				decimals: params.tokenIn.decimals,
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
	console.log("calls", calls);
	return calls;
}
