"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

export async function withdrawPosition(poolId: number) {
	const session = await getServerSession(authOptions);
	if (session?.user?.id === undefined) {
		throw new Error("Unauthorized");
	}
	const result = await fetch(`${baseUrl}/api/workflows/withdraw-position`, {
		method: 'POST',
		body: JSON.stringify({ poolId, userId: session.user.id}),
		headers: { "Content-Type": "application/json" },
	});
	return {
		success: true
	};
}