"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Client } from "@upstash/workflow";

if (process.env.QSTASH_TOKEN === undefined) {
	throw new Error("QSTASH_TOKEN is not set");
}

export async function createPosition(poolId: number, amount: number) {
	const session = await getServerSession(authOptions);
    console.log("Creating position", session);
	if (session?.user?.id === undefined) {
		throw new Error("Unauthorized");
	}

	

	const client = new Client({ token: process.env.QSTASH_TOKEN });

	const { workflowRunId } = await client.trigger({
		url: `${process.env.UPSTASH_WORKFLOW_URL}/api/workflows/create-position`,
		body: JSON.stringify({ poolId, amount, userId: session.user.id }), // optional body
		headers: { "Content-Type": "application/json" }, // optional headers
		retries: 3, // optional retries in the initial request
	});
	console.log(workflowRunId);
	return {
		workflowRunId,
	};
}
