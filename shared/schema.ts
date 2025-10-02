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
  status: text("status").default("active"), // active, blocked, suspended
  statusReason: text("status_reason"), // reason for blocking/suspension
  statusUpdatedBy: varchar("status_updated_by"), // admin ID who changed status
  statusUpdatedAt: timestamp("status_updated_at"),
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
  // User credentials
  username: text("username").notNull(),
  password: text("password").notNull(), // Will be hashed
  email: text("email").notNull(),
  
  // Personal information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  ssn: text("ssn"), // encrypted
  dateOfBirth: text("date_of_birth"),
  phoneNumber: text("phone_number"),
  
  // Address
  street: text("street"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  
  // Employment
  employer: text("employer"),
  jobTitle: text("job_title"),
  annualIncome: text("annual_income"),
  employmentType: text("employment_type"),
  
  // Account details
  accountType: text("account_type").notNull(), // checking, savings, loan
  initialDeposit: decimal("initial_deposit", { precision: 12, scale: 2 }).default("0.00"),
  
  // Generated account info (filled when approved)
  accountNumber: text("account_number"), 
  routingNumber: text("routing_number"),
  
  // Application status
  status: text("status").default("pending"), // pending, approved, rejected
  adminNotes: text("admin_notes"), // Admin can add notes
  approvedBy: varchar("approved_by"), // Admin ID who approved
  approvedAt: timestamp("approved_at"),
  
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
  accountNumber: true,
  routingNumber: true,
  approvedBy: true,
  approvedAt: true,
});

// Account opening form schema with validation
export const accountOpeningSchema = z.object({
  // User credentials
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  email: z.string().email("Invalid email address"),
  
  // Personal information
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, "SSN must be in format XXX-XX-XXXX"),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 120;
  }, "Must be 18 years or older"),
  phoneNumber: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, "Phone must be in format (XXX) XXX-XXXX"),
  
  // Address
  street: z.string().min(5, "Street address is required").max(100),
  city: z.string().min(2, "City is required").max(50),
  state: z.string().length(2, "State must be 2 characters"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
  
  // Employment
  employer: z.string().min(2, "Employer is required").max(100),
  jobTitle: z.string().min(2, "Job title is required").max(100),
  annualIncome: z.string().refine((val) => {
    const income = parseInt(val);
    return income >= 0 && income <= 10000000;
  }, "Invalid annual income"),
  employmentType: z.enum(['full_time', 'part_time', 'contractor', 'self_employed', 'retired', 'student']),
  
  // Account details
  accountType: z.enum(['checking', 'savings', 'loan']),
  initialDeposit: z.string().refine((val) => parseFloat(val) >= 0, "Invalid initial deposit"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type AccountOpeningData = z.infer<typeof accountOpeningSchema>;

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

// Enhanced customer creation schema with simplified validation
export const enhancedCustomerCreationSchema = z.object({
  // Basic user info
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  password: z.string().min(8, "Password must be at least 8 characters"),
  
  // Personal details - flexible formats for better UX
  ssn: z.string().refine((val) => {
    const digits = val.replace(/\D/g, '');
    return digits.length === 9;
  }, "SSN must be 9 digits"),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 120;
  }, "Must be 18 years or older"),
  phoneNumber: z.string().refine((val) => {
    const digits = val.replace(/\D/g, '');
    return digits.length === 10;
  }, "Phone number must be 10 digits"),
  
  // Address - OPTIONAL for simplified customer creation
  street: z.string().min(5).max(100).optional(),
  city: z.string().min(2).max(50).optional(),
  state: z.string().length(2).optional(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/).optional(),
  
  // Employment - OPTIONAL for simplified customer creation
  employer: z.string().min(2).max(100).optional(),
  jobTitle: z.string().min(2).max(100).optional(),
  annualIncome: z.string().refine((val) => {
    if (!val) return true; // Allow empty
    const income = parseInt(val);
    return income >= 0 && income <= 10000000;
  }).optional(),
  employmentType: z.enum(['full_time', 'part_time', 'contractor', 'self_employed', 'retired', 'student']).optional(),
  
  // Account creation options
  accountCreationDate: z.string().optional(), // Optional: Admin can backdate account creation
  createAllAccounts: z.boolean().default(true),
  createCards: z.boolean().default(true),
  initialCheckingBalance: z.string().refine((val) => parseFloat(val) >= 0, "Invalid balance"),
  initialSavingsBalance: z.string().refine((val) => parseFloat(val) >= 0, "Invalid balance"),
  initialBusinessBalance: z.string().refine((val) => parseFloat(val) >= 0, "Invalid balance"),
});

export type EnhancedCustomerCreationData = z.infer<typeof enhancedCustomerCreationSchema>;

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
  recipientPhoneNumber: text("recipient_phone_number"),
  recipientAddress: jsonb("recipient_address"), // {street, city, state, zip}
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

// Domestic wire transfers table
export const domesticWireTransfers = pgTable("domestic_wire_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fromAccountId: varchar("from_account_id").notNull(),
  
  // Recipient bank details
  recipientBankName: text("recipient_bank_name").notNull(),
  recipientBankAddress: text("recipient_bank_address").notNull(),
  recipientRoutingNumber: text("recipient_routing_number").notNull(),
  recipientAccountNumber: text("recipient_account_number").notNull(),
  
  // Beneficiary details
  beneficiaryName: text("beneficiary_name").notNull(),
  beneficiaryAddress: text("beneficiary_address").notNull(),
  beneficiaryAccountType: text("beneficiary_account_type").notNull(), // checking, savings
  
  // Transfer details
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  purpose: text("purpose").notNull(),
  reference: text("reference"), // optional reference number
  
  // Processing details
  status: text("status").default("pending"), // pending, processing, completed, failed
  processedBy: varchar("processed_by"), // admin ID who processed
  processedAt: timestamp("processed_at"),
  
  // Wire details
  federalReference: text("federal_reference"), // Federal reference number for tracking
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// International wire transfers table  
export const internationalWireTransfers = pgTable("international_wire_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  fromAccountId: varchar("from_account_id").notNull(),
  
  // Correspondent bank details (intermediary bank)
  correspondentBankName: text("correspondent_bank_name"),
  correspondentBankSwift: text("correspondent_bank_swift"),
  correspondentBankAddress: text("correspondent_bank_address"),
  
  // Recipient bank details
  recipientBankName: text("recipient_bank_name").notNull(),
  recipientBankSwift: text("recipient_bank_swift").notNull(),
  recipientBankAddress: text("recipient_bank_address").notNull(),
  recipientIBAN: text("recipient_iban"), // International Bank Account Number
  recipientAccountNumber: text("recipient_account_number").notNull(),
  
  // Beneficiary details
  beneficiaryName: text("beneficiary_name").notNull(),
  beneficiaryAddress: text("beneficiary_address").notNull(),
  beneficiaryCountry: text("beneficiary_country").notNull(),
  beneficiaryPhoneNumber: text("beneficiary_phone_number"),
  
  // Transfer details
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD").notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 4 }),
  purpose: text("purpose").notNull(),
  reference: text("reference"), // optional reference number
  
  // Fees
  senderFee: decimal("sender_fee", { precision: 8, scale: 2 }).default("0.00"),
  intermediaryFee: decimal("intermediary_fee", { precision: 8, scale: 2 }).default("0.00"),
  recipientFee: decimal("recipient_fee", { precision: 8, scale: 2 }).default("0.00"),
  
  // Processing details
  status: text("status").default("pending"), // pending, processing, completed, failed
  processedBy: varchar("processed_by"), // admin ID who processed
  processedAt: timestamp("processed_at"),
  
  // Wire details
  swiftReference: text("swift_reference"), // SWIFT message reference
  estimatedCompletionDate: timestamp("estimated_completion_date"),
  actualCompletionDate: timestamp("actual_completion_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for wire transfers
export const insertDomesticWireTransferSchema = createInsertSchema(domesticWireTransfers).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  processedBy: true,
  federalReference: true,
  actualCompletionDate: true,
});

export const insertInternationalWireTransferSchema = createInsertSchema(internationalWireTransfers).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  processedBy: true,
  swiftReference: true,
  actualCompletionDate: true,
});

// Types for wire transfers
export type DomesticWireTransfer = typeof domesticWireTransfers.$inferSelect;
export type InsertDomesticWireTransfer = z.infer<typeof insertDomesticWireTransferSchema>;

export type InternationalWireTransfer = typeof internationalWireTransfers.$inferSelect;
export type InsertInternationalWireTransfer = z.infer<typeof insertInternationalWireTransferSchema>;

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

// Access codes table for 2FA authentication
export const accessCodes = pgTable("access_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  userId: varchar("user_id"), // user ID this code is for (null means any user can use it)
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  usedBy: varchar("used_by"), // user ID who used the code
  usedAt: timestamp("used_at"),
  generatedBy: varchar("generated_by").notNull(), // admin ID who generated
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAccessCodeSchema = createInsertSchema(accessCodes).omit({
  id: true,
  createdAt: true,
  usedAt: true,
});

export type AccessCode = typeof accessCodes.$inferSelect;
export type InsertAccessCode = z.infer<typeof insertAccessCodeSchema>;

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

// Wire transfer relations
export const domesticWireTransfersRelations = relations(domesticWireTransfers, ({ one }) => ({
  user: one(users, {
    fields: [domesticWireTransfers.userId],
    references: [users.id],
  }),
  fromAccount: one(bankAccounts, {
    fields: [domesticWireTransfers.fromAccountId],
    references: [bankAccounts.id],
  }),
  processedByAdmin: one(adminUsers, {
    fields: [domesticWireTransfers.processedBy],
    references: [adminUsers.id],
  }),
}));

export const internationalWireTransfersRelations = relations(internationalWireTransfers, ({ one }) => ({
  user: one(users, {
    fields: [internationalWireTransfers.userId],
    references: [users.id],
  }),
  fromAccount: one(bankAccounts, {
    fields: [internationalWireTransfers.fromAccountId],
    references: [bankAccounts.id],
  }),
  processedByAdmin: one(adminUsers, {
    fields: [internationalWireTransfers.processedBy],
    references: [adminUsers.id],
  }),
}));
