import { ethers } from "ethers";

if (!process.env.ALCHEMY_BASE_RPC_URL) {
    throw new Error("ALCHEMY_BASE_RPC_URL is not set");
}


export const alchemyProvider = new ethers.providers.JsonRpcProvider({
    url: process.env.ALCHEMY_BASE_RPC_URL,
    skipFetchSetup: true,
});