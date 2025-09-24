import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  users,
  searchQueries,
  creditCardApplications,
  accountApplications,
  contactInquiries,
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
}

export const storage = new PostgreSQLStorage();