import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchQueries = pgTable("search_queries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  results: jsonb("results"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const creditCardApplications = pgTable("credit_card_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantEmail: text("applicant_email").notNull(),
  preferences: jsonb("preferences").notNull(),
  recommendedCard: text("recommended_card").notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accountApplications = pgTable("account_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicantEmail: text("applicant_email").notNull(),
  accountType: text("account_type").notNull(),
  personalInfo: jsonb("personal_info"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSearchQuerySchema = createInsertSchema(searchQueries).omit({
  id: true,
  timestamp: true,
});

export const insertCreditCardApplicationSchema = createInsertSchema(creditCardApplications).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertAccountApplicationSchema = createInsertSchema(accountApplications).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type SearchQuery = typeof searchQueries.$inferSelect;
export type InsertSearchQuery = z.infer<typeof insertSearchQuerySchema>;

export type CreditCardApplication = typeof creditCardApplications.$inferSelect;
export type InsertCreditCardApplication = z.infer<typeof insertCreditCardApplicationSchema>;

export type AccountApplication = typeof accountApplications.$inferSelect;
export type InsertAccountApplication = z.infer<typeof insertAccountApplicationSchema>;

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
