import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve(async (context) => {

    const { poolId, amount, userId } = await context.requestPayload as { poolId: number, amount: number, userId: string };
	await context.run("initial-step", () => {
		console.log(poolId, amount, userId);
		console.log("initial step ran");
	});

	await context.run("second-step", () => {
		console.log("second step ran");
	});
});
