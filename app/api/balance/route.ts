import { getUsdcAvailable } from "@/app/(dashboard)/explore/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const usdcAvailable = await getUsdcAvailable(request.nextUrl.searchParams.get("address") as `0x${string}`);
    return NextResponse.json({ usdcAvailable });
}   