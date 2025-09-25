import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

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

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").default("admin"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin balance table
export const adminBalance = pgTable("admin_balance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminId: varchar("admin_id").notNull().unique(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("500000000.00"), // $500 million
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bank accounts table  
export const bankAccounts = pgTable("bank_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  accountNumber: text("account_number").notNull().unique(),
  routingNumber: text("routing_number").notNull(),
  accountType: text("account_type").notNull(), // checking, savings, etc
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0.00"),
  status: text("status").default("active"), // active, suspended, closed
  openDate: timestamp("open_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").notNull(),
  type: text("type").notNull(), // credit, debit
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  description: text("description").notNull(),
  reference: text("reference"), // reference number or check number
  balanceAfter: decimal("balance_after", { precision: 12, scale: 2 }).notNull(),
  processedBy: varchar("processed_by"), // admin ID who processed
  status: text("status").default("completed"), // pending, completed, failed
  transactionDate: timestamp("transaction_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer profiles table (extended user info)
export const customerProfiles = pgTable("customer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  ssn: text("ssn"), // encrypted in real app
  dateOfBirth: timestamp("date_of_birth"),
  phoneNumber: text("phone_number"),
  address: jsonb("address"), // street, city, state, zip
  employmentInfo: jsonb("employment_info"), // employer, income, etc
  kycStatus: text("kyc_status").default("pending"), // pending, approved, rejected
  accountOpenDate: timestamp("account_open_date").defaultNow(),
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

// New insert schemas for banking tables
export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerProfileSchema = createInsertSchema(customerProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertAdminBalanceSchema = createInsertSchema(adminBalance).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

// New types for banking tables
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type AdminBalance = typeof adminBalance.$inferSelect;
export type InsertAdminBalance = z.infer<typeof insertAdminBalanceSchema>;

export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type CustomerProfile = typeof customerProfiles.$inferSelect;
export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  bankAccounts: many(bankAccounts),
  customerProfile: one(customerProfiles, {
    fields: [users.id],
    references: [customerProfiles.userId],
  }),
}));

export const bankAccountsRelations = relations(bankAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [bankAccounts.userId],
    references: [users.id],
  }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(bankAccounts, {
    fields: [transactions.accountId],
    references: [bankAccounts.id],
  }),
  processedByAdmin: one(adminUsers, {
    fields: [transactions.processedBy],
    references: [adminUsers.id],
  }),
}));

export const customerProfilesRelations = relations(customerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [customerProfiles.userId],
    references: [users.id],
  }),
}));

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  processedTransactions: many(transactions),
}));
