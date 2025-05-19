import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const extractedItems = pgTable("extracted_items", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  lineNumber: integer("line_number").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: text("unit_price"),
  total: text("total"),
});

export const matchedItems = pgTable("matched_items", {
  id: serial("id").primaryKey(),
  extractedItemId: integer("extracted_item_id").notNull(),
  productId: text("product_id").notNull(),
  productName: text("product_name").notNull(),
  confidence: integer("confidence").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  name: true,
  status: true,
});

export const insertExtractedItemSchema = createInsertSchema(extractedItems).pick({
  documentId: true,
  lineNumber: true,
  description: true, 
  quantity: true,
  unitPrice: true,
  total: true,
});

export const insertMatchedItemSchema = createInsertSchema(matchedItems).pick({
  extractedItemId: true,
  productId: true,
  productName: true,
  confidence: true,
  isVerified: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertExtractedItem = z.infer<typeof insertExtractedItemSchema>;
export type ExtractedItem = typeof extractedItems.$inferSelect;

export type InsertMatchedItem = z.infer<typeof insertMatchedItemSchema>;
export type MatchedItem = typeof matchedItems.$inferSelect;

// Types for the API responses and requests
export type ExtractedLineItem = {
  lineNumber: number;
  description: string;
  quantity: number;
  unitPrice?: string;
  total?: string;
};

export type ProductMatch = {
  productId: string;
  productName: string;
  confidence: number;
};

export type LineItemMatch = {
  lineNumber: number;
  description: string;
  quantity: number;
  matches: ProductMatch[];
};

export type DocumentExtractResponse = {
  lineItems: ExtractedLineItem[];
};

export type CatalogProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
};

export type FinalMatchedItem = {
  lineNumber: number;
  description: string;
  productId: string;
  productName: string;
  quantity: number;
};
