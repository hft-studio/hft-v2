import { getAccount } from "@/lib/account";
import { Workflow } from "@/lib/workflow";
import {
	getUnstakedBalance,
	withdrawFromGauge,
	withdrawFromPool,
	sellAsset,
	getStakedBalance,
} from "./user-ops";
import { getReceivedTokenAmount } from "./utils";
import { getPoolData } from "@/lib/pools";

const workflow = new Workflow();

type WorkflowInput = {
	poolId: number;
	userId: string;
};

export const { POST } = workflow.createWorkflow((step) => {
	step
		.create(async (prevResult) => {
			const input = prevResult as unknown as WorkflowInput;
			const { smartAccount } = await getAccount(input.userId);
			if (!smartAccount) {
				throw new Error("Smart account not found");
			}
			const stakedBalance = await getStakedBalance(input.poolId, smartAccount);
			console.log("stakedBalance", stakedBalance);
			if (stakedBalance > BigInt(0)) {
				const withdrawFromGaugeReceipt = await withdrawFromGauge({
					poolId: input.poolId,
					smartAccount: smartAccount,
					amount: stakedBalance,
				});
			} else {
				console.log("No staked balance");
			}

			return {
				context: input,
			};
		})
		.create(
			async (input: {
				context: {
					poolId: number;
					userId: string;
				};
			}) => {
				const { smartAccount } = await getAccount(input.context.userId);
				const poolData = await getPoolData(input.context.poolId);
				if (!smartAccount) {
					throw new Error("Smart account not found");
				}
				const unstakedBalance = await getUnstakedBalance({
					poolId: input.context.poolId,
					smartAccount: smartAccount,
				});
				if (unstakedBalance > BigInt(0)) {
					const withdrawFromPoolReceipt = await withdrawFromPool({
						poolId: input.context.poolId,
						smartAccount: smartAccount,
						unstakedBalance: unstakedBalance,
					});
					const token0Amount = await getReceivedTokenAmount(
						withdrawFromPoolReceipt.receipt,
						smartAccount.address,
						poolData?.token0Data.address as `0x${string}`,
						poolData?.token0Data.decimals as number,
					);
					const token1Amount = await getReceivedTokenAmount(
						withdrawFromPoolReceipt.receipt,
						smartAccount.address,
						poolData?.token1Data.address as `0x${string}`,
						poolData?.token1Data.decimals as number,
					);
					const assets = [
						{
							address: poolData?.token0Data.address as `0x${string}`,
							amount: token0Amount,
						},
						{
							address: poolData?.token1Data.address as `0x${string}`,
							amount: token1Amount,
						},
					];
					return {
						context: input.context,
						assets: assets,
					};
				}

				console.log("No unstaked balance");
				return {
					context: input.context,
					assets: [],
				};
			},
		)
		.create(
			async (input: {
				context: {
					poolId: number;
					userId: string;
				};
				assets: {
					address: `0x${string}`;
					amount: string | null;
				}[];
			}) => {
				const { smartAccount } = await getAccount(input.context.userId);
				if (!smartAccount) {
					throw new Error("Smart account not found");
				}
				const parsedAssets = input.assets.map((asset) => {
					return {
						address: asset.address,
						amount: asset.amount as string,
					};
				});
				const soldAssets = await Promise.all(
					parsedAssets.map(async (asset) => {
						const soldAsset = await sellAsset({
							smartAccount: smartAccount,
							asset: asset,
						});
						return soldAsset;
					}),
				);
				return {
					context: input.context,
					soldAssets: soldAssets,
				};
			},
		);
});
