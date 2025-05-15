import { NextResponse } from "next/server"
import { updateAllPools } from "@/lib/pools";

export async function GET() {
    await updateAllPools()
    return NextResponse.json({ message: 'Pools fetched successfully' })
}