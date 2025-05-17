"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccount } from "@/lib/account";

export async function createPosition(poolId: number, usdcAmount: number) {
	const session = await getServerSession(authOptions);
	if (session?.user?.id === undefined) {
		throw new Error("Unauthorized");
	}

	const { smartAccount } = await getAccount(session.user.id);
	if (!smartAccount) {
		throw new Error("Smart account not found");
	}
	const result = await fetch(`http://localhost:3000/api/workflows/create-position`, {
		method: 'POST',
		body: JSON.stringify({ poolId, usdcAmount, userId: session.user.id, smartAccountAddress: smartAccount.address}),
		headers: { "Content-Type": "application/json" },
	});
	console.log(result);
	return {
		success: true
	};
}
