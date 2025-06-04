import { getAccount } from "@/lib/account";
import { balanceAssets, depositInPool, depositInGauge } from "./user-ops";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { sellAsset } from "@/lib/swap";
import { getRawBalance } from "@/lib/erc20";
import {
	withdrawFromPool,
} from "../withdraw-position/user-ops";
import { withdrawFromGauge } from "../withdraw-position/user-ops";
import { getPoolData } from "@/lib/pools";
import { getUnstakedBalance } from "../withdraw-position/utils";
import { getStakedBalance } from "../withdraw-position/utils";
const API_KEY = process.env.WORKFLOW_API_KEY;
if (!API_KEY) {
	throw new Error("WORKFLOW_API_KEY is not defined");
}

type CreatePositionInput = {
	poolId: number;
	usdcAmount: number;
	smartAccountAddress: string;
	userId: string;
};

export async function POST(request: NextRequest) {
	const accessToken = request.headers.get("x-access-token");
	if (accessToken !== API_KEY) {
		return NextResponse.json(
			{ error: "Invalid access token" },
			{ status: 401 },
		);
	}
	const input: CreatePositionInput = await request.json();

	const { smartAccount } = await getAccount(input.userId);

	if (!smartAccount) {
		return NextResponse.json(
			{ error: "Smart account not found" },
			{ status: 400 },
		);
	}
	let step = 0;
	try {
		const assets = await balanceAssets({
			poolId: input.poolId,
			usdcAmount: input.usdcAmount.toString(),
			smartAccount: smartAccount,
		});
		const depositInPoolReceipt = await depositInPool({
			poolId: input.poolId,
			assets: assets,
			smartAccount: smartAccount,
		});
		const gaugeDepositReceipt = await depositInGauge({
			poolId: input.poolId,
			smartAccount: smartAccount,
		});
		return NextResponse.json({
			successful: true,
			gaugeDepositTxHash: gaugeDepositReceipt.transactionHash,
		});
	} catch (error) {
		const stakedBalance = await getStakedBalance(input.poolId, smartAccount);
		if (stakedBalance > BigInt(0)) {
			const withdrawFromGaugeReceipt = await withdrawFromGauge({
				poolId: input.poolId,
				smartAccount: smartAccount,
				amount: stakedBalance,
			});
		}
		const unstakedBalance = await getUnstakedBalance({
			poolId: input.poolId,
			smartAccount: smartAccount,
		});
		if (unstakedBalance > BigInt(0)) {
			const withdrawFromPoolReceipt = await withdrawFromPool({
				poolId: input.poolId,
				smartAccount: smartAccount,
				unstakedBalance: unstakedBalance,
			});
		}
		const poolData = await getPoolData(input.poolId);
		const [token0Amount, token1Amount] = await Promise.all([
			getRawBalance(
				poolData?.token0Data.address as `0x${string}`,
				smartAccount.address,
			),
			getRawBalance(
				poolData?.token1Data.address as `0x${string}`,
				smartAccount.address,
			),
		]);
		const assets = [
			{
				address: poolData?.token0Data.address as `0x${string}`,
				amount: token0Amount.toString(),
			},
			{
				address: poolData?.token1Data.address as `0x${string}`,
				amount: token1Amount.toString(),
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
		return NextResponse.json(
			{
				error: (error as Error).message || "Failed to create position",
				step: 0,
			},
			{ status: 500 },
		);
	}
}
