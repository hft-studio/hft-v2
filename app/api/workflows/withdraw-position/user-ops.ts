import type { EvmSmartAccount } from "@coinbase/cdp-sdk";
import { getPoolData } from "@/lib/pools";
import { cdpClient, bundlerClient, publicClient } from "@/lib/clients";
import { readContract } from "viem/actions";
import { encodeFunctionData, erc20Abi } from "viem";
import { executeTransactionWithRetries } from "@/lib/account";

export const withdrawFromPool = async ({
    poolId,
    smartAccount,
    unstakedBalance
}: {
    poolId: number,
    smartAccount: EvmSmartAccount,
    unstakedBalance: bigint
}) => {
    const poolData = await getPoolData(poolId);
    if (!poolData) {
        throw new Error(`Pool not found: ${poolId}`);
    }
    const approveCalls = [{
        to: poolData.address as `0x${string}`,
        data: encodeFunctionData({
            abi: [{
                constant: false,
                inputs: [
                    { name: "spender", type: "address" },
                    { name: "amount", type: "uint256" }
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function"
            }],
            functionName: "approve",
            args: [poolData.swapExchangeData?.swap_address as `0x${string}`, unstakedBalance]
        }),
        value: BigInt(0)
    }]

    const removeLiquidityCalls = [{
        to: poolData.swapExchangeData?.swap_address as `0x${string}`,
        data: encodeFunctionData({
            abi: [{
                inputs: [
                    { name: "tokenA", type: "address" },
                    { name: "tokenB", type: "address" },
                    { name: "stable", type: "bool" },
                    { name: "liquidity", type: "uint256" },
                    { name: "amountAMin", type: "uint256" },
                    { name: "amountBMin", type: "uint256" },
                    { name: "to", type: "address" },
                    { name: "deadline", type: "uint256" }
                ],
                name: "removeLiquidity",
                outputs: [
                    { name: "amountA", type: "uint256" },
                    { name: "amountB", type: "uint256" }
                ],
                stateMutability: "nonpayable",
                type: "function"
            }],
            functionName: "removeLiquidity",
            args: [
                poolData.token0Data.address as `0x${string}`,
                poolData.token1Data.address as `0x${string}`,
                poolData.is_stable,
                unstakedBalance,
                BigInt(0),
                BigInt(0),
                smartAccount.address,
                BigInt(Math.floor(Date.now() / 1000) + 3600)
            ]
        }),
        value: BigInt(0)
    }]

    const withdrawFromPoolReceipt = await executeTransactionWithRetries(smartAccount, [...approveCalls, ...removeLiquidityCalls]);

    return withdrawFromPoolReceipt;
}

export const getUnstakedBalance = async ({
    poolId,
    smartAccount
}: {
    poolId: number,
    smartAccount: EvmSmartAccount
}) => {
    const poolData = await getPoolData(poolId);
    if (!poolData) {
        throw new Error(`Pool not found: ${poolId}`);
    }
    const unstakedBalance = await readContract(
        publicClient,
        {
            address: poolData.address as `0x${string}`,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [smartAccount.address]
        }
    ) as bigint;
    return unstakedBalance;
}

export const withdrawFromGauge = async ({
    poolId,
    smartAccount,
    amount
}: {
    poolId: number,
    smartAccount: EvmSmartAccount,
    amount: bigint
}) => {
    const poolData = await getPoolData(poolId);
    if (!poolData) {
        throw new Error(`Pool not found: ${poolId}`);
    }
    const gaugeAddress = poolData.gauge_address;
    const calls = [{
        to: gaugeAddress as `0x${string}`,
        data: encodeFunctionData({
            abi: [
                {
                    inputs: [{ name: "amount", type: "uint256" }],
                    name: "withdraw",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function"
                }],
            functionName: "withdraw",
            args: [amount]
        }),
        value: BigInt(0)
    }]
    const withdrawFromGaugeReceipt = await executeTransactionWithRetries(smartAccount, calls);
    return withdrawFromGaugeReceipt;
}

export const getStakedBalance = async (poolId: number, smartAccount: EvmSmartAccount) => {
    const poolData = await getPoolData(poolId);
    const gaugeAddress = poolData?.gauge_address;
    const stakedBalance = await readContract(
        publicClient,
        {
            address: gaugeAddress as `0x${string}`,
            abi: [{
                inputs: [{ name: "account", type: "address" }],
                name: "balanceOf",
                outputs: [{ name: "", type: "uint256" }],
                stateMutability: "view",
                type: "function"
            }],
            functionName: "balanceOf",
            args: [smartAccount.address]
        }
    ) as bigint;

    return stakedBalance;
}

