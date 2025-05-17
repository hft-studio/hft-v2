import { pgTable, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  key: varchar("key", { length: 255 }).primaryKey(),
  hash: varchar("hash", { length: 66 }).notNull(),
  lpTokenAmount: text("lp_token_amount"),
  lpTokenAddress: varchar("lp_token_address", { length: 42 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});