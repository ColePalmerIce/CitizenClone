import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSearchQuerySchema,
  insertCreditCardApplicationSchema,
  insertAccountApplicationSchema,
  insertContactInquirySchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search queries
  app.post("/api/search", async (req, res) => {
    try {
      const validatedData = insertSearchQuerySchema.parse(req.body);
      const searchQuery = await storage.saveSearchQuery(validatedData);
      
      // Simulate search results
      const mockResults = [
        { title: "Digital Banking", url: "/digital-banking", type: "page" },
        { title: "Credit Cards", url: "/credit-cards", type: "page" },
        { title: "Account Balance", url: "/balance", type: "service" },
      ].filter(result => 
        result.title.toLowerCase().includes(validatedData.query.toLowerCase())
      );

      res.json({ 
        query: searchQuery,
        results: mockResults,
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid search query data" });
    }
  });

  app.get("/api/search/recent", async (_req, res) => {
    try {
      const recentQueries = await storage.getRecentSearchQueries(5);
      res.json(recentQueries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });

  // Credit card applications
  app.post("/api/credit-card-application", async (req, res) => {
    try {
      const validatedData = insertCreditCardApplicationSchema.parse(req.body);
      const application = await storage.saveCreditCardApplication(validatedData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid credit card application data" });
    }
  });

  app.get("/api/credit-card-application/:email", async (req, res) => {
    try {
      const applications = await storage.getCreditCardApplicationsByEmail(req.params.email);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credit card applications" });
    }
  });

  // Account applications
  app.post("/api/account-application", async (req, res) => {
    try {
      const validatedData = insertAccountApplicationSchema.parse(req.body);
      const application = await storage.saveAccountApplication(validatedData);
      res.json(application);
    } catch (error) {
      res.status(400).json({ message: "Invalid account application data" });
    }
  });

  app.get("/api/account-application/:email", async (req, res) => {
    try {
      const applications = await storage.getAccountApplicationsByEmail(req.params.email);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch account applications" });
    }
  });

  // Contact inquiries
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.saveContactInquiry(validatedData);
      res.json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact inquiry data" });
    }
  });

  app.get("/api/contact-inquiries", async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const inquiries = await storage.getContactInquiries(status);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact inquiries" });
    }
  });

  app.put("/api/contact-inquiry/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }

      const inquiry = await storage.updateContactInquiryStatus(req.params.id, status);
      if (!inquiry) {
        return res.status(404).json({ message: "Contact inquiry not found" });
      }

      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact inquiry status" });
    }
  });

  // Banking insights (mock data)
  app.get("/api/insights", async (_req, res) => {
    try {
      const insights = [
        {
          id: "1",
          category: "Investing",
          title: "Self-directed investing fundamentals",
          description: "Even with a self-directed account, a professional approach can help you successfully manage your portfolio.",
          content: "Detailed content about self-directed investing...",
          publishedAt: new Date("2024-01-15"),
        },
        {
          id: "2", 
          category: "Retirement",
          title: "Key ways to think about financial planning",
          description: "Here are some fundamental considerations when making a financial plan.",
          content: "Detailed content about financial planning...",
          publishedAt: new Date("2024-01-10"),
        },
        {
          id: "3",
          category: "Investing", 
          title: "How to choose IRA investments",
          description: "Learn how to choose IRA investments that align with your personal risk tolerance and support your retirement savings goals.",
          content: "Detailed content about IRA investments...",
          publishedAt: new Date("2024-01-05"),
        },
      ];
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  // Branch locator (mock data)
  app.get("/api/branches", async (req, res) => {
    try {
      const { zipCode, city } = req.query;
      
      // Mock branch data
      const branches = [
        {
          id: "1",
          name: "First Citizens Bank - Main Street",
          address: "123 Main Street, Anytown, ST 12345",
          phone: "(555) 123-4567",
          hours: {
            monday: "9:00 AM - 5:00 PM",
            tuesday: "9:00 AM - 5:00 PM",
            wednesday: "9:00 AM - 5:00 PM",
            thursday: "9:00 AM - 5:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "9:00 AM - 1:00 PM",
            sunday: "Closed",
          },
          services: ["Banking", "Loans", "Investment Services"],
          coordinates: { lat: 35.7796, lng: -78.6382 },
        },
        {
          id: "2", 
          name: "First Citizens Bank - Oak Plaza",
          address: "456 Oak Street, Anytown, ST 12345",
          phone: "(555) 234-5678",
          hours: {
            monday: "9:00 AM - 5:00 PM",
            tuesday: "9:00 AM - 5:00 PM", 
            wednesday: "9:00 AM - 5:00 PM",
            thursday: "9:00 AM - 5:00 PM",
            friday: "9:00 AM - 6:00 PM",
            saturday: "9:00 AM - 1:00 PM",
            sunday: "Closed",
          },
          services: ["Banking", "Commercial Services"],
          coordinates: { lat: 35.7896, lng: -78.6282 },
        },
      ];

      // Simple filtering by zip code or city if provided
      let filteredBranches = branches;
      if (zipCode || city) {
        filteredBranches = branches.filter(branch => 
          branch.address.includes(zipCode as string) || 
          branch.address.toLowerCase().includes((city as string)?.toLowerCase() || "")
        );
      }

      res.json(filteredBranches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
