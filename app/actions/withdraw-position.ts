"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";import { getAccount } from "@/lib/account";

export async function withdrawPosition(poolId: number) {
	const session = await getServerSession(authOptions);
	if (session?.user?.id === undefined) {
		throw new Error("Unauthorized");
	}
	const result = await fetch('http://localhost:3000/api/workflows/withdraw-position', {
		method: 'POST',
		body: JSON.stringify({ poolId, userId: session.user.id}),
		headers: { "Content-Type": "application/json" },
	});
	console.log(result);
	return {
		success: true
	};
}