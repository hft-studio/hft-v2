import { exchangesTable, networksTable, poolsTable, tokensTable, wallets } from "./schema";
import { db } from "./index";

async function main() {
    await db.delete(poolsTable);
    await db.delete(networksTable);
    await db.delete(exchangesTable);
    await db.delete(tokensTable);

    const tokensResult = await db.insert(tokensTable).values([
        {
            address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            symbol: 'USDC',
            chain_id: 8453,
            decimals: 6,
            product_id: 'USDC-USD'
        },
        {
            address: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
            symbol: 'cbBTC',
            chain_id: 8453,
            decimals: 8,
            product_id: 'BTC-USD'
        },
        {
            address: '0x940181a94a35a4569e4529a3cdfb74e38fd98631',
            symbol: 'AERO',
            chain_id: 8453,
            decimals: 18,
            product_id: 'AERO-USD'
        },
        {
            address: '0x4200000000000000000000000000000000000006',
            symbol: 'WETH',
            chain_id: 8453,
            decimals: 18,
            product_id: 'ETH-USD'
        }
    ]).returning({ id: tokensTable.id });

    const [usdcId, cbBtcId, aerodromeId, wethId] = tokensResult.map(token => token.id);

    const exchangeResult = await db.insert(exchangesTable).values([
        {
            name: 'aerodrome',
            swap_address: "0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43",
            type: "veamm",
            reward_token_id: aerodromeId
        }
    ]).returning({ id: exchangesTable.id });

    const exchangeId = exchangeResult[0].id;


    const networkResult = await db.insert(networksTable).values([
        {
            name: 'base',
            chain_id: 8453,
            swap_exchange_id: exchangeId,
            usdc_token_id: usdcId
        }
    ]).returning({ id: networksTable.id });

    const networkId = networkResult[0].id;

    const poolsResult = await db.insert(poolsTable).values([
        {
            address: '0x9c38b55f9A9Aba91BbCEDEb12bf4428f47A6a0B8',
            symbol: 'USD-BTC',
            is_stable: false,
            exchange_id: exchangeId,
            token0: usdcId,
            token1: cbBtcId,
            network_id: networkId,
            gauge_address: "0xEDC76895e053A9bbAC456B5a9c5B49144eee0080",
            apr: 0,
            tvl: 0,
            reserve0_usd: 0,
            reserve1_usd: 0,
            volume: 0,
            updated_at: new Date()
        },
        {
            address: '0x519BBD1Dd8C6A94C46080E24f316c14Ee758C025',
            symbol: 'vAMM-WETH/USDC',
            is_stable: false,
            exchange_id: exchangeId,
            token0: usdcId,
            token1: wethId,
            network_id: networkId,
            gauge_address: "0x519BBD1Dd8C6A94C46080E24f316c14Ee758C025",
            apr: 0,
            tvl: 0,
            reserve0_usd: 0,
            reserve1_usd: 0,
            volume: 0,
            updated_at: new Date()
        },
        {
            address: '0x6cDcb1C4A4D1C3C6d054b27AC5B77e89eAFb971d',
            symbol: 'vAMM-USDC/AERO',
            is_stable: false,
            exchange_id: exchangeId,
            token0: usdcId,
            token1: aerodromeId,
            network_id: networkId,
            gauge_address: "0x4F09bAb2f0E15e2A078A227FE1537665F55b8360",
            apr: 0,
            tvl: 0,
            reserve0_usd: 0,
            reserve1_usd: 0,
            volume: 0,
            updated_at: new Date()
        }
    ]);
}

main().catch(console.error);