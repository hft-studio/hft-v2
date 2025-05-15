import { exchangesTable, networksTable, poolsTable, tokensTable, wallets } from "./schema";
import { db } from "./index";

async function main() {

    const tokensResult = await db.insert(tokensTable).values([
        {
            address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            symbol: 'USDC',
            chain_id: 8453,
            decimals: 6
        },
        {
            address: '0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf',
            symbol: 'cbBTC',
            chain_id: 8453,
            decimals: 8
        }
    ]).returning({ id: tokensTable.id });

    const [usdcId, cbBtcId] = tokensResult.map(token => token.id);

    const exchangeResult = await db.insert(exchangesTable).values([
        {
            name: 'aerodrome',
            swap_address: "0xcf77a3ba9a5ca399b7c97c74d54e5b1beb874e43",
            type: "veamm"
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
            volume: 0,
            updated_at: new Date()
        }
    ]);

    const walletsResult = await db.insert(wallets).values([
        {
            owner_address: "0xf498fc1C0a4bE34EC07a9fCe563D87e0dB434a3E",
            smart_account_address: "0x7fe9A7DE2466475C3389f2cCBd056D822594DE5D",
            user_id: "c064667a-bb9f-4e10-afd6-0c2efd1fbfe2",
        }
    ]);
}

main().catch(console.error);