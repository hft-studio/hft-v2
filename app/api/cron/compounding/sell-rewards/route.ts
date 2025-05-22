import type { NextRequest } from "next/server";

const cronSecret = process.env.CRON_SECRET;
if (!cronSecret) {
	throw new Error("CRON_SECRET is not set");
}

export const GET = async (request: NextRequest) => {
	const authHeader = request.headers.get("authorization");
	console.log("authHeader", authHeader);
	if (authHeader !== `Bearer ${cronSecret}`) {
		console.log("Unauthorized");
		return new Response("Unauthorized", { status: 401 });
	}

	return new Response("OK", { status: 200 });
};