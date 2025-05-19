import { createPublicClient } from "viem";
import { http } from "viem";
import { base } from "viem/chains";

export const publicClient = createPublicClient({
	chain: base,
	transport: http(process.env.PAYMASTER_URL),
});
