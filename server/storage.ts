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
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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

  // Contact inquiries
  saveContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(status?: string): Promise<ContactInquiry[]>;
  updateContactInquiryStatus(id: string, status: string): Promise<ContactInquiry | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private searchQueries: Map<string, SearchQuery>;
  private creditCardApplications: Map<string, CreditCardApplication>;
  private accountApplications: Map<string, AccountApplication>;
  private contactInquiries: Map<string, ContactInquiry>;

  constructor() {
    this.users = new Map();
    this.searchQueries = new Map();
    this.creditCardApplications = new Map();
    this.accountApplications = new Map();
    this.contactInquiries = new Map();
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
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
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
      personalInfo: insertApplication.personalInfo || null,
      createdAt: new Date(),
    };
    this.accountApplications.set(id, application);
    return application;
  }

  async getAccountApplication(id: string): Promise<AccountApplication | undefined> {
    return this.accountApplications.get(id);
  }

  async getAccountApplicationsByEmail(email: string): Promise<AccountApplication[]> {
    return Array.from(this.accountApplications.values()).filter(
      (app) => app.applicantEmail === email,
    );
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
}

// Use in-memory storage for now during setup, can switch to PostgreSQL later
const memStorage = new MemStorage();

console.log("Using in-memory storage for development");
export const storage = memStorage;
