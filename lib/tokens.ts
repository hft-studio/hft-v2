import { db } from "@/db";
import { tokensTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getToken = async (tokenId: number) => {
	const result = await db
		.select()
		.from(tokensTable)
		.where(eq(tokensTable.id, tokenId));
	return result[0];
};