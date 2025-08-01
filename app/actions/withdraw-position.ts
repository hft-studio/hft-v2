"use server";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export async function withdrawPosition(poolId: number) {
	return {
		success: false
	};
	// const result = await fetch(`${baseUrl}/api/workflows/withdraw-position`, {
	// 	method: 'POST',
	// 	body: JSON.stringify({ poolId, userId: user.id}),
	// 	headers: { "Content-Type": "application/json" },
	// });
	// return {
	// 	success: true
	// };
}