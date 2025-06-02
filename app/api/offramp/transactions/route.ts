import { createRequest } from "@/lib/coinbase"
import { NextResponse } from "next/server"
import { stackServerApp } from "@/lib/stack/stack.server";

export async function GET() {
    const user = await stackServerApp.getUser({ or: "redirect" });
    const { url, jwt } = await createRequest({
        request_method: "GET",
        request_path: `/onramp/v1/sell/user/${user?.id}/transactions`,
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