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

// Savings account transactions
export const savingsTransactions: ProfessionalTransaction[] = [
  {
    type: 'credit',
    amount: '1500.00',
    description: 'Transfer from Checking',
    merchantName: 'First Citizens Bank',
    merchantLocation: 'Raleigh, NC',
    merchantCategory: 'Transfer',
    date: '2025-09-01T15:00:00Z',
    postedDate: '2025-09-01T15:00:00Z',
    reference: 'TFR8473921'
  },
  {
    type: 'credit',
    amount: '12.50',
    description: 'Monthly Interest Payment',
    merchantName: 'First Citizens Bank',
    merchantLocation: 'Raleigh, NC',
    merchantCategory: 'Interest',
    date: '2025-09-30T23:59:00Z',
    postedDate: '2025-09-30T23:59:00Z',
    reference: 'INT9284710'
  },
  {
    type: 'credit',
    amount: '500.00',
    description: 'Direct Deposit',
    merchantName: 'Bonus Payment',
    merchantLocation: 'New York, NY',
    merchantCategory: 'Deposit',
    date: '2025-09-15T08:00:00Z',
    postedDate: '2025-09-15T08:00:00Z',
    reference: 'DD8291047'
  },
  {
    type: 'debit',
    amount: '200.00',
    description: 'ATM Withdrawal',
    merchantName: 'First Citizens Bank ATM',
    merchantLocation: 'Charlotte, NC',
    merchantCategory: 'ATM',
    date: '2025-09-10T14:30:00Z',
    postedDate: '2025-09-10T14:30:00Z',
    reference: 'ATM7392810'
  },
  {
    type: 'debit',
    amount: '300.00',
    description: 'Transfer to Checking',
    merchantName: 'First Citizens Bank',
    merchantLocation: 'Raleigh, NC',
    merchantCategory: 'Transfer',
    date: '2025-09-20T10:00:00Z',
    postedDate: '2025-09-20T10:00:00Z',
    reference: 'TFR9284701'
  }
];

// Business account transactions
export const businessTransactions: ProfessionalTransaction[] = [
  {
    type: 'credit',
    amount: '8500.00',
    description: 'Client Payment - Invoice #1024',
    merchantName: 'ABC Corporation',
    merchantLocation: 'New York, NY',
    merchantCategory: 'Business Revenue',
    date: '2025-09-15T10:00:00Z',
    postedDate: '2025-09-15T10:00:00Z',
    reference: 'ACH8291047'
  },
  {
    type: 'credit',
    amount: '12500.00',
    description: 'Client Payment - Invoice #1025',
    merchantName: 'XYZ Industries LLC',
    merchantLocation: 'Chicago, IL',
    merchantCategory: 'Business Revenue',
    date: '2025-09-20T14:30:00Z',
    postedDate: '2025-09-20T14:30:00Z',
    reference: 'ACH9384720'
  },
  {
    type: 'credit',
    amount: '6750.00',
    description: 'Client Payment - Invoice #1023',
    merchantName: 'Tech Solutions Inc',
    merchantLocation: 'San Francisco, CA',
    merchantCategory: 'Business Revenue',
    date: '2025-09-10T09:15:00Z',
    postedDate: '2025-09-10T09:15:00Z',
    reference: 'ACH7291048'
  },
  {
    type: 'debit',
    amount: '4200.00',
    description: 'Payroll Processing',
    merchantName: 'ADP Payroll Services',
    merchantLocation: 'Roseland, NJ',
    merchantCategory: 'Payroll',
    date: '2025-09-01T08:00:00Z',
    postedDate: '2025-09-01T08:00:00Z',
    reference: 'PAYROLL8392'
  },
  {
    type: 'debit',
    amount: '4200.00',
    description: 'Payroll Processing',
    merchantName: 'ADP Payroll Services',
    merchantLocation: 'Roseland, NJ',
    merchantCategory: 'Payroll',
    date: '2025-09-15T08:00:00Z',
    postedDate: '2025-09-15T08:00:00Z',
    reference: 'PAYROLL8393'
  },
  {
    type: 'debit',
    amount: '1250.00',
    description: 'Office Rent Payment',
    merchantName: 'Commercial Properties LLC',
    merchantLocation: 'Boston, MA',
    merchantCategory: 'Rent',
    date: '2025-09-01T09:00:00Z',
    postedDate: '2025-09-01T09:00:00Z',
    reference: 'RENT7392841'
  },
  {
    type: 'debit',
    amount: '875.50',
    description: 'Office Supplies',
    merchantName: 'Staples Business Advantage',
    merchantLocation: 'Framingham, MA',
    merchantCategory: 'Office Supplies',
    date: '2025-09-12T11:30:00Z',
    postedDate: '2025-09-12T11:30:00Z',
    reference: 'POS8472916'
  },
  {
    type: 'debit',
    amount: '425.00',
    description: 'Internet & Phone Service',
    merchantName: 'Verizon Business',
    merchantLocation: 'New York, NY',
    merchantCategory: 'Utilities',
    date: '2025-09-05T10:00:00Z',
    postedDate: '2025-09-05T10:00:00Z',
    reference: 'UTIL9284701'
  },
  {
    type: 'debit',
    amount: '650.00',
    description: 'Business Insurance Premium',
    merchantName: 'Hartford Business Insurance',
    merchantLocation: 'Hartford, CT',
    merchantCategory: 'Insurance',
    date: '2025-09-01T12:00:00Z',
    postedDate: '2025-09-01T12:00:00Z',
    reference: 'INS8392047'
  },
  {
    type: 'debit',
    amount: '1500.00',
    description: 'Vendor Payment - Software License',
    merchantName: 'Microsoft Business',
    merchantLocation: 'Redmond, WA',
    merchantCategory: 'Software',
    date: '2025-09-08T15:00:00Z',
    postedDate: '2025-09-08T15:00:00Z',
    reference: 'INV7291048'
  },
  {
    type: 'debit',
    amount: '350.00',
    description: 'Marketing Services',
    merchantName: 'Digital Ad Solutions',
    merchantLocation: 'Austin, TX',
    merchantCategory: 'Marketing',
    date: '2025-09-18T13:45:00Z',
    postedDate: '2025-09-18T13:45:00Z',
    reference: 'INV8392047'
  }
];

// Generate comprehensive transaction history for 3 months
export const generateComprehensiveTransactionHistory = (
  accountType: 'checking' | 'savings' | 'business' = 'checking',
  referenceDate?: Date
): ProfessionalTransaction[] => {
  const allTransactions: ProfessionalTransaction[] = [];
  
  // Select appropriate transactions based on account type
  let baseTransactions: ProfessionalTransaction[];
  if (accountType === 'savings') {
    baseTransactions = savingsTransactions;
  } else if (accountType === 'business') {
    baseTransactions = businessTransactions;
  } else {
    baseTransactions = professionalTransactions;
  }
  
  // Use provided reference date or default to today
  const baseReferenceDate = referenceDate || new Date();
  
  // Generate for current month and previous 2 months (3 months total)
  for (let i = 0; i < 3; i++) {
    const monthTransactions = baseTransactions.map((transaction, index) => {
      // Calculate the month based on reference date, going back i months
      const baseDate = new Date(baseReferenceDate.getFullYear(), baseReferenceDate.getMonth() - i, 1);
      const originalDate = new Date(transaction.date);
      
      const newDate = new Date(
        baseDate.getFullYear(), 
        baseDate.getMonth(), 
        originalDate.getDate(),
        originalDate.getHours(),
        originalDate.getMinutes(),
        originalDate.getSeconds()
      );
      const newPostedDate = new Date(newDate);
      newPostedDate.setHours(newDate.getHours() + Math.floor(Math.random() * 3));
      
      return {
        ...transaction,
        date: newDate.toISOString(),
        postedDate: newPostedDate.toISOString(),
        reference: `${(transaction.reference || 'TRX').split('-')[0]}-M${i}${index}`
      };
    });
    
    allTransactions.push(...monthTransactions);
  }
  
  return allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};