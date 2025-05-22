import { useEffect  , useState } from "react";
import type { CBPayInstanceType } from "@coinbase/cbpay-js";
import { initOnRamp } from "@coinbase/cbpay-js";

const appId = process.env.NEXT_PUBLIC_COINBASE_APP_ID as string;

if (!appId) {
    throw new Error("NEXT_PUBLIC_COINBASE_APP_ID is not set");
}

interface UseCoinbaseOnRampProps {
    address: string;
}

export function useCoinbaseOnRamp({ address }: UseCoinbaseOnRampProps) {
    const [onrampInstance, setOnrampInstance] = useState<CBPayInstanceType | null>(null);

    useEffect(() => {
        let instance: CBPayInstanceType | null = null;

        initOnRamp(
            {
                appId,
                widgetParameters: {
                    addresses: { [address]: ["base"] },
                    assets: ["USDC"],
                },
                experienceLoggedIn: "popup",
                experienceLoggedOut: "popup",
                closeOnExit: true,
                closeOnSuccess: true,
            },
            (_, newInstance) => {
                instance = newInstance;
                setOnrampInstance(newInstance);
            }
        );

        return () => {
            instance?.destroy();
        };
    }, [address]);

    const openDeposit = () => {
        onrampInstance?.open();
    };

    return { openDeposit, isReady: !!onrampInstance };
}