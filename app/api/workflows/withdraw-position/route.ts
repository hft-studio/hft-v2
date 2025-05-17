import { getAccount } from "@/lib/account";
import { Workflow } from "@/lib/workflow";
import {
	getUnstakedBalance,
	withdrawFromGauge,
	withdrawFromPool,
	sellAsset,
	getStakedBalance,
} from "./user-ops";

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
            console.log('stakedBalance', stakedBalance);
			if (stakedBalance > BigInt(0)) {
				const withdrawFromGaugeReceipt = await withdrawFromGauge({
					poolId: input.poolId,
					smartAccount: smartAccount,
					amount: stakedBalance,
				});
                
			}else{
                console.log('No staked balance');
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
					const assets = [
						{
							address: withdrawFromPoolReceipt.logs[4].address,
							amount: withdrawFromPoolReceipt.logs[4].data,
						},
						{
							address: withdrawFromPoolReceipt.logs[5].address,
							amount: withdrawFromPoolReceipt.logs[5].data,
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
					amount: `0x${string}`;
				}[];
			}) => {
				const { smartAccount } = await getAccount(input.context.userId);
				if (!smartAccount) {
					throw new Error("Smart account not found");
				}
				const soldAssets = await Promise.all(
					input.assets.map(async (asset) => {
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
