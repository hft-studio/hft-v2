"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const appId = process.env.NEXT_PUBLIC_COINBASE_APP_ID as string;
const redirectUrl = process.env.NEXT_PUBLIC_APP_URL as string;

if (!appId) {
    throw new Error("NEXT_PUBLIC_COINBASE_APP_ID is not set");
}

if (!redirectUrl) {
    throw new Error("NEXT_PUBLIC_APP_URL is not set");
}

const assets = ["USDC"];
const assetsString = JSON.stringify(assets);

interface UseWithdrawalProps {
    address: string;
    partnerUserId: string;
}

export function useWithdrawal({ address, partnerUserId }: UseWithdrawalProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleWithdrawal = useCallback(() => {
        const callbackUrl = `${redirectUrl}/api/offramp/callback`;
        const url = `https://pay.coinbase.com/v3/sell/input?appId=${appId}&partnerUserId=${partnerUserId}&addresses={"${address}":["base"]}&assets=${assetsString}&redirectUrl=${encodeURIComponent(callbackUrl)}`;
        window.open(url, '_blank');
    }, [address, partnerUserId]);

    useEffect(() => {
        const status = searchParams.get("status");
        const txHash = searchParams.get("txHash");

        if (status === "withdrawal_success" && txHash) {
            setTimeout(() => {
                toast("Withdrawal Successful", {
                    description: "View transaction on Basescan",
                    action: {
                        label: "View",
                        onClick: () => window.open(`https://basescan.org/tx/${txHash}`, '_blank'),
                    },
                    onDismiss: () => {
                        router.replace("/explore");
                    },
                    onAutoClose: () => {
                        router.replace("/explore");
                    },
                });
            }, 0);
        }
    }, [searchParams, router]);

    return { handleWithdrawal };
}