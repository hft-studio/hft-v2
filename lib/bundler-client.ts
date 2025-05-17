import { createBundlerClient } from "viem/account-abstraction";
import { base } from "viem/chains";
import { http } from "viem";

export const bundlerClient = createBundlerClient({
    chain: base,
    transport: http(process.env.PAYMASTER_URL),
});