import { createRequest } from "@/lib/coinbase"
import { NextResponse } from "next/server"

export async function GET() {
    // const { url, jwt } = await createRequest({
    //     request_method: "GET",
    //     request_path: "/onramp/v1/buy/transactions",
    // })

    // const response = await fetch(url, {
    //     headers: {
    //         Authorization: `Bearer ${jwt}`,
    //     },
    //     cache: "no-store",
    // })

    // const data = await response.json()
    // return NextResponse.json(
    //     data.transactions.filter((transaction: { user_id: string, partner_user_ref: string }) =>
    //     transaction.partner_user_ref === user?.id),
    //     {
    //         status: 200,
    //     }
    // )
}