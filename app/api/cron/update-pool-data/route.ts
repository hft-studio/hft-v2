import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateAllPools } from "@/lib/pools";

const cronSecret = process.env.CRON_SECRET;
if (!cronSecret) {
	throw new Error("CRON_SECRET is not set");
}

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("authorization");
	if (authHeader !== `Bearer ${cronSecret}`) {
		console.log("Unauthorized");
		return new Response("Unauthorized", { status: 401 });
	}
	await updateAllPools();
	return NextResponse.json({ message: "Pools fetched successfully" });
}