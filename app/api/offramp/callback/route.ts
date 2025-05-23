import { NextResponse } from "next/server"
import { transfer } from "@/lib/erc20"
import { getServerSession } from "next-auth"
import { createRequest } from "@/lib/coinbase"
import { authOptions } from "@/lib/auth"
import { getAccount } from "@/lib/account"
import { getTokenBySymbol } from "@/lib/tokens"
import { ethers } from "ethers"
import { getBaseUrl } from "@/lib/utils";
import { cdpClient } from "@/lib/clients"


const baseUrl = getBaseUrl();

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            throw new Error("Unauthorized")
        }

        const { smartAccount } = await getAccount(session.user.id)
        if (!smartAccount) {
            throw new Error("Smart account not found")
        }


        const { url, jwt } = await createRequest({
            request_method: "GET",
            request_path: `/onramp/v1/sell/user/${session?.user?.id}/transactions`,
        })

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })

        const data = await response.json()
        const latestTransaction = data.transactions[0]
        if (!latestTransaction) {
            throw new Error("No recent transactions found")
        }

        const amount = latestTransaction.sell_amount.value
        
        const symbol = latestTransaction.asset.toLocaleLowerCase()
        if (symbol !== "usdc") {
            throw new Error("Invalid asset")
        }
        const usdc = await getTokenBySymbol('USDC')
        const formattedAmount = ethers.utils.parseUnits(amount, 6)
        const { success, txHash } = await transfer(usdc.address as `0x${string}`, latestTransaction.to_address, formattedAmount.toBigInt(), smartAccount )
        const successUrl = new URL("/explore", baseUrl)
        successUrl.searchParams.set("txHash", txHash || "")
        
        return NextResponse.redirect(successUrl)

    } catch (error) {
        console.error("Error processing offramp callback:", {
            error: error instanceof Error ? {
                message: error.message,
                name: error.name,
                stack: error.stack,
                // @ts-expect-error: Additional properties might exist
                code: error.code,
                // @ts-expect-error: Additional properties might exist
                statusCode: error.statusCode
            } : error
        });
        
        const errorUrl = new URL("/explore", baseUrl)
        errorUrl.searchParams.set("status", "error")
        errorUrl.searchParams.set("error", error instanceof Error ? 
            `${error.name}: ${error.message}` : 
            "Unknown error")
        
        return NextResponse.redirect(errorUrl)
    }
} 