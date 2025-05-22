import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";

export const wallets = pgTable("wallets", {
    id: serial("id").primaryKey(),
    owner_address: text("owner_address").notNull(),
    smart_account_address: text("smart_account_address").notNull(),
    user_id: text("user_id").notNull(),
});

export const networksTable = pgTable("networks", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    chain_id: integer("chain_id").notNull().unique(),
    swap_exchange_id: integer("swap_exchange_id").notNull().references(() => exchangesTable.id),
    usdc_token_id: integer("usdc_token_id").notNull().references(() => tokensTable.id)
});

export const exchangesTable = pgTable("exchanges", {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    type: text("type").notNull(),
    reward_token_id: integer("reward_token_id").notNull().references(() => tokensTable.id),
    swap_address: text("swap_router_address").notNull(),
});

export const poolsTable = pgTable("pools", {
    id: serial("id").primaryKey(),
    address: text("address").notNull(),
    symbol: text("symbol").notNull(),
    exchange_id: integer("exchange_id").notNull().references(() => exchangesTable.id),
    is_stable: boolean("is_stable").notNull(),
    token0: integer("token0").notNull().references(() => tokensTable.id),
    token1: integer("token1").notNull().references(() => tokensTable.id),
    network_id: integer("network_id").notNull().references(() => networksTable.id),
    gauge_address: text("gauge_address").notNull(),
    updated_at: timestamp("updated_at").notNull(),
    reserve0_usd: doublePrecision("reserve0_usd").notNull(),
    reserve1_usd: doublePrecision("reserve1_usd").notNull(),
    apr: doublePrecision("apr").notNull(),
    tvl: doublePrecision("tvl").notNull(),
    volume: doublePrecision("volume").notNull()
});

export const tokensTable = pgTable("tokens", {
    id: serial("id").primaryKey(),
    address: text("address").notNull(),
    symbol: text("symbol").notNull(),
    decimals: integer("decimals").notNull(),
    chain_id: integer("chain_id").notNull(),
    product_id: text("product_id").notNull(),
});

