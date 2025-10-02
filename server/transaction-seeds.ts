// Professional Transaction Data Seeds
export interface ProfessionalTransaction {
  type: 'credit' | 'debit';
  amount: string;
  description: string;
  merchantName: string;
  merchantLocation: string;
  merchantCategory: string;
  date: string;
  postedDate: string;
  reference?: string;
}

// Professional Banking Transactions - Realistic and appropriate for bank statements
export const professionalTransactions: ProfessionalTransaction[] = [
  // Payroll and Income
  {
    type: 'credit',
    amount: '5250.00',
    description: 'Direct Deposit Payroll',
    merchantName: 'TechCorp Solutions LLC',
    merchantLocation: 'New York, NY',
    merchantCategory: 'Payroll',
    date: '2025-09-15T08:00:00Z',
    postedDate: '2025-09-15T08:00:00Z',
    reference: 'DD982147'
  },
  {
    type: 'credit',
    amount: '450.00',
    description: 'Freelance Payment',
    merchantName: 'Digital Marketing Group',
    merchantLocation: 'Austin, TX',
    merchantCategory: 'Professional Services',
    date: '2025-09-10T14:30:00Z',
    postedDate: '2025-09-10T14:30:00Z',
    reference: 'ACH4721893'
  },
  {
    type: 'credit',
    amount: '75.00',
    description: 'Tax Refund',
    merchantName: 'Internal Revenue Service',
    merchantLocation: 'Washington, DC',
    merchantCategory: 'Government',
    date: '2025-09-05T09:15:00Z',
    postedDate: '2025-09-05T09:15:00Z',
    reference: 'REF847291'
  },

  // Grocery and Food
  {
    type: 'debit',
    amount: '142.85',
    description: 'Grocery Purchase',
    merchantName: 'Whole Foods Market',
    merchantLocation: 'Chicago, IL',
    merchantCategory: 'Grocery',
    date: '2025-09-22T18:45:00Z',
    postedDate: '2025-09-22T18:45:00Z',
    reference: 'POS7219843'
  },
  {
    type: 'debit',
    amount: '89.50',
    description: 'Grocery Purchase',
    merchantName: 'Trader Joes',
    merchantLocation: 'Seattle, WA',
    merchantCategory: 'Grocery',
    date: '2025-09-18T16:20:00Z',
    postedDate: '2025-09-18T16:20:00Z',
    reference: 'POS6847291'
  },
  {
    type: 'debit',
    amount: '67.32',
    description: 'Grocery Purchase',
    merchantName: 'Safeway',
    merchantLocation: 'Portland, OR',
    merchantCategory: 'Grocery',
    date: '2025-09-12T19:30:00Z',
    postedDate: '2025-09-12T19:30:00Z',
    reference: 'POS5621748'
  },

  // Restaurants
  {
    type: 'debit',
    amount: '28.75',
    description: 'Restaurant Purchase',
    merchantName: 'Olive Garden',
    merchantLocation: 'Denver, CO',
    merchantCategory: 'Restaurant',
    date: '2025-09-20T20:15:00Z',
    postedDate: '2025-09-20T20:15:00Z',
    reference: 'POS8472918'
  },
  {
    type: 'debit',
    amount: '15.60',
    description: 'Coffee Purchase',
    merchantName: 'Starbucks',
    merchantLocation: 'San Francisco, CA',
    merchantCategory: 'Restaurant',
    date: '2025-09-19T07:45:00Z',
    postedDate: '2025-09-19T07:45:00Z',
    reference: 'POS7829461'
  },
  {
    type: 'debit',
    amount: '42.30',
    description: 'Restaurant Purchase',
    merchantName: 'Cheesecake Factory',
    merchantLocation: 'Miami, FL',
    merchantCategory: 'Restaurant',
    date: '2025-09-14T19:00:00Z',
    postedDate: '2025-09-14T19:00:00Z',
    reference: 'POS6392847'
  },

  // Gas Stations
  {
    type: 'debit',
    amount: '52.40',
    description: 'Fuel Purchase',
    merchantName: 'Shell',
    merchantLocation: 'Houston, TX',
    merchantCategory: 'Gas Station',
    date: '2025-09-21T16:30:00Z',
    postedDate: '2025-09-21T16:30:00Z',
    reference: 'POS9182736'
  },
  {
    type: 'debit',
    amount: '48.95',
    description: 'Fuel Purchase',
    merchantName: 'Chevron',
    merchantLocation: 'Los Angeles, CA',
    merchantCategory: 'Gas Station',
    date: '2025-09-16T12:15:00Z',
    postedDate: '2025-09-16T12:15:00Z',
    reference: 'POS8472916'
  },

  // Utilities and Services
  {
    type: 'debit',
    amount: '125.67',
    description: 'Electric Bill Payment',
    merchantName: 'Pacific Gas & Electric',
    merchantLocation: 'San Francisco, CA',
    merchantCategory: 'Utilities',
    date: '2025-09-01T09:00:00Z',
    postedDate: '2025-09-01T09:00:00Z',
    reference: 'AUTOPAY4829'
  },
  {
    type: 'debit',
    amount: '89.99',
    description: 'Internet Service',
    merchantName: 'Comcast',
    merchantLocation: 'Philadelphia, PA',
    merchantCategory: 'Utilities',
    date: '2025-09-03T10:30:00Z',
    postedDate: '2025-09-03T10:30:00Z',
    reference: 'AUTOPAY7291'
  },
  {
    type: 'debit',
    amount: '150.00',
    description: 'Car Insurance Premium',
    merchantName: 'State Farm Insurance',
    merchantLocation: 'Bloomington, IL',
    merchantCategory: 'Insurance',
    date: '2025-09-08T11:45:00Z',
    postedDate: '2025-09-08T11:45:00Z',
    reference: 'AUTOPAY8394'
  },

  // Retail Purchases
  {
    type: 'debit',
    amount: '267.85',
    description: 'Retail Purchase',
    merchantName: 'Target',
    merchantLocation: 'Minneapolis, MN',
    merchantCategory: 'Retail',
    date: '2025-09-17T15:20:00Z',
    postedDate: '2025-09-17T15:20:00Z',
    reference: 'POS7392841'
  },
  {
    type: 'debit',
    amount: '89.99',
    description: 'Online Purchase',
    merchantName: 'Amazon',
    merchantLocation: 'Seattle, WA',
    merchantCategory: 'Online Retail',
    date: '2025-09-13T13:45:00Z',
    postedDate: '2025-09-14T13:45:00Z',
    reference: 'ORD8472918'
  },
  {
    type: 'debit',
    amount: '456.78',
    description: 'Furniture Purchase',
    merchantName: 'IKEA',
    merchantLocation: 'Atlanta, GA',
    merchantCategory: 'Home & Garden',
    date: '2025-09-06T14:30:00Z',
    postedDate: '2025-09-06T14:30:00Z',
    reference: 'POS9384729'
  },

  // Health & Fitness
  {
    type: 'debit',
    amount: '49.99',
    description: 'Gym Membership',
    merchantName: 'LA Fitness',
    merchantLocation: 'Phoenix, AZ',
    merchantCategory: 'Health & Fitness',
    date: '2025-09-01T06:00:00Z',
    postedDate: '2025-09-01T06:00:00Z',
    reference: 'AUTOPAY5829'
  },
  {
    type: 'debit',
    amount: '125.00',
    description: 'Medical Co-pay',
    merchantName: 'City Medical Center',
    merchantLocation: 'Boston, MA',
    merchantCategory: 'Medical',
    date: '2025-09-11T10:15:00Z',
    postedDate: '2025-09-11T10:15:00Z',
    reference: 'PAY7382941'
  },

  // Transfers and Banking
  {
    type: 'debit',
    amount: '1500.00',
    description: 'Transfer to Savings',
    merchantName: 'First Citizens Bank',
    merchantLocation: 'Raleigh, NC',
    merchantCategory: 'Transfer',
    date: '2025-09-01T15:00:00Z',
    postedDate: '2025-09-01T15:00:00Z',
    reference: 'TFR8473921'
  },
  {
    type: 'debit',
    amount: '2500.00',
    description: 'Mortgage Payment',
    merchantName: 'Wells Fargo Home Mortgage',
    merchantLocation: 'San Francisco, CA',
    merchantCategory: 'Mortgage',
    date: '2025-09-01T08:00:00Z',
    postedDate: '2025-09-01T08:00:00Z',
    reference: 'MORT3847291'
  },

  // ATM Withdrawals
  {
    type: 'debit',
    amount: '100.00',
    description: 'ATM Withdrawal',
    merchantName: 'First Citizens Bank ATM',
    merchantLocation: 'Charlotte, NC',
    merchantCategory: 'ATM',
    date: '2025-09-09T14:45:00Z',
    postedDate: '2025-09-09T14:45:00Z',
    reference: 'ATM7392841'
  },
  {
    type: 'debit',
    amount: '60.00',
    description: 'ATM Withdrawal',
    merchantName: 'Bank of America ATM',
    merchantLocation: 'New York, NY',
    merchantCategory: 'ATM',
    date: '2025-09-04T20:30:00Z',
    postedDate: '2025-09-04T20:30:00Z',
    reference: 'ATM5829473'
  }
];

// Additional transactions for different months
export const getTransactionsForMonth = (monthOffset: number = 0): ProfessionalTransaction[] => {
  // Use TODAY as the base date, then go back monthOffset months
  const today = new Date();
  const baseDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
  
  return professionalTransactions.map((transaction, index) => {
    const originalDate = new Date(transaction.date);
    // Maintain the same day of month and time, but adjust the month/year
    const newDate = new Date(
      baseDate.getFullYear(), 
      baseDate.getMonth(), 
      originalDate.getDate(),
      originalDate.getHours(),
      originalDate.getMinutes(),
      originalDate.getSeconds()
    );
    const newPostedDate = new Date(newDate);
    newPostedDate.setHours(newDate.getHours() + Math.floor(Math.random() * 3)); // Posted 0-3 hours later
    
    return {
      ...transaction,
      date: newDate.toISOString(),
      postedDate: newPostedDate.toISOString(),
      reference: `${(transaction.reference || 'TRX').split('-')[0]}-M${monthOffset}${index}`
    };
  });
};

// Generate comprehensive transaction history for 3 months
export const generateComprehensiveTransactionHistory = (): ProfessionalTransaction[] => {
  const allTransactions: ProfessionalTransaction[] = [];
  
  // Generate for current month and previous 2 months
  for (let i = 0; i < 3; i++) {
    allTransactions.push(...getTransactionsForMonth(i));
  }
  
  return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};