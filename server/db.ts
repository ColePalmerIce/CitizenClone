import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  users,
  searchQueries,
  creditCardApplications,
  accountApplications,
  contactInquiries,
  adminUsers,
  adminBalance,
  bankAccounts,
  transactions,
  customerProfiles,
  creditLimitIncreaseRequests,
  debitLimitIncreaseRequests,
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
  type AdminBalance,
  type InsertAdminBalance,
  type BankAccount,
  type InsertBankAccount,
  type Transaction,
  type InsertTransaction,
  type CustomerProfile,
  type InsertCustomerProfile,
  type InsertCreditLimitIncreaseRequest,
  type SelectCreditLimitIncreaseRequest,
  type InsertDebitLimitIncreaseRequest,
  type SelectDebitLimitIncreaseRequest,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import type { IStorage } from "./storage";
import { generateComprehensiveTransactionHistory } from "./transaction-seeds";

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

  async updateUserPassword(userId: string, hashedPassword: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .returning();
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

  // Admin balance
  async getAdminBalance(adminId: string): Promise<AdminBalance | undefined> {
    const result = await db.select().from(adminBalance).where(eq(adminBalance.adminId, adminId)).limit(1);
    return result[0];
  }

  async createAdminBalance(balance: InsertAdminBalance): Promise<AdminBalance> {
    const result = await db.insert(adminBalance).values(balance).returning();
    return result[0];
  }

  async updateAdminBalance(adminId: string, newBalance: string): Promise<AdminBalance | undefined> {
    const result = await db.update(adminBalance)
      .set({ balance: newBalance, lastUpdated: new Date() })
      .where(eq(adminBalance.adminId, adminId))
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

  async getAllBankAccounts(): Promise<any[]> {
    // Join bank accounts with user information to get complete customer details
    const result = await db.select({
      // Bank account fields
      id: bankAccounts.id,
      userId: bankAccounts.userId,
      accountNumber: bankAccounts.accountNumber,
      routingNumber: bankAccounts.routingNumber,
      accountType: bankAccounts.accountType,
      balance: bankAccounts.balance,
      status: bankAccounts.status,
      createdAt: bankAccounts.createdAt,
      // User fields
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      username: users.username
    })
    .from(bankAccounts)
    .innerJoin(users, eq(bankAccounts.userId, users.id))
    .orderBy(desc(bankAccounts.createdAt));
    
    return result;
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

  async seedAccountWithProfessionalTransactions(accountId: string): Promise<Transaction[]> {
    const professionalTransactions = generateComprehensiveTransactionHistory();
    const seededTransactions: Transaction[] = [];
    
    // Get current account to calculate running balance
    const account = await this.getBankAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    
    let runningBalance = parseFloat(account.balance || '50000') || 50000; // Starting balance
    
    // Process transactions in chronological order (oldest first)
    const sortedTransactions = professionalTransactions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    for (const profTransaction of sortedTransactions) {
      const amount = parseFloat(profTransaction.amount);
      
      // Calculate new balance
      if (profTransaction.type === 'credit') {
        runningBalance += amount;
      } else {
        runningBalance -= amount;
      }
      
      // Create transaction with professional data
      const transaction = await this.createTransaction({
        accountId,
        type: profTransaction.type,
        amount: profTransaction.amount,
        description: profTransaction.description,
        merchantName: profTransaction.merchantName,
        merchantLocation: profTransaction.merchantLocation, 
        merchantCategory: profTransaction.merchantCategory,
        reference: profTransaction.reference,
        balanceAfter: runningBalance.toFixed(2),
        transactionDate: new Date(profTransaction.date),
        postedDate: new Date(profTransaction.postedDate),
        status: "completed"
      });
      
      seededTransactions.push(transaction);
    }
    
    // Update final account balance
    await this.updateBankAccountBalance(accountId, runningBalance.toFixed(2));
    
    return seededTransactions;
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

  // Credit limit increase requests
  async createCreditLimitIncreaseRequest(request: InsertCreditLimitIncreaseRequest): Promise<SelectCreditLimitIncreaseRequest> {
    const result = await db.insert(creditLimitIncreaseRequests).values(request).returning();
    return result[0];
  }

  async getCreditLimitIncreaseRequestsByUserId(userId: string): Promise<SelectCreditLimitIncreaseRequest[]> {
    return await db.select().from(creditLimitIncreaseRequests)
      .where(eq(creditLimitIncreaseRequests.userId, userId))
      .orderBy(desc(creditLimitIncreaseRequests.createdAt));
  }

  async updateCreditLimitIncreaseRequestStatus(id: string, status: string): Promise<SelectCreditLimitIncreaseRequest | undefined> {
    const result = await db.update(creditLimitIncreaseRequests)
      .set({ status })
      .where(eq(creditLimitIncreaseRequests.id, id))
      .returning();
    return result[0];
  }

  // Debit limit increase requests
  async createDebitLimitIncreaseRequest(request: InsertDebitLimitIncreaseRequest): Promise<SelectDebitLimitIncreaseRequest> {
    const result = await db.insert(debitLimitIncreaseRequests).values(request).returning();
    return result[0];
  }

  async getDebitLimitIncreaseRequestsByUserId(userId: string): Promise<SelectDebitLimitIncreaseRequest[]> {
    return await db.select().from(debitLimitIncreaseRequests)
      .where(eq(debitLimitIncreaseRequests.userId, userId))
      .orderBy(desc(debitLimitIncreaseRequests.createdAt));
  }

  async updateDebitLimitIncreaseRequestStatus(id: string, status: string): Promise<SelectDebitLimitIncreaseRequest | undefined> {
    const result = await db.update(debitLimitIncreaseRequests)
      .set({ status })
      .where(eq(debitLimitIncreaseRequests.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new PostgreSQLStorage();