"use server";

import { getBaseUrl } from "@/lib/utils";
const WORKFLOW_API_KEY = process.env.WORKFLOW_API_KEY;
if (!WORKFLOW_API_KEY) {
	throw new Error("WORKFLOW_API_KEY is not set");
}
const baseUrl = getBaseUrl();

export async function createPosition(poolId: number, usdcAmount: number) {
	return {
		success: false
	};
	// const { smartAccount } = await getAccount(user.id);
	// if (!smartAccount) {
	// 	throw new Error("Smart account not found");
	// }
	// const result = await fetch(`${baseUrl}/api/workflows/create-position`, {
	// 	method: 'POST',
	// 	body: JSON.stringify({ poolId, usdcAmount, userId: user.id, smartAccountAddress: smartAccount.address}),
	// 	headers: { "Content-Type": "application/json", "x-access-token": WORKFLOW_API_KEY as string },
	// });
	// console.log(result);
	// return {
	// 	success: true
	// };
}
