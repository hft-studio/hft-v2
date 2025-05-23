"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAccount } from "@/lib/account";
import { getBaseUrl } from "@/lib/utils";
const WORKFLOW_API_KEY = process.env.WORKFLOW_API_KEY;
if (!WORKFLOW_API_KEY) {
	throw new Error("WORKFLOW_API_KEY is not set");
}
const baseUrl = getBaseUrl();

export async function createPosition(poolId: number, usdcAmount: number) {
	const session = await getServerSession(authOptions);
	if (session?.user?.id === undefined) {
		throw new Error("Unauthorized");
	}

	const { smartAccount } = await getAccount(session.user.id);
	if (!smartAccount) {
		throw new Error("Smart account not found");
	}
	const result = await fetch(`${baseUrl}/api/workflows/create-position`, {
		method: 'POST',
		body: JSON.stringify({ poolId, usdcAmount, userId: session.user.id, smartAccountAddress: smartAccount.address}),
		headers: { "Content-Type": "application/json", "x-access-token": WORKFLOW_API_KEY as string },
	});
	console.log(result);
	return {
		success: true
	};
}
