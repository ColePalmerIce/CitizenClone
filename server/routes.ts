import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { WebSocketServer, WebSocket } from 'ws';
import { 
  insertSearchQuerySchema,
  insertCreditCardApplicationSchema,
  insertAccountApplicationSchema,
  insertContactInquirySchema,
  insertAdminUserSchema,
  insertBankAccountSchema,
  insertTransactionSchema,
  insertCustomerProfileSchema,
  insertUserSchema,
  insertCreditLimitIncreaseRequestSchema,
  insertDebitLimitIncreaseRequestSchema,
  type Transaction,
} from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";

// Extend express-session
declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userType?: 'customer' | 'admin';
    adminId?: string;
    adminEmail?: string;
  }
}

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

  // Admin Authentication Routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find admin user
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last login
      await storage.updateAdminLastLogin(admin.id);

      // Initialize admin balance if it doesn't exist (auto $500 million)
      let adminBalance = await storage.getAdminBalance(admin.id);
      if (!adminBalance) {
        adminBalance = await storage.createAdminBalance({
          adminId: admin.id,
          balance: "500000000.00" // $500 million
        });
      }

      // Set session
      (req.session as any).adminId = admin.id;
      (req.session as any).adminEmail = admin.email;

      res.json({ 
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/admin/session", async (req, res) => {
    try {
      const adminId = (req.session as any)?.adminId;
      if (!adminId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const admin = await storage.getAdminByEmail((req.session as any).adminEmail);
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }

      res.json({
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role
      });
    } catch (error) {
      res.status(500).json({ message: "Session check failed" });
    }
  });

  // Admin Dashboard Routes
  const requireAdmin = (req: any, res: any, next: any) => {
    const adminId = req.session?.adminId;
    if (!adminId) {
      return res.status(401).json({ message: "Admin authentication required" });
    }
    next();
  };

  // Get admin balance
  app.get("/api/admin/balance", requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).adminId;
      const adminBalance = await storage.getAdminBalance(adminId);
      
      if (!adminBalance) {
        // Create default balance if not exists
        const newBalance = await storage.createAdminBalance({
          adminId: adminId,
          balance: "500000000.00"
        });
        return res.json(newBalance);
      }
      
      res.json(adminBalance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin balance" });
    }
  });

  // Admin self-credit endpoint
  app.post("/api/admin/credit-self", requireAdmin, async (req, res) => {
    try {
      const adminId = (req.session as any).adminId;
      const { amount, description } = req.body;
      
      if (!amount || !description) {
        return res.status(400).json({ message: "Amount and description are required" });
      }
      
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      
      // Get current admin balance
      const currentBalance = await storage.getAdminBalance(adminId);
      if (!currentBalance) {
        return res.status(404).json({ message: "Admin balance not found" });
      }
      
      // Calculate new balance
      const currentAmount = parseFloat(currentBalance.balance || '0');
      const newAmount = currentAmount + numAmount;
      
      // Update admin balance
      await storage.updateAdminBalance(adminId, newAmount.toFixed(2));
      
      // Get updated balance to return
      const updatedBalance = await storage.getAdminBalance(adminId);
      
      res.json({
        success: true,
        message: "Admin balance updated successfully",
        balance: updatedBalance
      });
    } catch (error) {
      console.error('Admin credit error:', error);
      res.status(500).json({ message: "Failed to credit admin balance" });
    }
  });

  app.get("/api/admin/dashboard/stats", requireAdmin, async (req, res) => {
    try {
      const totalCustomers = await storage.getTotalCustomers();
      const totalBalance = await storage.getTotalAccountBalance();
      const recentTransactions = await storage.getRecentTransactions(5);
      const allAccounts = await storage.getAllBankAccounts();

      res.json({
        totalCustomers,
        totalBalance,
        totalAccounts: allAccounts.length,
        recentTransactions,
        accounts: allAccounts.slice(0, 10) // Latest 10 accounts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // User/Customer Management Routes
  app.post("/api/admin/customers", requireAdmin, async (req, res) => {
    try {
      const { 
        username, 
        email, 
        firstName, 
        lastName, 
        password,
        accountType = "checking",
        initialBalance = "0.00"
      } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        email, 
        password: hashedPassword,
        firstName,
        lastName
      });

      // Generate realistic Citizens Bank account number (8-10 digits)
      const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // 10 digits
      
      // First Citizens Bank routing number (fictional for demo)
      const routingNumber = "053000196";

      // Create bank account
      const account = await storage.createBankAccount({
        userId: user.id,
        accountNumber: accountNumber.toString(),
        routingNumber,
        accountType,
        balance: initialBalance
      });

      // Create customer profile
      const profile = await storage.createCustomerProfile({
        userId: user.id,
        kycStatus: "approved"
      });

      res.json({ user, account, profile });
    } catch (error) {
      res.status(500).json({ message: "Failed to create customer account" });
    }
  });

  app.get("/api/admin/customers", requireAdmin, async (req, res) => {
    try {
      const accounts = await storage.getAllBankAccounts();
      // Force no caching to get fresh data
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.json(accounts);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.delete("/api/admin/customers/:accountId", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteBankAccount(req.params.accountId);
      if (!success) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // Admin customer fund management endpoints
  app.post("/api/admin/customer/add-funds", requireAdmin, async (req, res) => {
    try {
      const adminId = req.session.adminId;
      const { accountId, amount, description } = req.body;
      
      if (!accountId || !amount || !description) {
        return res.status(400).json({ message: "Account ID, amount, and description are required" });
      }

      const creditAmount = parseFloat(amount);
      if (isNaN(creditAmount) || creditAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Get admin balance
      const adminBalance = await storage.getAdminBalance(adminId!);
      if (!adminBalance || parseFloat(adminBalance.balance || '0') < creditAmount) {
        return res.status(400).json({ message: "Insufficient admin balance" });
      }

      // Get the account
      const account = await storage.getBankAccount(accountId);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const currentBalance = parseFloat(account.balance || '0');
      const newBalance = currentBalance + creditAmount;
      const newAdminBalance = parseFloat(adminBalance.balance || '0') - creditAmount;

      // Update admin balance first
      await storage.updateAdminBalance(adminId!, newAdminBalance.toFixed(2));

      // Create transaction
      const transaction = await storage.createTransaction({
        accountId: accountId,
        type: 'credit',
        amount: amount,
        description: `Admin Credit: ${description}`,
        balanceAfter: newBalance.toFixed(2),
        status: 'completed',
        processedBy: adminId!,
        merchantName: 'First Citizens Bank Admin',
        merchantLocation: 'Administrative Office',
        merchantCategory: 'banking'
      });

      // Update account balance
      await storage.updateBankAccountBalance(accountId, newBalance.toFixed(2));

      // Send real-time notification to user - temporarily disabled
      // if ((global as any).sendNotificationToUser) {
      //   (global as any).sendNotificationToUser(account.userId, {
      //     type: 'balance_update',
      //     title: 'Account Credited',
      //     message: `$${amount} has been credited to your ${account.accountType} account by Administrative`,
      //     amount: creditAmount,
      //     newBalance: newBalance.toFixed(2),
      //     timestamp: new Date().toISOString()
      //   });
      // }

      res.json({ 
        success: true, 
        transaction,
        newBalance: newBalance.toFixed(2),
        adminBalance: newAdminBalance.toFixed(2),
        message: `Successfully added $${amount} to account` 
      });
    } catch (error) {
      console.error('Add funds error:', error);
      res.status(500).json({ message: "Failed to add funds" });
    }
  });

  app.post("/api/admin/customer/withdraw-funds", requireAdmin, async (req, res) => {
    try {
      const adminId = req.session.adminId;
      const { accountId, amount, description } = req.body;
      
      if (!accountId || !amount || !description) {
        return res.status(400).json({ message: "Account ID, amount, and description are required" });
      }

      const debitAmount = parseFloat(amount);
      if (isNaN(debitAmount) || debitAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      // Get the account
      const account = await storage.getBankAccount(accountId);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const currentBalance = parseFloat(account.balance || '0');
      if (currentBalance < debitAmount) {
        return res.status(400).json({ message: "Insufficient account balance" });
      }

      const newBalance = currentBalance - debitAmount;

      // Get admin balance and add withdrawn amount
      const adminBalance = await storage.getAdminBalance(adminId!);
      const newAdminBalance = parseFloat(adminBalance?.balance || '0') + debitAmount;

      // Update admin balance first (add withdrawn funds)
      await storage.updateAdminBalance(adminId!, newAdminBalance.toFixed(2));

      // Create transaction
      const transaction = await storage.createTransaction({
        accountId: accountId,
        type: 'debit',
        amount: amount,
        description: `Admin Withdrawal: ${description}`,
        balanceAfter: newBalance.toFixed(2),
        status: 'completed',
        processedBy: adminId!,
        merchantName: 'First Citizens Bank Admin',
        merchantLocation: 'Administrative Office',
        merchantCategory: 'banking'
      });

      // Update account balance
      await storage.updateBankAccountBalance(accountId, newBalance.toFixed(2));

      // Send real-time notification to user - temporarily disabled
      // if ((global as any).sendNotificationToUser) {
      //   (global as any).sendNotificationToUser(account.userId, {
      //     type: 'balance_update',
      //     title: 'Account Debited',
      //     message: `$${amount} has been withdrawn from your ${account.accountType} account by Administrative`,
      //     amount: -debitAmount,
      //     newBalance: newBalance.toFixed(2),
      //     timestamp: new Date().toISOString()
      //   });
      // }

      res.json({ 
        success: true, 
        transaction,
        newBalance: newBalance.toFixed(2),
        adminBalance: newAdminBalance.toFixed(2),
        message: `Successfully withdrew $${amount} from account` 
      });
    } catch (error) {
      console.error('Withdraw funds error:', error);
      res.status(500).json({ message: "Failed to withdraw funds" });
    }
  });

  // Transaction Management Routes
  app.post("/api/admin/transactions", requireAdmin, async (req, res) => {
    try {
      const { accountId, type, amount, description } = req.body;
      const adminId = (req.session as any).adminId;

      // Get current account balance
      const account = await storage.getBankAccount(accountId);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      const currentBalance = parseFloat(account.balance || '0');
      const transactionAmount = parseFloat(amount);

      let newBalance: number;
      if (type === 'credit') {
        newBalance = currentBalance + transactionAmount;
      } else if (type === 'debit') {
        if (currentBalance < transactionAmount) {
          return res.status(400).json({ message: "Insufficient funds" });
        }
        newBalance = currentBalance - transactionAmount;
      } else {
        return res.status(400).json({ message: "Invalid transaction type" });
      }

      // Create transaction record
      const transaction = await storage.createTransaction({
        accountId,
        type,
        amount: amount.toString(),
        description,
        balanceAfter: newBalance.toFixed(2),
        processedBy: adminId
      });

      // Update account balance
      await storage.updateBankAccountBalance(accountId, newBalance.toFixed(2));

      // Update admin balance automatically (opposite of user transaction)
      const adminBalance = await storage.getAdminBalance(adminId);
      if (adminBalance) {
        const currentAdminBalance = parseFloat(adminBalance.balance || '0');
        let newAdminBalance: number;
        
        if (type === 'credit') {
          // Admin credits user → debit admin balance
          newAdminBalance = currentAdminBalance - transactionAmount;
        } else {
          // Admin debits user → credit admin balance  
          newAdminBalance = currentAdminBalance + transactionAmount;
        }
        
        await storage.updateAdminBalance(adminId, newAdminBalance.toFixed(2));
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to process transaction" });
    }
  });

  app.get("/api/admin/transactions", requireAdmin, async (req, res) => {
    try {
      const { accountId, limit } = req.query;
      let transactions;
      
      if (accountId) {
        transactions = await storage.getTransactionsByAccountId(
          accountId as string, 
          parseInt(limit as string) || 50
        );
      } else {
        transactions = await storage.getAllTransactions(
          parseInt(limit as string) || 100
        );
      }
      
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // User authentication routes
  app.post("/api/user/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Get user by username
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Store user session
      req.session.userId = user.id;
      req.session.userType = 'customer';
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('User login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/user/session", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Session check failed" });
    }
  });

  app.post("/api/user/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Credit limit increase request
  app.post("/api/user/credit-limit-increase", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const validatedData = insertCreditLimitIncreaseRequestSchema.parse({
        ...req.body,
        userId
      });
      
      const request = await storage.createCreditLimitIncreaseRequest(validatedData);
      res.json(request);
    } catch (error) {
      console.error('Credit limit increase request error:', error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Debit limit increase request
  app.post("/api/user/debit-limit-increase", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const validatedData = insertDebitLimitIncreaseRequestSchema.parse({
        ...req.body,
        userId
      });
      
      const request = await storage.createDebitLimitIncreaseRequest(validatedData);
      res.json(request);
    } catch (error) {
      console.error('Debit limit increase request error:', error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Get user limit increase requests
  app.get("/api/user/limit-increase-requests", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const [creditRequests, debitRequests] = await Promise.all([
        storage.getCreditLimitIncreaseRequestsByUserId(userId),
        storage.getDebitLimitIncreaseRequestsByUserId(userId)
      ]);

      res.json({
        creditRequests,
        debitRequests
      });
    } catch (error) {
      console.error('Get limit increase requests error:', error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/user/change-password", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Password requirements validation
      if (newPassword.length < 8) {
        return res.status(400).json({ message: "New password must be at least 8 characters long" });
      }

      // Get current user
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const validCurrentPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validCurrentPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      const updatedUser = await storage.updateUserPassword(userId, hashedNewPassword);
      if (!updatedUser) {
        return res.status(500).json({ message: "Failed to update password" });
      }

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // User account endpoints
  app.get("/api/user/account", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const accounts = await storage.getBankAccountsByUserId(userId);
      if (accounts.length === 0) {
        return res.json(null);
      }
      
      // Return the primary account
      res.json(accounts[0]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });

  app.get("/api/user/accounts", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const accounts = await storage.getBankAccountsByUserId(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  app.get("/api/user/transactions", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const accounts = await storage.getBankAccountsByUserId(userId);
      if (accounts.length === 0) {
        return res.json([]);
      }
      
      // Fetch transactions from ALL user accounts, not just the first one
      const allTransactions: Transaction[] = [];
      for (const account of accounts) {
        const accountTransactions = await storage.getTransactionsByAccountId(account.id, 20);
        allTransactions.push(...accountTransactions);
      }
      
      // Sort all transactions by date (newest first) and limit to 20 most recent
      const sortedTransactions = allTransactions
        .sort((a, b) => {
          const dateA = a.transactionDate ? new Date(a.transactionDate).getTime() : 0;
          const dateB = b.transactionDate ? new Date(b.transactionDate).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 20);
      
      res.json(sortedTransactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.get("/api/user/account-transactions/:accountId", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const { accountId } = req.params;
      
      // Verify the account belongs to the user
      const accounts = await storage.getBankAccountsByUserId(userId);
      const accountExists = accounts.some(account => account.id === accountId);
      
      if (!accountExists) {
        return res.status(404).json({ message: "Account not found or access denied" });
      }
      
      const transactions = await storage.getTransactionsByAccountId(accountId, 50);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch account transactions" });
    }
  });

  // Seed professional transactions for a user's account
  app.post("/api/admin/seed-transactions/:accountId", requireAdmin, async (req, res) => {
    try {
      const { accountId } = req.params;
      
      // First, clear existing transactions for this account
      const existingTransactions = await storage.getTransactionsByAccountId(accountId, 1000);
      
      // Seed with professional transactions
      const seededTransactions = await storage.seedAccountWithProfessionalTransactions(accountId);
      
      res.json({ 
        success: true, 
        message: `Seeded ${seededTransactions.length} professional transactions for account ${accountId}`,
        transactionCount: seededTransactions.length
      });
    } catch (error) {
      console.error('Seed transactions error:', error);
      res.status(500).json({ message: "Failed to seed professional transactions" });
    }
  });

  // Get user's account statements (3 months)
  app.get("/api/user/statements", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }
      
      const accounts = await storage.getBankAccountsByUserId(userId);
      const statements = [];
      
      // Generate 3 months of statements
      const currentDate = new Date();
      const months = ['September 2025', 'August 2025', 'July 2025'];
      
      for (const account of accounts) {
        // Get all transactions for this account
        const allTransactions = await storage.getTransactionsByAccountId(account.id, 1000);
        
        // Sort all transactions by date for proper balance calculation
        const sortedAllTransactions = allTransactions.sort((a, b) => 
          new Date(b.transactionDate || new Date()).getTime() - new Date(a.transactionDate || new Date()).getTime()
        );
        
        // Start with current balance and work backwards
        let runningBalance = parseFloat(account.balance || '0');
        
        for (let i = 0; i < 3; i++) {
          const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
          const monthYear = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          
          // Get transactions for this specific month
          const monthTransactions = sortedAllTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.transactionDate || new Date());
            return transactionDate >= monthDate && transactionDate < nextMonthDate;
          });
          
          // Sort month transactions chronologically (oldest first)
          const sortedTransactions = monthTransactions.sort((a, b) => 
            new Date(a.transactionDate || new Date()).getTime() - new Date(b.transactionDate || new Date()).getTime()
          );
          
          // Calculate totals for this month
          let totalDebits = 0;
          let totalCredits = 0;
          
          sortedTransactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            if (transaction.type === 'debit') {
              totalDebits += amount;
            } else {
              totalCredits += amount;
            }
          });
          
          // Calculate proper balances for this month
          let closingBalance, openingBalance;
          
          if (i === 0) {
            // Current month - use actual account balance as closing
            closingBalance = runningBalance;
            openingBalance = closingBalance - totalCredits + totalDebits;
          } else {
            // Historical months - calculate from transaction history
            closingBalance = runningBalance;
            openingBalance = closingBalance - totalCredits + totalDebits;
          }
          
          // Update running balance for next iteration (going backwards in time)
          runningBalance = openingBalance;
          
          statements.push({
            id: `${account.id}-${i}`,
            accountId: account.id,
            accountType: account.accountType,
            accountNumber: account.accountNumber,
            month: monthYear,
            openingBalance: openingBalance.toFixed(2),
            closingBalance: closingBalance.toFixed(2),
            totalCredits: totalCredits.toFixed(2),
            totalDebits: totalDebits.toFixed(2),
            transactionCount: monthTransactions.length,
            transactions: sortedTransactions,
            statementDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1).toISOString(),
            routingNumber: account.routingNumber
          });
        }
      }
      
      res.json(statements);
    } catch (error) {
      console.error('Error fetching statements:', error);
      res.status(500).json({ message: "Failed to fetch statements" });
    }
  });

  // User transfer endpoint
  app.post("/api/user/transfer", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { recipient, recipientAccount, amount, description } = req.body;
      
      if (!recipient || !recipientAccount || !amount) {
        return res.status(400).json({ message: "Recipient, account, and amount are required" });
      }

      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ message: "Invalid transfer amount" });
      }

      // Get user's account
      const accounts = await storage.getBankAccountsByUserId(userId);
      if (accounts.length === 0) {
        return res.status(404).json({ message: "No account found" });
      }

      const account = accounts[0];
      const currentBalance = parseFloat(account.balance || '0');

      if (currentBalance < transferAmount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Create pending transaction instead of immediately processing
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: 'debit',
        amount: amount.toString(),
        description: `Transfer to ${recipient} (${recipientAccount}) - ${description || 'External transfer'}`,
        balanceAfter: currentBalance.toFixed(2), // Keep current balance until approved
        status: 'pending', // Set as pending for admin approval
        reference: `TXN${Date.now()}`,
        merchantName: recipient,
        merchantLocation: 'External Account',
        merchantCategory: 'transfer'
      });

      // Don't update account balance yet - wait for admin approval

      res.json({ 
        success: true, 
        transaction,
        message: `Transfer of $${amount} to ${recipient} is pending approval` 
      });
    } catch (error) {
      console.error('Transfer error:', error);
      res.status(500).json({ message: "Transfer failed" });
    }
  });

  // Admin transfer approval endpoints
  app.get("/api/admin/pending-transfers", requireAdmin, async (req, res) => {
    try {
      // Get all pending transactions
      const allTransactions = await storage.getAllTransactions();
      const pendingTransfers = allTransactions.filter(t => 
        t.status === 'pending' && t.type === 'debit' && t.description?.includes('Transfer to')
      );
      
      // Get account details for each transfer
      const transfersWithDetails = await Promise.all(
        pendingTransfers.map(async (transfer) => {
          const account = await storage.getBankAccount(transfer.accountId);
          return {
            ...transfer,
            account
          };
        })
      );
      
      res.json(transfersWithDetails);
    } catch (error) {
      console.error('Failed to fetch pending transfers:', error);
      res.status(500).json({ message: "Failed to fetch pending transfers" });
    }
  });

  app.post("/api/admin/approve-transfer/:transactionId", requireAdmin, async (req, res) => {
    try {
      const { transactionId } = req.params;
      const adminId = req.session.adminId;
      
      // Get the transaction
      const allTransactions = await storage.getAllTransactions();
      const transaction = allTransactions.find(t => t.id === transactionId);
      
      if (!transaction || transaction.status !== 'pending') {
        return res.status(404).json({ message: "Pending transaction not found" });
      }
      
      // Get the account
      const account = await storage.getBankAccount(transaction.accountId);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      const currentBalance = parseFloat(account.balance || '0');
      const transferAmount = parseFloat(transaction.amount);
      
      // Check if sufficient funds still available
      if (currentBalance < transferAmount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }
      
      const newBalance = currentBalance - transferAmount;
      
      // Update transaction status to approved and set new balance
      await storage.updateTransactionStatus(transactionId, 'completed');
      
      // Update account balance
      await storage.updateBankAccountBalance(transaction.accountId, newBalance.toFixed(2));
      
      res.json({ 
        success: true, 
        message: "Transfer approved and processed",
        newBalance: newBalance.toFixed(2)
      });
    } catch (error) {
      console.error('Approve transfer error:', error);
      res.status(500).json({ message: "Failed to approve transfer" });
    }
  });

  app.post("/api/admin/reject-transfer/:transactionId", requireAdmin, async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { reason } = req.body;
      
      // Get the transaction
      const allTransactions = await storage.getAllTransactions();
      const transaction = allTransactions.find(t => t.id === transactionId);
      
      if (!transaction || transaction.status !== 'pending') {
        return res.status(404).json({ message: "Pending transaction not found" });
      }
      
      // Update transaction status to rejected
      await storage.updateTransactionStatus(transactionId, 'rejected');
      
      // Update description to include rejection reason
      if (reason) {
        const updatedDescription = `${transaction.description} - REJECTED: ${reason}`;
        // Note: This would require a method to update transaction description
      }
      
      res.json({ 
        success: true, 
        message: "Transfer rejected"
      });
    } catch (error) {
      console.error('Reject transfer error:', error);
      res.status(500).json({ message: "Failed to reject transfer" });
    }
  });

  // User bill pay endpoint
  app.post("/api/user/billpay", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { payee, accountNumber, amount, description } = req.body;
      
      if (!payee || !amount) {
        return res.status(400).json({ message: "Payee and amount are required" });
      }

      const paymentAmount = parseFloat(amount);
      if (isNaN(paymentAmount) || paymentAmount <= 0) {
        return res.status(400).json({ message: "Invalid payment amount" });
      }

      // Get user's account
      const accounts = await storage.getBankAccountsByUserId(userId);
      if (accounts.length === 0) {
        return res.status(404).json({ message: "No account found" });
      }

      const account = accounts[0];
      const currentBalance = parseFloat(account.balance || '0');

      if (currentBalance < paymentAmount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const newBalance = currentBalance - paymentAmount;

      // Create transaction
      const transaction = await storage.createTransaction({
        accountId: account.id,
        type: 'debit',
        amount: amount.toString(),
        description: `Bill Payment - ${payee}${accountNumber ? ` (${accountNumber})` : ''} - ${description || 'Bill payment'}`,
        balanceAfter: newBalance.toFixed(2)
      });

      // Update account balance
      await storage.updateBankAccountBalance(account.id, newBalance.toFixed(2));

      res.json({ 
        success: true, 
        transaction,
        message: `Payment of $${amount} to ${payee} completed successfully` 
      });
    } catch (error) {
      console.error('Bill pay error:', error);
      res.status(500).json({ message: "Bill payment failed" });
    }
  });

  // User internal transfer endpoint
  app.post("/api/user/internal-transfer", async (req, res) => {
    try {
      const userId = req.session.userId;
      if (!userId || req.session.userType !== 'customer') {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { fromAccount, toAccount, amount, description } = req.body;
      
      if (!fromAccount || !toAccount || !amount) {
        return res.status(400).json({ message: "From account, to account, and amount are required" });
      }

      if (fromAccount === toAccount) {
        return res.status(400).json({ message: "Cannot transfer to the same account" });
      }

      const transferAmount = parseFloat(amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        return res.status(400).json({ message: "Invalid transfer amount" });
      }

      // Get user's accounts
      const accounts = await storage.getBankAccountsByUserId(userId);
      if (accounts.length === 0) {
        return res.status(404).json({ message: "No accounts found" });
      }

      // Find source and destination accounts by account type or number (case-insensitive)
      const sourceAccount = accounts.find(acc => 
        acc.accountType.toLowerCase() === fromAccount.toLowerCase() || 
        acc.accountNumber.endsWith(fromAccount.slice(-4))
      );
      
      const destinationAccount = accounts.find(acc => 
        acc.accountType.toLowerCase() === toAccount.toLowerCase() || 
        acc.accountNumber.endsWith(toAccount.slice(-4))
      );

      if (!sourceAccount) {
        return res.status(404).json({ message: `Source account '${fromAccount}' not found` });
      }

      if (!destinationAccount) {
        return res.status(404).json({ message: `Destination account '${toAccount}' not found` });
      }

      // Prevent self-transfers that could inflate balances
      if (sourceAccount.id === destinationAccount.id) {
        return res.status(400).json({ message: "Cannot transfer between the same account" });
      }

      const sourceBalance = parseFloat(sourceAccount.balance || '0');
      const destinationBalance = parseFloat(destinationAccount.balance || '0');

      if (sourceBalance < transferAmount) {
        return res.status(400).json({ message: "Insufficient funds in source account" });
      }

      const newSourceBalance = sourceBalance - transferAmount;
      const newDestinationBalance = destinationBalance + transferAmount;

      // Create debit transaction for source account
      const debitTransaction = await storage.createTransaction({
        accountId: sourceAccount.id,
        type: 'debit',
        amount: amount.toString(),
        description: `Transfer to ${destinationAccount.accountType} account - ${description || 'Internal transfer'}`,
        merchantName: 'First Citizens Bank',
        merchantCategory: 'Banking',
        reference: `TRF${Date.now().toString().slice(-8)}`,
        balanceAfter: newSourceBalance.toFixed(2),
        status: 'completed'
      });

      // Create credit transaction for destination account
      const creditTransaction = await storage.createTransaction({
        accountId: destinationAccount.id,
        type: 'credit',
        amount: amount.toString(),
        description: `Transfer from ${sourceAccount.accountType} account - ${description || 'Internal transfer'}`,
        merchantName: 'First Citizens Bank',
        merchantCategory: 'Banking',
        reference: `TRF${Date.now().toString().slice(-8)}`,
        balanceAfter: newDestinationBalance.toFixed(2),
        status: 'completed'
      });

      // Update both account balances
      await storage.updateBankAccountBalance(sourceAccount.id, newSourceBalance.toFixed(2));
      await storage.updateBankAccountBalance(destinationAccount.id, newDestinationBalance.toFixed(2));

      res.json({ 
        success: true, 
        debitTransaction,
        creditTransaction,
        sourceAccount: sourceAccount.accountType,
        destinationAccount: destinationAccount.accountType,
        message: `Transfer of $${transferAmount.toLocaleString()} from ${sourceAccount.accountType} to ${destinationAccount.accountType} completed successfully` 
      });
    } catch (error) {
      console.error('Internal transfer error:', error);
      res.status(500).json({ message: "Internal transfer failed" });
    }
  });

  // Seed admin user on first run
  app.post("/api/admin/seed", async (req, res) => {
    try {
      // Check if admin already exists
      const existing = await storage.getAdminByEmail('Alexdenson231@gmail.com');
      if (existing) {
        return res.json({ message: "Admin user already exists" });
      }
      
      // Hash password and create admin
      const hashedPassword = await bcrypt.hash('Project2025!!', 10);
      const admin = await storage.createAdmin({
        email: 'Alexdenson231@gmail.com',
        password: hashedPassword,
        firstName: 'Alex',
        lastName: 'Administrator',
        role: 'admin'
      });
      
      res.json({ message: "Admin user created successfully", admin: { email: admin.email, id: admin.id } });
    } catch (error) {
      res.status(500).json({ message: "Failed to seed admin user" });
    }
  });

  const httpServer = createServer(app);
  
  // WebSocket server for real-time notifications - temporarily disabled to fix startup conflict
  // const wss = new WebSocketServer({ server: httpServer });
  // const connectedClients = new Map<string, WebSocket>();

  // wss.on('connection', (ws, req) => {
  //   let userId: string | null = null;
  //   
  //   ws.on('message', (message) => {
  //     try {
  //       const data = JSON.parse(message.toString());
  //       if (data.type === 'authenticate' && data.userId) {
  //         userId = data.userId;
  //         connectedClients.set(userId, ws);
  //         console.log(`User ${userId} connected to WebSocket`);
  //       }
  //     } catch (error) {
  //       console.error('WebSocket message error:', error);
  //     }
  //   });

  //   ws.on('close', () => {
  //     if (userId) {
  //       connectedClients.delete(userId);
  //       console.log(`User ${userId} disconnected from WebSocket`);
  //     }
  //   });
  // });

  // Notification utility function - temporarily disabled
  // (global as any).sendNotificationToUser = (userId: string, notification: any) => {
  //   const userWs = connectedClients.get(userId);
  //   if (userWs && userWs.readyState === WebSocket.OPEN) {
  //     userWs.send(JSON.stringify(notification));
  //   }
  // };

  return httpServer;
}
