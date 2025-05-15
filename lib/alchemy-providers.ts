import { providers } from "ethers";

export const alchemyProvider = new providers.JsonRpcProvider(process.env.ALCHEMY_BASE_RPC_URL);