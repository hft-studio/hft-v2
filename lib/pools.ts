import { exchangesTable, poolsTable } from "@/db/schema";
import type { PoolDetails } from "@/types/pools";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { tokensTable, networksTable } from "../db/schema";
import { alias } from "drizzle-orm/pg-core";

export const sugarUrl = 'http://209.38.61.132/api/pools'

export const updateAllPools = async () => {
    const pools = await db.select().from(poolsTable)
    const promises = pools.map(async (pool) => {
        const response = await fetch(`${sugarUrl}/${pool.address}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch pool details: ${response.statusText}`);
        }

        const poolDetails = await response.json() as PoolDetails;

        await db.update(poolsTable).set({
            apr: poolDetails.apr,
            tvl: poolDetails.tvl,
            volume: poolDetails.volume,
        }).where(eq(poolsTable.address, pool.address))
    })
    await Promise.all(promises)
}

export async function getPoolData(poolId: number) {
    const token0Table = alias(tokensTable, 'token0');
    const token1Table = alias(tokensTable, 'token1');
    const swapExchangeTable = alias(exchangesTable, 'swap_exchange');
    const usdcTokenTable = alias(tokensTable, 'usdc_token');

    const result = await db
        .select({
            pool: {
                id: poolsTable.id,
                address: poolsTable.address,
                symbol: poolsTable.symbol,
                exchange_id: poolsTable.exchange_id,
                is_stable: poolsTable.is_stable,
                token0: poolsTable.token0,
                token1: poolsTable.token1,
                network_id: poolsTable.network_id,
                gauge_address: poolsTable.gauge_address,
            },
            token0: {
                id: token0Table.id,
                address: token0Table.address,
                symbol: token0Table.symbol,
                chain_id: token0Table.chain_id,
                decimals: token0Table.decimals,
            },
            token1: {
                id: token1Table.id,
                address: token1Table.address,
                symbol: token1Table.symbol,
                chain_id: token1Table.chain_id,
                decimals: token1Table.decimals,
            },
            network: {
                id: networksTable.id,
                name: networksTable.name,
                chain_id: networksTable.chain_id,
                swap_exchange_id: networksTable.swap_exchange_id,
            },
            exchange: {
                id: exchangesTable.id,
                name: exchangesTable.name,
            },
            swapExchange: {
                id: swapExchangeTable.id,
                name: swapExchangeTable.name,
                type: swapExchangeTable.type,
                swap_address: swapExchangeTable.swap_address,
            },
            usdcToken: {
                id: usdcTokenTable.id,
                address: usdcTokenTable.address,
                symbol: usdcTokenTable.symbol,
                chain_id: usdcTokenTable.chain_id,
                decimals: usdcTokenTable.decimals,
            }
        })
        .from(poolsTable)
        .leftJoin(token0Table, eq(token0Table.id, poolsTable.token0))
        .leftJoin(token1Table, eq(token1Table.id, poolsTable.token1))
        .leftJoin(networksTable, eq(networksTable.id, poolsTable.network_id))
        .leftJoin(exchangesTable, eq(exchangesTable.id, poolsTable.exchange_id))
        .leftJoin(swapExchangeTable, eq(swapExchangeTable.id, networksTable.swap_exchange_id))
        .leftJoin(usdcTokenTable, eq(usdcTokenTable.id, networksTable.usdc_token_id))
        .where(eq(poolsTable.id, poolId))
        .limit(1);

    if (!result.length) {
        return undefined;
    }

    const row = result[0];

    return {
        ...row.pool,
        token0Data: {
            ...row.token0,
            network_id: row.pool.network_id
        },
        token1Data: {
            ...row.token1,
            network_id: row.pool.network_id
        },
        networkData: row.network,
        exchangeData: row.exchange,
        swapExchangeData: row.swapExchange,
        usdcTokenData: row.usdcToken,
    };
}

export type PoolData = Awaited<ReturnType<typeof getPoolData>>;