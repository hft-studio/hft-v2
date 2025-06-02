"use server";
import { getBaseUrl } from "@/lib/utils";
import { stackServerApp } from "@/lib/stack/stack.server";

const baseUrl = getBaseUrl();

export async function withdrawPosition(poolId: number) {
	const user = await stackServerApp.getUser({ or: "redirect" });
	const result = await fetch(`${baseUrl}/api/workflows/withdraw-position`, {
		method: 'POST',
		body: JSON.stringify({ poolId, userId: user.id}),
		headers: { "Content-Type": "application/json" },
	});
	return {
		success: true
	};
}