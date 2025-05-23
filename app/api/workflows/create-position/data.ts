import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTransaction(key: string) {
	const result = await db
		.select({
			hash: transactions.hash,
			lpTokenAmount: transactions.lpTokenAmount,
			lpTokenAddress: transactions.lpTokenAddress,
		})
		.from(transactions)
		.where(eq(transactions.key, key))
		.limit(1);
	return result[0] || null;
}

export async function storeTransaction(
	key: string,
	data: {
		hash: string;
		lpTokenAmount: string;
		lpTokenAddress: string;
		metadata: Record<string, unknown>;
	},
) {
	await db
		.insert(transactions)
		.values({
			key,
			hash: data.hash,
			lpTokenAmount: data.lpTokenAmount?.toString(),
			lpTokenAddress: data.lpTokenAddress,
			metadata: data.metadata,
		})
		.onConflictDoUpdate({
			target: transactions.key,
			set: {
				hash: data.hash,
				lpTokenAmount: data.lpTokenAmount?.toString(),
				lpTokenAddress: data.lpTokenAddress,
				metadata: data.metadata,
				updatedAt: new Date(),
			},
		});
}

export async function checkTxConfirmed(txHash: string) {
	const result = await db
		.select()
		.from(transactions)
		.where(eq(transactions.hash, txHash));
	return result.length > 0;
}
