import { createRequest } from "@/lib/coinbase"
import { getServerSession } from "next-auth"    
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { url, jwt } = await createRequest({
        request_method: "GET",
        request_path: `/onramp/v1/sell/user/${session?.user?.id}/transactions`,
    })

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
    })

    const data = await response.json()
    return NextResponse.json(data)
}