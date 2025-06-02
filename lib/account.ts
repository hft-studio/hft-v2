import { wallets } from '../db/schema';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { CdpClient, EvmSmartAccount } from '@coinbase/cdp-sdk';
import { bundlerClient } from './clients';
import { TransactionReceipt } from 'viem';

// Initialize the CDP client with explicit options
const cdpClient = new CdpClient({
    apiKeyId: process.env.CDP_API_KEY_ID,
    apiKeySecret: process.env.CDP_API_KEY_SECRET,
    walletSecret: process.env.CDP_WALLET_SECRET
});

export async function getAccount(userId: string) {
    try {
        if (!userId) {
            return {
                owner: null,
                smartAccount: null
            }
        }
        const accountData = await
            db.select().from(wallets)
                .where(
                    eq(wallets.user_id, userId))
                .limit(1);
        let ownerAddress: `0x${string}`
        let smartAccountAddress: `0x${string}`
        if (accountData.length === 0) {
            const newAccount = await createSmartAccount(userId);
            ownerAddress = newAccount.ownerAddress
            smartAccountAddress = newAccount.smartAccountAddress
        } else {
            ownerAddress = accountData[0].owner_address as `0x${string}`
            smartAccountAddress = accountData[0].smart_account_address as `0x${string}`
        }
        const owner = await cdpClient.evm.getAccount({
            address: ownerAddress,
        })
        const smartAccount = await cdpClient.evm.getSmartAccount({
            address: smartAccountAddress,
            owner
        })
        return {
            owner,
            smartAccount
        };
    } catch (error) {
        console.error("Error getting account:", error);
        throw error;
    }
}

export async function createSmartAccount(userId: string) {
    try {
        const owner = await cdpClient.evm.createAccount();
        const smartAccount = await cdpClient.evm.createSmartAccount({
            owner,
        })
        const account = {
            user_id: userId,
            owner_address: owner.address,
            smart_account_address: smartAccount.address,
        }
        await db.insert(wallets).values({
            user_id: account.user_id,
            owner_address: account.owner_address,
            smart_account_address: account.smart_account_address,
        });
        return {
            userId: userId,
            ownerAddress: owner.address,
            smartAccountAddress: smartAccount.address,
        };
    } catch (error) {
        console.error("Error creating smart account:", error);
        throw error;
    }
}

export const executeTransactionWithRetries = async (
    smartAccount: EvmSmartAccount,
    calls: {
        to: `0x${string}`;
        value: bigint;
        data: `0x${string}`;
    }[],
    retries: number = 5,
    baseDelayMs: number = 1000
): Promise<TransactionReceipt> => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    let lastReceipt: TransactionReceipt | null = null;

    for (let i = 0; i < retries; i++) {
        try {
            const userOp = await cdpClient.evm.sendUserOperation({
                smartAccount: smartAccount,
                network: 'base',
                calls: calls,
                paymasterUrl: process.env.PAYMASTER_URL,
            });
            const userOpReceipt = await bundlerClient.waitForUserOperationReceipt({
                hash: userOp.userOpHash,
            });
            lastReceipt = userOpReceipt.receipt;
            if (userOpReceipt.success) {
                return userOpReceipt.receipt;
            }
        } catch (error) {
            if (i < retries - 1) {
                const delayMs = baseDelayMs * Math.pow(2, i);
                await delay(delayMs);
                continue;
            }
        }
    }

    if (lastReceipt) {
        return lastReceipt;
    }
    throw new Error('All retries failed and no receipt was obtained');
};