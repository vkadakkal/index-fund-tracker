import { pgTable, text, serial, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Fund metadata
export const funds = pgTable("funds", {
  id: serial("id").primaryKey(),
  ticker: text("ticker").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'ETF' or 'Mutual Fund'
  category: text("category").notNull(), // 'S&P 500', 'Total Market', etc.
  expenseRatio: real("expense_ratio").notNull(),
  provider: text("provider").notNull(),
  minInvestment: text("min_investment"),
});

export const insertFundSchema = createInsertSchema(funds).omit({ id: true });
export type InsertFund = z.infer<typeof insertFundSchema>;
export type Fund = typeof funds.$inferSelect;
