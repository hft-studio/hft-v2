import { CdpClient } from "@coinbase/cdp-sdk";
import { createBundlerClient } from "viem/account-abstraction";
import { base } from "viem/chains";
import { http } from "viem";
import Redis from 'ioredis';
import { ethers } from "ethers";
import { createPublicClient } from "viem";

export const publicClient = createPublicClient({
	chain: base,
	transport: http(process.env.PAYMASTER_URL),
});

if (!process.env.ALCHEMY_BASE_RPC_URL) {
    throw new Error("ALCHEMY_BASE_RPC_URL is not set");
}

export const alchemyProvider = new ethers.providers.JsonRpcProvider({
    url: process.env.ALCHEMY_BASE_RPC_URL,
    skipFetchSetup: true,
});

if (!process.env.KV_URL) {
    throw new Error('REDIS_URL is not defined');
}

export const redis = new Redis(process.env.KV_URL, {
    maxRetriesPerRequest: 5,
    retryStrategy: (times: number) => {
        if (times > 3) {
            return null;
        }
        return Math.min(times * 100, 3000);
    },
});


export const bundlerClient = createBundlerClient({
    chain: base,
    transport: http(process.env.PAYMASTER_URL),
});

if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET || !process.env.CDP_WALLET_SECRET) {
    throw new Error("CDP_API_KEY_ID, CDP_API_KEY_SECRET, and CDP_WALLET_SECRET must be set");
}

const apiKeyId = process.env.CDP_API_KEY_ID;
const apiKeySecret = process.env.CDP_API_KEY_SECRET;
const walletSecret = process.env.CDP_WALLET_SECRET;

export const cdpClient = new CdpClient({
    apiKeyId,
    apiKeySecret,
    walletSecret,
});