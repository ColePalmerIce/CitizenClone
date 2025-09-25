import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  users,
  searchQueries,
  creditCardApplications,
  accountApplications,
  contactInquiries,
  adminUsers,
  bankAccounts,
  transactions,
  customerProfiles,
  type User,
  type InsertUser,
  type SearchQuery,
  type InsertSearchQuery,
  type CreditCardApplication,
  type InsertCreditCardApplication,
  type AccountApplication,
  type InsertAccountApplication,
  type ContactInquiry,
  type InsertContactInquiry,
  type AdminUser,
  type InsertAdminUser,
  type BankAccount,
  type InsertBankAccount,
  type Transaction,
  type InsertTransaction,
  type CustomerProfile,
  type InsertCustomerProfile,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import type { IStorage } from "./storage";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export class PostgreSQLStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Search queries
  async saveSearchQuery(query: InsertSearchQuery): Promise<SearchQuery> {
    const result = await db.insert(searchQueries).values(query).returning();
    return result[0];
  }

  async getRecentSearchQueries(limit = 10): Promise<SearchQuery[]> {
    return await db.select().from(searchQueries).orderBy(desc(searchQueries.timestamp)).limit(limit);
  }

  // Credit card applications
  async saveCreditCardApplication(application: InsertCreditCardApplication): Promise<CreditCardApplication> {
    const result = await db.insert(creditCardApplications).values(application).returning();
    return result[0];
  }

  async getCreditCardApplication(id: string): Promise<CreditCardApplication | undefined> {
    const result = await db.select().from(creditCardApplications).where(eq(creditCardApplications.id, id)).limit(1);
    return result[0];
  }

  async getCreditCardApplicationsByEmail(email: string): Promise<CreditCardApplication[]> {
    return await db.select().from(creditCardApplications).where(eq(creditCardApplications.applicantEmail, email));
  }

  // Account applications
  async saveAccountApplication(application: InsertAccountApplication): Promise<AccountApplication> {
    const result = await db.insert(accountApplications).values(application).returning();
    return result[0];
  }

  async getAccountApplication(id: string): Promise<AccountApplication | undefined> {
    const result = await db.select().from(accountApplications).where(eq(accountApplications.id, id)).limit(1);
    return result[0];
  }

  async getAccountApplicationsByEmail(email: string): Promise<AccountApplication[]> {
    return await db.select().from(accountApplications).where(eq(accountApplications.applicantEmail, email));
  }

  // Contact inquiries
  async saveContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const result = await db.insert(contactInquiries).values(inquiry).returning();
    return result[0];
  }

  async getContactInquiries(status?: string): Promise<ContactInquiry[]> {
    if (status) {
      return await db.select().from(contactInquiries).where(eq(contactInquiries.status, status));
    }
    return await db.select().from(contactInquiries);
  }

  async updateContactInquiryStatus(id: string, status: string): Promise<ContactInquiry | undefined> {
    const result = await db.update(contactInquiries)
      .set({ status })
      .where(eq(contactInquiries.id, id))
      .returning();
    return result[0];
  }

  // Admin users
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    return result[0];
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const result = await db.insert(adminUsers).values(admin).returning();
    return result[0];
  }

  async updateAdminLastLogin(id: string): Promise<AdminUser | undefined> {
    const result = await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return result[0];
  }

  // Bank accounts
  async createBankAccount(account: InsertBankAccount): Promise<BankAccount> {
    const result = await db.insert(bankAccounts).values(account).returning();
    return result[0];
  }

  async getBankAccount(id: string): Promise<BankAccount | undefined> {
    const result = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id)).limit(1);
    return result[0];
  }

  async getBankAccountByNumber(accountNumber: string): Promise<BankAccount | undefined> {
    const result = await db.select().from(bankAccounts).where(eq(bankAccounts.accountNumber, accountNumber)).limit(1);
    return result[0];
  }

  async getBankAccountsByUserId(userId: string): Promise<BankAccount[]> {
    return await db.select().from(bankAccounts).where(eq(bankAccounts.userId, userId));
  }

  async getAllBankAccounts(): Promise<BankAccount[]> {
    return await db.select().from(bankAccounts).orderBy(desc(bankAccounts.createdAt));
  }

  async updateBankAccountBalance(id: string, newBalance: string): Promise<BankAccount | undefined> {
    const result = await db.update(bankAccounts)
      .set({ balance: newBalance })
      .where(eq(bankAccounts.id, id))
      .returning();
    return result[0];
  }

  async updateBankAccountStatus(id: string, status: string): Promise<BankAccount | undefined> {
    const result = await db.update(bankAccounts)
      .set({ status })
      .where(eq(bankAccounts.id, id))
      .returning();
    return result[0];
  }

  async deleteBankAccount(id: string): Promise<boolean> {
    const result = await db.delete(bankAccounts).where(eq(bankAccounts.id, id)).returning();
    return result.length > 0;
  }

  // Transactions
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return result[0];
  }

  async getTransactionsByAccountId(accountId: string, limit = 50): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.accountId, accountId))
      .orderBy(desc(transactions.transactionDate))
      .limit(limit);
  }

  async getAllTransactions(limit = 100): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .orderBy(desc(transactions.transactionDate))
      .limit(limit);
  }

  // Customer profiles
  async createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile> {
    const result = await db.insert(customerProfiles).values(profile).returning();
    return result[0];
  }

  async getCustomerProfile(userId: string): Promise<CustomerProfile | undefined> {
    const result = await db.select().from(customerProfiles).where(eq(customerProfiles.userId, userId)).limit(1);
    return result[0];
  }

  async updateCustomerProfile(userId: string, updates: Partial<InsertCustomerProfile>): Promise<CustomerProfile | undefined> {
    const result = await db.update(customerProfiles)
      .set(updates)
      .where(eq(customerProfiles.userId, userId))
      .returning();
    return result[0];
  }

  // Admin dashboard utilities
  async getTotalCustomers(): Promise<number> {
    const result = await db.select().from(users);
    return result.length;
  }

  async getTotalAccountBalance(): Promise<string> {
    const result = await db.select().from(bankAccounts);
    const total = result.reduce((sum, account) => {
      return sum + parseFloat(account.balance || '0');
    }, 0);
    return total.toFixed(2);
  }

  async getRecentTransactions(limit = 10): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .orderBy(desc(transactions.transactionDate))
      .limit(limit);
  }
}

export const storage = new PostgreSQLStorage();