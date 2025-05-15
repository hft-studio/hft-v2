import { db } from "@/db"
import { poolsTable } from "@/db/schema"

export async function getPools() {
    const pools = await db.select().from(poolsTable)
    return pools
}