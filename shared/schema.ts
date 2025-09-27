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
  merchantName: text("merchant_name"), // e.g., "Starbucks", "Whole Foods Market"
  merchantLocation: text("merchant_location"), // e.g., "New York, NY", "Chicago, IL"
  merchantCategory: text("merchant_category"), // e.g., "Restaurant", "Grocery", "Gas Station"
  reference: text("reference"), // reference number or check number
  balanceAfter: decimal("balance_after", { precision: 12, scale: 2 }).notNull(),
  processedBy: varchar("processed_by"), // admin ID who processed
  status: text("status").default("completed"), // pending, completed, failed
  transactionDate: timestamp("transaction_date").defaultNow(),
  postedDate: timestamp("posted_date"), // actual posting date (can differ from transaction date)
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

// Credit card limit increase requests
export const creditLimitIncreaseRequests = pgTable("credit_limit_increase_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  currentLimit: integer("current_limit").notNull(),
  requestedLimit: integer("requested_limit").notNull(),
  annualIncome: varchar("annual_income").notNull(),
  employmentStatus: varchar("employment_status").notNull(),
  reason: text("reason"),
  status: varchar("status").notNull().default("pending"), // pending, approved, denied
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCreditLimitIncreaseRequestSchema = createInsertSchema(creditLimitIncreaseRequests).omit({
  id: true,
  createdAt: true,
});
export type InsertCreditLimitIncreaseRequest = z.infer<typeof insertCreditLimitIncreaseRequestSchema>;
export type SelectCreditLimitIncreaseRequest = typeof creditLimitIncreaseRequests.$inferSelect;

// Debit card limit increase requests  
export const debitLimitIncreaseRequests = pgTable("debit_limit_increase_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  currentATMLimit: integer("current_atm_limit").notNull(),
  requestedATMLimit: integer("requested_atm_limit").notNull(),
  currentPurchaseLimit: integer("current_purchase_limit").notNull(),
  requestedPurchaseLimit: integer("requested_purchase_limit").notNull(),
  reason: text("reason"),
  status: varchar("status").notNull().default("pending"), // pending, approved, denied
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDebitLimitIncreaseRequestSchema = createInsertSchema(debitLimitIncreaseRequests).omit({
  id: true,
  createdAt: true,
});
export type InsertDebitLimitIncreaseRequest = z.infer<typeof insertDebitLimitIncreaseRequestSchema>;
export type SelectDebitLimitIncreaseRequest = typeof debitLimitIncreaseRequests.$inferSelect;

// Pending external transfers table
export const pendingExternalTransfers = pgTable("pending_external_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fromAccountId: varchar("from_account_id").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientAccountNumber: text("recipient_account_number").notNull(),
  recipientRoutingNumber: text("recipient_routing_number").notNull(),
  recipientBankName: text("recipient_bank_name").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  transferType: text("transfer_type").notNull(), // ACH, Wire, etc.
  purpose: text("purpose"), // reason for transfer
  status: text("status").default("pending"), // pending, approved, disapproved
  processedBy: varchar("processed_by"), // admin ID who processed
  processedAt: timestamp("processed_at"),
  rejectionReason: text("rejection_reason"), // if disapproved
  submittedAt: timestamp("submitted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPendingExternalTransferSchema = createInsertSchema(pendingExternalTransfers).omit({
  id: true,
  createdAt: true,
  submittedAt: true,
  processedAt: true,
});

export type PendingExternalTransfer = typeof pendingExternalTransfers.$inferSelect;
export type InsertPendingExternalTransfer = z.infer<typeof insertPendingExternalTransferSchema>;

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
  processedExternalTransfers: many(pendingExternalTransfers),
}));

export const pendingExternalTransfersRelations = relations(pendingExternalTransfers, ({ one }) => ({
  user: one(users, {
    fields: [pendingExternalTransfers.userId],
    references: [users.id],
  }),
  fromAccount: one(bankAccounts, {
    fields: [pendingExternalTransfers.fromAccountId],
    references: [bankAccounts.id],
  }),
  processedByAdmin: one(adminUsers, {
    fields: [pendingExternalTransfers.processedBy],
    references: [adminUsers.id],
  }),
}));
