import { db } from "@/db";
import { tokensTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ethers } from "ethers";
import { getRawBalance } from "./erc20";

export const getToken = async (tokenId: number) => {
	const result = await db
		.select()
		.from(tokensTable)
		.where(eq(tokensTable.id, tokenId));
	return result[0];
};

export const getBalanceInUSD = async (tokenId: number, accountAddress: `0x${string}`) => {
    const token = await getToken(tokenId)
    const url = `https://api.coinbase.com/api/v3/brokerage/market/products/${token.product_id}`
    const response = await fetch(url);
    const data = await response.json();
    const price = data.price;
	const rawBalance = await getRawBalance(token.address as `0x${string}`, accountAddress)
	const readableBalance = ethers.utils.formatUnits(rawBalance, token.decimals)
	const balanceInUsd = Number(readableBalance) * Number.parseFloat(price);
	return balanceInUsd;
};

export const getTokenBySymbol = async (symbol: string) => {
	const result = await db
		.select()
		.from(tokensTable)
		.where(eq(tokensTable.symbol, symbol));
	return result[0];
};
