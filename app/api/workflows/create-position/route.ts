import { getAccount } from "@/lib/account";
import { Workflow } from "@/lib/workflow";
import { balanceAssets, depositInPool, depositInGauge } from "./user-ops";
import { ethers } from "ethers";

// Define our workflow input type
type WorkflowInput = {
	poolId: number;
	usdcAmount: number;
	smartAccountAddress: string;
	userId: string;
};

const workflow = new Workflow();

export const { POST } = workflow.createWorkflow((step) => {
	step
		.create(async (prevResult) => {
			const input = prevResult as unknown as WorkflowInput;

			const rawUsdcAmount = ethers.utils
				.parseUnits(input.usdcAmount.toString(), 6)
				.toBigInt();
			const { smartAccount } = await getAccount(input.userId);
			console.log("smartAccount", smartAccount?.address);
			if (!smartAccount) {
				throw new Error("Smart account not found");
			}

			const assets = await balanceAssets({
				poolId: input.poolId,
				usdcAmount: rawUsdcAmount,
				smartAccount: smartAccount,
			});

			return {
				assets: assets.map((asset) => ({
					tokenId: asset.tokenId ?? 0,
					amount: asset.amount.toString(),
				})),
				context: input,
			};
		})
		.create(async (input) => {
			console.log(input.assets);
			const rawAssets = input.assets.map((asset) => ({
				tokenId: asset.tokenId,
				amount: BigInt(asset.amount === "0x" ? "0" : asset.amount),
			}));

			const { smartAccount } = await getAccount(input.context.userId);
			if (!smartAccount) {
				throw new Error("Smart account not found");
			}

			const lpTokenResult = await depositInPool({
				poolId: input.context.poolId,
				assets: rawAssets,
				smartAccount: smartAccount,
			});

			return {
				context: input.context,
				lpTokenAmount: lpTokenResult.amount.toString(),
				lpTokenAddress: lpTokenResult.lpTokenAddress,
			};
		})
		.create(
			async (prevResult: {
				context: WorkflowInput;
				lpTokenAmount: string;
				lpTokenAddress: string | undefined;
			}) => {
				const lpTokenAmount = prevResult.lpTokenAmount as string;
				const lpTokenAddress = prevResult.lpTokenAddress || "";
				const { smartAccount } = await getAccount(prevResult.context.userId);
				if (!smartAccount) {
					throw new Error("Smart account not found");
				}
				const gaugeDepositReceipt = await depositInGauge({
					poolId: prevResult.context.poolId,
					lpTokenAmount: BigInt(lpTokenAmount),
					lpTokenAddress: lpTokenAddress,
					smartAccount: smartAccount,
				});

				return {
					context: prevResult.context,
					successful: true,
				};
			},
		)
		.finally((result) => {
			console.log("Position creation workflow completed with result:", result);
		});
});