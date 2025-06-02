import { stackServerApp } from "@/lib/stack/stack.server";
import { StackServerApp } from "@stackframe/stack";
import { NextRequest, NextResponse } from "next/server";

const betaCode = process.env.BETA_CODE;

export async function GET(request: NextRequest) {
	const code = request.nextUrl.searchParams.get('code');
	if (code !== betaCode) {
		return NextResponse.json({ message: "Invalid code" }, { status: 401 });
	}
	const user = await stackServerApp.getUser({ or: "redirect" });
	await user?.grantPermission('beta');
	return NextResponse.json({ message: "Permission granted" });
}