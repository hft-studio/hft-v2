import { getAccount } from "@/lib/account";
import {
	getUnstakedBalance,
	withdrawFromGauge,
	withdrawFromPool,
	getStakedBalance,
} from "./user-ops";
import { getReceivedTokenAmount } from "./utils";
import { getPoolData } from "@/lib/pools";
import type { NextRequest } from "next/server";
import { sellAsset } from "@/lib/swap";
import { NextResponse } from "next/server";
export const POST = async (req: NextRequest) => {
	const { poolId, userId } = await req.json();
	const { smartAccount } = await getAccount(userId);
	const poolData = await getPoolData(poolId);
	if (!smartAccount) {
		throw new Error("Smart account not found");
	}
	const stakedBalance = await getStakedBalance(poolId, smartAccount);
	if (stakedBalance > BigInt(0)) {
		const withdrawFromGaugeReceipt = await withdrawFromGauge({
			poolId: poolId,
			smartAccount: smartAccount,
			amount: stakedBalance,
		});
	}
	const unstakedBalance = await getUnstakedBalance({
		poolId: poolId,
		smartAccount: smartAccount,
	});
	if (unstakedBalance > BigInt(0)) {
		const withdrawFromPoolReceipt = await withdrawFromPool({
			poolId: poolId,
			smartAccount: smartAccount,
			unstakedBalance: unstakedBalance,
		});
		const token0Amount = await getReceivedTokenAmount(
			withdrawFromPoolReceipt,
			smartAccount.address,
			poolData?.token0Data.address as `0x${string}`,
			poolData?.token0Data.decimals as number,
		);
		const token1Amount = await getReceivedTokenAmount(
			withdrawFromPoolReceipt,
			smartAccount.address,
			poolData?.token1Data.address as `0x${string}`,
			poolData?.token1Data.decimals as number,
		);
		const assets = [
			{
				address: poolData?.token0Data.address as `0x${string}`,
				amount: token0Amount as string,
			},
			{
				address: poolData?.token1Data.address as `0x${string}`,
				amount: token1Amount as string,
			},
		];

		const soldAssets = await Promise.all(
			assets.map(async (asset) => {
				const soldAsset = await sellAsset({
					smartAccount: smartAccount,
					asset: asset,
				});
				return soldAsset;
			}),
		);
		return NextResponse.json({
			soldAssets: soldAssets,
		});
	}
};
