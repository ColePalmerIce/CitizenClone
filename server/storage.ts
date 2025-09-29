import { 
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
} from "@shared/schema";
import { randomUUID } from "crypto";
import { generateComprehensiveTransactionHistory } from "./transaction-seeds";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: string, hashedPassword: string): Promise<User | undefined>;
  updateUserStatus(userId: string, status: string, reason?: string, updatedBy?: string): Promise<User | undefined>;

  // Search queries
  saveSearchQuery(query: InsertSearchQuery): Promise<SearchQuery>;
  getRecentSearchQueries(limit?: number): Promise<SearchQuery[]>;

  // Credit card applications
  saveCreditCardApplication(application: InsertCreditCardApplication): Promise<CreditCardApplication>;
  getCreditCardApplication(id: string): Promise<CreditCardApplication | undefined>;
  getCreditCardApplicationsByEmail(email: string): Promise<CreditCardApplication[]>;

  // Account applications
  saveAccountApplication(application: InsertAccountApplication): Promise<AccountApplication>;
  getAccountApplication(id: string): Promise<AccountApplication | undefined>;
  getAccountApplicationsByEmail(email: string): Promise<AccountApplication[]>;
  getAllAccountApplications(): Promise<AccountApplication[]>;
  updateAccountApplicationStatus(id: string, status: string, adminId?: string, notes?: string): Promise<AccountApplication | undefined>;
  updateAccountApplicationNumbers(id: string, accountNumber: string, routingNumber: string): Promise<AccountApplication | undefined>;

  // Contact inquiries
  saveContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(status?: string): Promise<ContactInquiry[]>;
  updateContactInquiryStatus(id: string, status: string): Promise<ContactInquiry | undefined>;

  // Admin users
  getAdminByEmail(email: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(id: string): Promise<AdminUser | undefined>;

  // Admin balance
  getAdminBalance(adminId: string): Promise<AdminBalance | undefined>;
  createAdminBalance(balance: InsertAdminBalance): Promise<AdminBalance>;
  updateAdminBalance(adminId: string, newBalance: string): Promise<AdminBalance | undefined>;

  // Bank accounts
  createBankAccount(account: InsertBankAccount): Promise<BankAccount>;
  getBankAccount(id: string): Promise<BankAccount | undefined>;
  getBankAccountByNumber(accountNumber: string): Promise<BankAccount | undefined>;
  getBankAccountsByUserId(userId: string): Promise<BankAccount[]>;
  getAllBankAccounts(): Promise<BankAccount[]>;
  updateBankAccountBalance(id: string, newBalance: string): Promise<BankAccount | undefined>;
  updateBankAccountStatus(id: string, status: string): Promise<BankAccount | undefined>;
  deleteBankAccount(id: string): Promise<boolean>;

  // Transactions
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByAccountId(accountId: string, limit?: number): Promise<Transaction[]>;
  seedAccountWithProfessionalTransactions(accountId: string): Promise<Transaction[]>;
  getAllTransactions(limit?: number): Promise<Transaction[]>;
  updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined>;

  // Customer profiles
  createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile>;
  getCustomerProfile(userId: string): Promise<CustomerProfile | undefined>;
  updateCustomerProfile(userId: string, updates: Partial<InsertCustomerProfile>): Promise<CustomerProfile | undefined>;

  // Credit limit increase requests
  createCreditLimitIncreaseRequest(request: InsertCreditLimitIncreaseRequest): Promise<SelectCreditLimitIncreaseRequest>;
  getCreditLimitIncreaseRequestsByUserId(userId: string): Promise<SelectCreditLimitIncreaseRequest[]>;
  updateCreditLimitIncreaseRequestStatus(id: string, status: string): Promise<SelectCreditLimitIncreaseRequest | undefined>;

  // Debit limit increase requests
  createDebitLimitIncreaseRequest(request: InsertDebitLimitIncreaseRequest): Promise<SelectDebitLimitIncreaseRequest>;
  getDebitLimitIncreaseRequestsByUserId(userId: string): Promise<SelectDebitLimitIncreaseRequest[]>;
  updateDebitLimitIncreaseRequestStatus(id: string, status: string): Promise<SelectDebitLimitIncreaseRequest | undefined>;

  // Pending external transfers
  createPendingExternalTransfer(transfer: InsertPendingExternalTransfer): Promise<PendingExternalTransfer>;
  getPendingExternalTransfer(id: string): Promise<PendingExternalTransfer | undefined>;
  getPendingExternalTransfersByUserId(userId: string): Promise<PendingExternalTransfer[]>;
  getAllPendingExternalTransfers(): Promise<PendingExternalTransfer[]>;
  updatePendingExternalTransferStatus(id: string, status: string, processedBy?: string, rejectionReason?: string): Promise<PendingExternalTransfer | undefined>;

  // Wire transfers
  createDomesticWireTransfer(transfer: InsertDomesticWireTransfer): Promise<DomesticWireTransfer>;
  createInternationalWireTransfer(transfer: InsertInternationalWireTransfer): Promise<InternationalWireTransfer>;
  getDomesticWireTransfer(id: string): Promise<DomesticWireTransfer | undefined>;
  getInternationalWireTransfer(id: string): Promise<InternationalWireTransfer | undefined>;
  getDomesticWireTransfersByUserId(userId: string): Promise<DomesticWireTransfer[]>;
  getInternationalWireTransfersByUserId(userId: string): Promise<InternationalWireTransfer[]>;
  getAllDomesticWireTransfers(): Promise<DomesticWireTransfer[]>;
  getAllInternationalWireTransfers(): Promise<InternationalWireTransfer[]>;
  updateDomesticWireTransferStatus(id: string, status: string, processedBy?: string): Promise<DomesticWireTransfer | undefined>;
  updateInternationalWireTransferStatus(id: string, status: string, processedBy?: string): Promise<InternationalWireTransfer | undefined>;

  // Admin dashboard utilities
  getTotalCustomers(): Promise<number>;
  getTotalAccountBalance(): Promise<string>;
  getRecentTransactions(limit?: number): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private searchQueries: Map<string, SearchQuery>;
  private creditCardApplications: Map<string, CreditCardApplication>;
  private accountApplications: Map<string, AccountApplication>;
  private contactInquiries: Map<string, ContactInquiry>;
  private creditLimitIncreaseRequests: Map<string, SelectCreditLimitIncreaseRequest>;
  private debitLimitIncreaseRequests: Map<string, SelectDebitLimitIncreaseRequest>;
  private pendingExternalTransfers: Map<string, PendingExternalTransfer>;

  constructor() {
    this.users = new Map();
    this.searchQueries = new Map();
    this.creditCardApplications = new Map();
    this.accountApplications = new Map();
    this.contactInquiries = new Map();
    this.creditLimitIncreaseRequests = new Map();
    this.debitLimitIncreaseRequests = new Map();
    this.pendingExternalTransfers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      status: insertUser.status || 'active',
      statusReason: insertUser.statusReason || null,
      statusUpdatedBy: insertUser.statusUpdatedBy || null,
      statusUpdatedAt: insertUser.statusUpdatedAt || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(userId: string, hashedPassword: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }
    const updatedUser = { ...user, password: hashedPassword };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserStatus(userId: string, status: string, reason?: string, updatedBy?: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }
    const updatedUser = { 
      ...user, 
      status, 
      statusReason: reason || null, 
      statusUpdatedBy: updatedBy || null, 
      statusUpdatedAt: new Date() 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async saveSearchQuery(insertQuery: InsertSearchQuery): Promise<SearchQuery> {
    const id = randomUUID();
    const query: SearchQuery = {
      ...insertQuery,
      id,
      results: insertQuery.results || null,
      timestamp: new Date(),
    };
    this.searchQueries.set(id, query);
    return query;
  }

  async getRecentSearchQueries(limit = 10): Promise<SearchQuery[]> {
    return Array.from(this.searchQueries.values())
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async saveCreditCardApplication(insertApplication: InsertCreditCardApplication): Promise<CreditCardApplication> {
    const id = randomUUID();
    const application: CreditCardApplication = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.creditCardApplications.set(id, application);
    return application;
  }

  async getCreditCardApplication(id: string): Promise<CreditCardApplication | undefined> {
    return this.creditCardApplications.get(id);
  }

  async getCreditCardApplicationsByEmail(email: string): Promise<CreditCardApplication[]> {
    return Array.from(this.creditCardApplications.values()).filter(
      (app) => app.applicantEmail === email,
    );
  }

  async saveAccountApplication(insertApplication: InsertAccountApplication): Promise<AccountApplication> {
    const id = randomUUID();
    const application: AccountApplication = {
      ...insertApplication,
      id,
      status: "pending",
      createdAt: new Date(),
      accountNumber: null,
      routingNumber: null,
      approvedBy: null,
      approvedAt: null,
      ssn: insertApplication.ssn || null,
      dateOfBirth: insertApplication.dateOfBirth || null,
      phoneNumber: insertApplication.phoneNumber || null,
      street: insertApplication.street || null,
      city: insertApplication.city || null,
      state: insertApplication.state || null,
      zipCode: insertApplication.zipCode || null,
      employer: insertApplication.employer || null,
      jobTitle: insertApplication.jobTitle || null,
      annualIncome: insertApplication.annualIncome || null,
      employmentType: insertApplication.employmentType || null,
      initialDeposit: insertApplication.initialDeposit || null,
      adminNotes: null,
    };
    this.accountApplications.set(id, application);
    return application;
  }

  async getAccountApplication(id: string): Promise<AccountApplication | undefined> {
    return this.accountApplications.get(id);
  }

  async getAccountApplicationsByEmail(email: string): Promise<AccountApplication[]> {
    return Array.from(this.accountApplications.values()).filter(
      (app) => app.email === email,
    );
  }

  async getAllAccountApplications(): Promise<AccountApplication[]> {
    return Array.from(this.accountApplications.values());
  }

  async updateAccountApplicationStatus(id: string, status: string, adminId?: string, notes?: string): Promise<AccountApplication | undefined> {
    const application = this.accountApplications.get(id);
    if (application) {
      const updatedApplication: AccountApplication = {
        ...application,
        status,
        approvedBy: adminId || application.approvedBy,
        adminNotes: notes || application.adminNotes,
        approvedAt: status === 'approved' ? new Date() : application.approvedAt,
      };
      this.accountApplications.set(id, updatedApplication);
      return updatedApplication;
    }
    return undefined;
  }

  async updateAccountApplicationNumbers(id: string, accountNumber: string, routingNumber: string): Promise<AccountApplication | undefined> {
    const application = this.accountApplications.get(id);
    if (application) {
      const updatedApplication: AccountApplication = {
        ...application,
        accountNumber,
        routingNumber,
      };
      this.accountApplications.set(id, updatedApplication);
      return updatedApplication;
    }
    return undefined;
  }

  async saveContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const id = randomUUID();
    const inquiry: ContactInquiry = {
      ...insertInquiry,
      id,
      status: "new",
      createdAt: new Date(),
    };
    this.contactInquiries.set(id, inquiry);
    return inquiry;
  }

  async getContactInquiries(status?: string): Promise<ContactInquiry[]> {
    const inquiries = Array.from(this.contactInquiries.values());
    if (status) {
      return inquiries.filter((inquiry) => inquiry.status === status);
    }
    return inquiries;
  }

  async updateContactInquiryStatus(id: string, status: string): Promise<ContactInquiry | undefined> {
    const inquiry = this.contactInquiries.get(id);
    if (inquiry) {
      inquiry.status = status;
      this.contactInquiries.set(id, inquiry);
    }
    return inquiry;
  }

  // Credit limit increase requests
  async createCreditLimitIncreaseRequest(request: InsertCreditLimitIncreaseRequest): Promise<SelectCreditLimitIncreaseRequest> {
    const id = randomUUID();
    const limitRequest: SelectCreditLimitIncreaseRequest = {
      ...request,
      id,
      status: "pending",
      reason: request.reason || null,
      createdAt: new Date(),
    };
    this.creditLimitIncreaseRequests.set(id, limitRequest);
    return limitRequest;
  }

  async getCreditLimitIncreaseRequestsByUserId(userId: string): Promise<SelectCreditLimitIncreaseRequest[]> {
    return Array.from(this.creditLimitIncreaseRequests.values()).filter(req => req.userId === userId);
  }

  async updateCreditLimitIncreaseRequestStatus(id: string, status: string): Promise<SelectCreditLimitIncreaseRequest | undefined> {
    const request = this.creditLimitIncreaseRequests.get(id);
    if (request) {
      request.status = status;
      this.creditLimitIncreaseRequests.set(id, request);
    }
    return request;
  }

  // Debit limit increase requests
  async createDebitLimitIncreaseRequest(request: InsertDebitLimitIncreaseRequest): Promise<SelectDebitLimitIncreaseRequest> {
    const id = randomUUID();
    const limitRequest: SelectDebitLimitIncreaseRequest = {
      ...request,
      id,
      status: "pending",
      reason: request.reason || null,
      createdAt: new Date(),
    };
    this.debitLimitIncreaseRequests.set(id, limitRequest);
    return limitRequest;
  }

  async getDebitLimitIncreaseRequestsByUserId(userId: string): Promise<SelectDebitLimitIncreaseRequest[]> {
    return Array.from(this.debitLimitIncreaseRequests.values()).filter(req => req.userId === userId);
  }

  async updateDebitLimitIncreaseRequestStatus(id: string, status: string): Promise<SelectDebitLimitIncreaseRequest | undefined> {
    const request = this.debitLimitIncreaseRequests.get(id);
    if (request) {
      request.status = status;
      this.debitLimitIncreaseRequests.set(id, request);
    }
    return request;
  }

  async updateTransactionStatus(id: string, status: string): Promise<Transaction | undefined> {
    // Note: MemStorage doesn't store transactions - this is a placeholder
    // In production, PostgreSQL storage handles transactions
    return undefined;
  }

  // Pending external transfers (placeholder implementations)
  async createPendingExternalTransfer(transfer: InsertPendingExternalTransfer): Promise<PendingExternalTransfer> {
    const id = randomUUID();
    const pendingTransfer: PendingExternalTransfer = {
      ...transfer,
      id,
      status: "pending",
      purpose: transfer.purpose || null,
      processedBy: null,
      processedAt: null,
      rejectionReason: null,
      submittedAt: new Date(),
      createdAt: new Date(),
      // Ensure proper null handling for new fields
      recipientPhoneNumber: transfer.recipientPhoneNumber || null,
      recipientAddress: transfer.recipientAddress || null,
    };
    this.pendingExternalTransfers.set(id, pendingTransfer);
    return pendingTransfer;
  }

  async getPendingExternalTransfer(id: string): Promise<PendingExternalTransfer | undefined> {
    return this.pendingExternalTransfers.get(id);
  }

  async getPendingExternalTransfersByUserId(userId: string): Promise<PendingExternalTransfer[]> {
    return Array.from(this.pendingExternalTransfers.values()).filter(transfer => transfer.userId === userId);
  }

  async getAllPendingExternalTransfers(): Promise<PendingExternalTransfer[]> {
    return Array.from(this.pendingExternalTransfers.values());
  }

  async updatePendingExternalTransferStatus(id: string, status: string, processedBy?: string, rejectionReason?: string): Promise<PendingExternalTransfer | undefined> {
    const transfer = this.pendingExternalTransfers.get(id);
    if (transfer) {
      transfer.status = status;
      transfer.processedAt = new Date();
      if (processedBy) transfer.processedBy = processedBy;
      if (rejectionReason) transfer.rejectionReason = rejectionReason;
      this.pendingExternalTransfers.set(id, transfer);
    }
    return transfer;
  }

  // Placeholder implementations for missing banking methods (we use PostgreSQL in production)
  async getAdminByEmail(email: string): Promise<AdminUser | undefined> { return undefined; }
  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> { throw new Error("Not implemented in MemStorage"); }
  async updateAdminLastLogin(id: string): Promise<AdminUser | undefined> { return undefined; }
  async getAdminBalance(adminId: string): Promise<AdminBalance | undefined> { return undefined; }
  async createAdminBalance(balance: InsertAdminBalance): Promise<AdminBalance> { throw new Error("Not implemented in MemStorage"); }
  async updateAdminBalance(adminId: string, newBalance: string): Promise<AdminBalance | undefined> { return undefined; }
  async createBankAccount(account: InsertBankAccount): Promise<BankAccount> { throw new Error("Not implemented in MemStorage"); }
  async getBankAccount(id: string): Promise<BankAccount | undefined> { return undefined; }
  async getBankAccountByNumber(accountNumber: string): Promise<BankAccount | undefined> { return undefined; }
  async getBankAccountsByUserId(userId: string): Promise<BankAccount[]> { return []; }
  async getAllBankAccounts(): Promise<BankAccount[]> { return []; }
  async updateBankAccountBalance(id: string, newBalance: string): Promise<BankAccount | undefined> { return undefined; }
  async updateBankAccountStatus(id: string, status: string): Promise<BankAccount | undefined> { return undefined; }
  async deleteBankAccount(id: string): Promise<boolean> { return false; }
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> { throw new Error("Not implemented in MemStorage"); }
  async getTransaction(id: string): Promise<Transaction | undefined> { return undefined; }
  async getTransactionsByAccountId(accountId: string, limit?: number): Promise<Transaction[]> { return []; }
  async seedAccountWithProfessionalTransactions(accountId: string): Promise<Transaction[]> { return []; }
  async getAllTransactions(limit?: number): Promise<Transaction[]> { return []; }
  async createCustomerProfile(profile: InsertCustomerProfile): Promise<CustomerProfile> { throw new Error("Not implemented in MemStorage"); }
  async getCustomerProfile(userId: string): Promise<CustomerProfile | undefined> { return undefined; }
  async updateCustomerProfile(userId: string, updates: Partial<InsertCustomerProfile>): Promise<CustomerProfile | undefined> { return undefined; }
  
  // Wire transfer placeholder implementations
  async createDomesticWireTransfer(transfer: InsertDomesticWireTransfer): Promise<DomesticWireTransfer> { throw new Error("Not implemented in MemStorage"); }
  async createInternationalWireTransfer(transfer: InsertInternationalWireTransfer): Promise<InternationalWireTransfer> { throw new Error("Not implemented in MemStorage"); }
  async getDomesticWireTransfer(id: string): Promise<DomesticWireTransfer | undefined> { return undefined; }
  async getInternationalWireTransfer(id: string): Promise<InternationalWireTransfer | undefined> { return undefined; }
  async getDomesticWireTransfersByUserId(userId: string): Promise<DomesticWireTransfer[]> { return []; }
  async getInternationalWireTransfersByUserId(userId: string): Promise<InternationalWireTransfer[]> { return []; }
  async getAllDomesticWireTransfers(): Promise<DomesticWireTransfer[]> { return []; }
  async getAllInternationalWireTransfers(): Promise<InternationalWireTransfer[]> { return []; }
  async updateDomesticWireTransferStatus(id: string, status: string, processedBy?: string): Promise<DomesticWireTransfer | undefined> { return undefined; }
  async updateInternationalWireTransferStatus(id: string, status: string, processedBy?: string): Promise<InternationalWireTransfer | undefined> { return undefined; }
  
  async getTotalCustomers(): Promise<number> { return 0; }
  async getTotalAccountBalance(): Promise<string> { return "0.00"; }
  async getRecentTransactions(limit?: number): Promise<Transaction[]> { return []; }
}

// Import PostgreSQL storage from db.ts
import { storage as dbStorage } from "./db";

console.log("Using PostgreSQL storage for banking system");
export const storage = dbStorage;
