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
  pendingExternalTransfers,
  domesticWireTransfers,
  internationalWireTransfers,
  accessCodes,
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
  type PendingExternalTransfer,
  type InsertPendingExternalTransfer,
  type DomesticWireTransfer,
  type InsertDomesticWireTransfer,
  type InternationalWireTransfer,
  type InsertInternationalWireTransfer,
  type AccessCode,
  type InsertAccessCode,
} from "@shared/schema";
import { eq, desc, and, gt, lt, sql } from "drizzle-orm";
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
    // Case-insensitive username search - get all users and filter manually for case-insensitivity
    const allUsers = await db.select().from(users);
    return allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    // Case-insensitive email search - get all users and filter manually for case-insensitivity
    const allUsers = await db.select().from(users);
    return allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
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

  async updateUserStatus(userId: string, status: string, reason?: string, updatedBy?: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ 
        status, 
        statusReason: reason || null, 
        statusUpdatedBy: updatedBy || null, 
        statusUpdatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async updateUserCreatedAt(userId: string, createdAt: Date): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ createdAt })
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
    return await db.select().from(accountApplications).where(eq(accountApplications.email, email));
  }

  async getAllAccountApplications(): Promise<AccountApplication[]> {
    return await db.select().from(accountApplications).orderBy(desc(accountApplications.createdAt));
  }

  async updateAccountApplicationStatus(id: string, status: string, adminId?: string, notes?: string): Promise<AccountApplication | undefined> {
    const updateData: any = { status };
    if (adminId) updateData.approvedBy = adminId;
    if (notes) updateData.adminNotes = notes;
    if (status === 'approved') updateData.approvedAt = new Date();
    
    const result = await db.update(accountApplications)
      .set(updateData)
      .where(eq(accountApplications.id, id))
      .returning();
    return result[0];
  }

  async updateAccountApplicationNumbers(id: string, accountNumber: string, routingNumber: string): Promise<AccountApplication | undefined> {
    const result = await db.update(accountApplications)
      .set({ accountNumber, routingNumber })
      .where(eq(accountApplications.id, id))
      .returning();
    return result[0];
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
    // Case-insensitive email search - get all admins and filter manually for case-insensitivity
    const allAdmins = await db.select().from(adminUsers);
    return allAdmins.find(a => a.email.toLowerCase() === email.toLowerCase());
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
    // Join bank accounts with user information to get complete customer details including user status
    const result = await db.select({
      // Bank account fields
      id: bankAccounts.id,
      userId: bankAccounts.userId,
      accountNumber: bankAccounts.accountNumber,
      routingNumber: bankAccounts.routingNumber,
      accountType: bankAccounts.accountType,
      balance: bankAccounts.balance,
      bankAccountStatus: bankAccounts.status,
      createdAt: bankAccounts.createdAt,
      // User fields including status for admin block/unblock controls
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      username: users.username,
      status: users.status,
      statusReason: users.statusReason,
      statusUpdatedBy: users.statusUpdatedBy,
      statusUpdatedAt: users.statusUpdatedAt
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

  async seedAccountWithProfessionalTransactions(accountId: string, accountType?: 'checking' | 'savings' | 'business'): Promise<Transaction[]> {
    // Get current account and its current balance
    const account = await this.getBankAccount(accountId);
    if (!account) {
      throw new Error("Account not found");
    }
    
    // Use account type from parameter or from account record
    const type = accountType || account.accountType as 'checking' | 'savings' | 'business' || 'checking';
    const professionalTransactions = generateComprehensiveTransactionHistory(type);
    const seededTransactions: Transaction[] = [];
    
    const currentBalance = parseFloat(account.balance || '0');
    
    // Delete all existing transactions for this account to start fresh
    await db.delete(transactions).where(eq(transactions.accountId, accountId));
    
    // Sort transactions chronologically (oldest first)
    const sortedTransactions = professionalTransactions.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Calculate the starting balance by working backwards from current balance
    let totalDebits = 0;
    let totalCredits = 0;
    
    for (const profTransaction of sortedTransactions) {
      const amount = parseFloat(profTransaction.amount);
      if (profTransaction.type === 'credit') {
        totalCredits += amount;
      } else {
        totalDebits += amount;
      }
    }
    
    // Starting balance = Current Balance - Total Credits + Total Debits
    let runningBalance = currentBalance - totalCredits + totalDebits;
    
    // Now create transactions in chronological order with correct balance calculations
    for (const profTransaction of sortedTransactions) {
      const amount = parseFloat(profTransaction.amount);
      
      // Calculate new balance after this transaction
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
    
    // Verify final balance matches current balance
    const finalBalance = parseFloat(seededTransactions[seededTransactions.length - 1].balanceAfter);
    if (Math.abs(finalBalance - currentBalance) > 0.01) {
      console.warn(`Balance mismatch: Expected ${currentBalance}, got ${finalBalance}`);
    }
    
    return seededTransactions;
  }

  async getAllTransactions(limit = 100): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .orderBy(desc(transactions.transactionDate))
      .limit(limit);
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined> {
    const result = await db.update(transactions)
      .set({ status })
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const result = await db.update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }

  async updateTransactionDate(id: string, transactionDate: Date): Promise<Transaction | undefined> {
    const result = await db.update(transactions)
      .set({ transactionDate })
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }

  async updateTransactionCreatedAt(id: string, createdAt: Date): Promise<Transaction | undefined> {
    const result = await db.update(transactions)
      .set({ createdAt })
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
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

  // Access codes
  async createAccessCode(code: InsertAccessCode): Promise<AccessCode> {
    const result = await db.insert(accessCodes).values(code).returning();
    return result[0];
  }

  async getAccessCode(code: string): Promise<AccessCode | undefined> {
    const result = await db.select().from(accessCodes)
      .where(eq(accessCodes.code, code))
      .limit(1);
    return result[0];
  }

  async getValidAccessCodes(): Promise<AccessCode[]> {
    const now = new Date();
    return await db.select().from(accessCodes)
      .where(
        and(
          eq(accessCodes.isUsed, false),
          gt(accessCodes.expiresAt, now)
        )
      )
      .orderBy(desc(accessCodes.createdAt));
  }

  async getAllAccessCodes(): Promise<AccessCode[]> {
    return await db.select().from(accessCodes)
      .orderBy(desc(accessCodes.createdAt));
  }

  async markAccessCodeAsUsed(code: string, userId: string): Promise<AccessCode | undefined> {
    const result = await db.update(accessCodes)
      .set({ 
        isUsed: true, 
        usedBy: userId,
        usedAt: new Date()
      })
      .where(eq(accessCodes.code, code))
      .returning();
    return result[0];
  }

  async deleteExpiredAccessCodes(): Promise<void> {
    const now = new Date();
    await db.delete(accessCodes)
      .where(lt(accessCodes.expiresAt, now));
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

  // Pending external transfers
  async createPendingExternalTransfer(transfer: InsertPendingExternalTransfer): Promise<PendingExternalTransfer> {
    const result = await db.insert(pendingExternalTransfers).values(transfer).returning();
    return result[0];
  }

  async getPendingExternalTransfer(id: string): Promise<PendingExternalTransfer | undefined> {
    const result = await db.select().from(pendingExternalTransfers).where(eq(pendingExternalTransfers.id, id)).limit(1);
    return result[0];
  }

  async getPendingExternalTransfersByUserId(userId: string): Promise<PendingExternalTransfer[]> {
    return await db.select().from(pendingExternalTransfers)
      .where(eq(pendingExternalTransfers.userId, userId))
      .orderBy(desc(pendingExternalTransfers.submittedAt));
  }

  async getAllPendingExternalTransfers(): Promise<PendingExternalTransfer[]> {
    return await db.select().from(pendingExternalTransfers)
      .orderBy(desc(pendingExternalTransfers.submittedAt));
  }

  async updatePendingExternalTransferStatus(id: string, status: string, processedBy?: string, rejectionReason?: string): Promise<PendingExternalTransfer | undefined> {
    const updateData: any = { 
      status,
      processedAt: new Date()
    };
    
    if (processedBy) {
      updateData.processedBy = processedBy;
    }
    
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const result = await db.update(pendingExternalTransfers)
      .set(updateData)
      .where(eq(pendingExternalTransfers.id, id))
      .returning();
    return result[0];
  }

  // Wire transfer methods
  async createDomesticWireTransfer(transfer: InsertDomesticWireTransfer): Promise<DomesticWireTransfer> {
    const result = await db.insert(domesticWireTransfers).values(transfer).returning();
    return result[0];
  }

  async createInternationalWireTransfer(transfer: InsertInternationalWireTransfer): Promise<InternationalWireTransfer> {
    const result = await db.insert(internationalWireTransfers).values(transfer).returning();
    return result[0];
  }

  async getDomesticWireTransfer(id: string): Promise<DomesticWireTransfer | undefined> {
    const result = await db.select().from(domesticWireTransfers).where(eq(domesticWireTransfers.id, id)).limit(1);
    return result[0];
  }

  async getInternationalWireTransfer(id: string): Promise<InternationalWireTransfer | undefined> {
    const result = await db.select().from(internationalWireTransfers).where(eq(internationalWireTransfers.id, id)).limit(1);
    return result[0];
  }

  async getDomesticWireTransfersByUserId(userId: string): Promise<DomesticWireTransfer[]> {
    return await db.select().from(domesticWireTransfers)
      .where(eq(domesticWireTransfers.userId, userId))
      .orderBy(desc(domesticWireTransfers.createdAt));
  }

  async getInternationalWireTransfersByUserId(userId: string): Promise<InternationalWireTransfer[]> {
    return await db.select().from(internationalWireTransfers)
      .where(eq(internationalWireTransfers.userId, userId))
      .orderBy(desc(internationalWireTransfers.createdAt));
  }

  async getAllDomesticWireTransfers(): Promise<DomesticWireTransfer[]> {
    return await db.select().from(domesticWireTransfers)
      .orderBy(desc(domesticWireTransfers.createdAt));
  }

  async getAllInternationalWireTransfers(): Promise<InternationalWireTransfer[]> {
    return await db.select().from(internationalWireTransfers)
      .orderBy(desc(internationalWireTransfers.createdAt));
  }

  async updateDomesticWireTransferStatus(id: string, status: string, processedBy?: string): Promise<DomesticWireTransfer | undefined> {
    const updateData: any = { 
      status,
      processedAt: new Date()
    };
    
    if (processedBy) {
      updateData.processedBy = processedBy;
    }

    const result = await db.update(domesticWireTransfers)
      .set(updateData)
      .where(eq(domesticWireTransfers.id, id))
      .returning();
    return result[0];
  }

  async updateInternationalWireTransferStatus(id: string, status: string, processedBy?: string): Promise<InternationalWireTransfer | undefined> {
    const updateData: any = { 
      status,
      processedAt: new Date()
    };
    
    if (processedBy) {
      updateData.processedBy = processedBy;
    }

    const result = await db.update(internationalWireTransfers)
      .set(updateData)
      .where(eq(internationalWireTransfers.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new PostgreSQLStorage();