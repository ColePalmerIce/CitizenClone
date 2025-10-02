import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  insertCreditLimitIncreaseRequestSchema, 
  insertDebitLimitIncreaseRequestSchema,
  insertPendingExternalTransferSchema,
  insertDomesticWireTransferSchema,
  insertInternationalWireTransferSchema
} from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  User,
  DollarSign,
  CreditCard,
  TrendingUp,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Building,
  Send,
  Receipt,
  Repeat,
  Smartphone,
  Wifi,
  Zap,
  Home,
  Car,
  Plus,
  ArrowLeftRight,
  History,
  Settings,
  PiggyBank,
  Wallet,
  Users,
  HelpCircle,
  MessageCircle,
  Shield,
  Bell,
  Camera,
  FileText,
  BarChart3,
  Lock,
  CreditCard as CardIcon,
  MapPin,
  Phone,
  UserCircle,
  Calendar,
  ChevronRight,
  Clock,
  ShoppingBag,
  Copy,
  Check,
  Mail,
  Download,
  CheckCircle
} from "lucide-react";
import { SiVisa, SiMastercard } from 'react-icons/si';

// Comprehensive list of major US banks
const US_BANKS = [
  "Bank of America",
  "Wells Fargo Bank",
  "Chase Bank (JPMorgan Chase)",
  "Citibank",
  "U.S. Bank",
  "PNC Bank",
  "Capital One",
  "TD Bank",
  "Truist Bank",
  "Goldman Sachs Bank",
  "HSBC Bank USA",
  "Morgan Stanley Bank",
  "American Express National Bank",
  "Ally Bank",
  "Citizens Bank",
  "Fifth Third Bank",
  "KeyBank",
  "Huntington National Bank",
  "Regions Bank",
  "M&T Bank",
  "BMO Harris Bank",
  "Discover Bank",
  "Navy Federal Credit Union",
  "USAA Federal Savings Bank",
  "Charles Schwab Bank",
  "First Citizens Bank",
  "Santander Bank",
  "First National Bank",
  "Barclays Bank Delaware",
  "Synchrony Bank",
  "Marcus by Goldman Sachs",
  "Silicon Valley Bank",
  "First Republic Bank",
  "New York Community Bank",
  "WebBank",
  "Axos Bank",
  "CIT Bank",
  "American Bank",
  "SunTrust Bank",
  "BB&T Bank",
  "Comerica Bank",
  "Zions Bank",
  "Other"
].sort();

// Comprehensive ISO 3166-1 country list (249 countries)
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
  "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
  "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Congo (DRC)",
  "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador",
  "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
  "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
  "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo",
  "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Macao", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania",
  "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia",
  "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
  "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia",
  "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
  "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga",
  "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
].sort();

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status?: string;
  statusReason?: string;
}

interface BankAccount {
  id: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  balance: string;
  status: string;
  openDate: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  description: string;
  merchantName?: string;
  merchantLocation?: string;
  merchantCategory?: string;
  reference?: string;
  balanceAfter: string;
  transactionDate: string;
  postedDate?: string;
}

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<UserData | null>(null);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isBillPayDialogOpen, setIsBillPayDialogOpen] = useState(false);
  const [isInternalTransferOpen, setIsInternalTransferOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isCardsDialogOpen, setIsCardsDialogOpen] = useState(false);
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [isSecurityDialogOpen, setIsSecurityDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isBranchLocatorOpen, setIsBranchLocatorOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isStatementsDialogOpen, setIsStatementsDialogOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);
  const [isSecurityQuestionsOpen, setIsSecurityQuestionsOpen] = useState(false);
  const [isSecurityAlertsOpen, setIsSecurityAlertsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDebitCardFrozen, setIsDebitCardFrozen] = useState(false);
  const [isCreditCardFrozen, setIsCreditCardFrozen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [accountNumberVisible, setAccountNumberVisible] = useState(false);
  const [copiedAccountNumber, setCopiedAccountNumber] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [accountTransferForm, setAccountTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: '',
    transferType: 'domestic' // domestic or international
  });
  const [expandedStatements, setExpandedStatements] = useState<Set<string>>(new Set());
  const [isCreditLimitIncreaseOpen, setIsCreditLimitIncreaseOpen] = useState(false);
  const [isDebitLimitIncreaseOpen, setIsDebitLimitIncreaseOpen] = useState(false);
  const [isTransferReceiptOpen, setIsTransferReceiptOpen] = useState(false);
  const [transferReceiptData, setTransferReceiptData] = useState<any>(null);

  // Create extended schemas with validation and coercion
  const creditLimitFormSchema = insertCreditLimitIncreaseRequestSchema.extend({
    currentLimit: z.coerce.number(),
    requestedLimit: z.coerce.number(),
    annualIncome: z.string().min(1, "Annual income is required"),
    employmentStatus: z.string().min(1, "Employment status is required"),
  });

  const debitLimitFormSchema = insertDebitLimitIncreaseRequestSchema.extend({
    currentATMLimit: z.coerce.number(),
    requestedATMLimit: z.coerce.number(),
    currentPurchaseLimit: z.coerce.number(),
    requestedPurchaseLimit: z.coerce.number(),
    reason: z.string().optional(),
  });

  // Credit limit form
  const creditLimitForm = useForm<z.infer<typeof creditLimitFormSchema>>({
    resolver: zodResolver(creditLimitFormSchema),
    defaultValues: {
      currentLimit: 5000,
      requestedLimit: 10000,
      annualIncome: '',
      employmentStatus: '',
      reason: ''
    }
  });

  // Debit limit form
  const debitLimitForm = useForm<z.infer<typeof debitLimitFormSchema>>({
    resolver: zodResolver(debitLimitFormSchema),
    defaultValues: {
      currentATMLimit: 500,
      requestedATMLimit: 1000,
      currentPurchaseLimit: 2500,
      requestedPurchaseLimit: 5000,
      reason: ''
    }
  });
  const { toast } = useToast();

  // Generate professional avatar for user
  const generateUserAvatar = (firstName: string, lastName: string, userId: string) => {
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    
    // Generate sophisticated gradient combinations based on user ID
    const gradients = [
      'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-lg shadow-blue-500/20',
      'bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 shadow-lg shadow-emerald-500/20',
      'bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800 shadow-lg shadow-purple-500/20',
      'bg-gradient-to-br from-rose-600 via-red-700 to-pink-800 shadow-lg shadow-rose-500/20',
      'bg-gradient-to-br from-amber-600 via-orange-700 to-red-800 shadow-lg shadow-amber-500/20',
      'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800 shadow-lg shadow-cyan-500/20',
      'bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800 shadow-lg shadow-violet-500/20',
      'bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800 shadow-lg shadow-slate-500/20'
    ];
    
    // Create sophisticated hash for consistency
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const gradientIndex = Math.abs(hash) % gradients.length;
    
    return {
      initials,
      gradientClass: gradients[gradientIndex]
    };
  };

  const toggleStatementExpansion = (statementId: string) => {
    const newExpanded = new Set(expandedStatements);
    if (newExpanded.has(statementId)) {
      newExpanded.delete(statementId);
    } else {
      newExpanded.add(statementId);
    }
    setExpandedStatements(newExpanded);
  };

  // Credit limit increase mutation
  const creditLimitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof creditLimitFormSchema>) => {
      return apiRequest('POST', '/api/user/credit-limit-increase', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Credit Limit Increase Requested",
        description: `Your request to increase credit limit has been submitted for review. You'll receive an update within 2-3 business days.`,
        duration: 5000,
      });
      setIsCreditLimitIncreaseOpen(false);
      creditLimitForm.reset();
      // Invalidate limit increase requests to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/user/limit-increase-requests'] });
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Unable to submit your credit limit increase request. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Debit limit increase mutation
  const debitLimitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof debitLimitFormSchema>) => {
      return apiRequest('POST', '/api/user/debit-limit-increase', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Debit Limit Increase Requested",
        description: `Your ATM and purchase limit increase request has been submitted. New limits will be active within 24 hours.`,
        duration: 5000,
      });
      setIsDebitLimitIncreaseOpen(false);
      debitLimitForm.reset();
      // Invalidate limit increase requests to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/user/limit-increase-requests'] });
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Unable to submit your debit limit increase request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreditLimitIncrease = (data: z.infer<typeof creditLimitFormSchema>) => {
    creditLimitMutation.mutate(data);
  };

  const handleDebitLimitIncrease = (data: z.infer<typeof debitLimitFormSchema>) => {
    debitLimitMutation.mutate(data);
  };

  const handleDebitCardFreeze = () => {
    setIsDebitCardFrozen(!isDebitCardFrozen);
    if (!isDebitCardFrozen) {
      toast({
        title: "Card Frozen",
        description: "Your debit card has been frozen for all purchases and transactions.",
        variant: "default"
      });
    } else {
      toast({
        title: "Card Unfrozen", 
        description: "Your debit card can now be used for payments and transactions.",
        variant: "default"
      });
    }
  };

  const handleCreditCardFreeze = () => {
    setIsCreditCardFrozen(!isCreditCardFrozen);
    if (!isCreditCardFrozen) {
      toast({
        title: "Card Frozen",
        description: "Your credit card has been frozen for all purchases and transactions.",
        variant: "default"
      });
    } else {
      toast({
        title: "Card Unfrozen",
        description: "Your credit card can now be used for payments and transactions.", 
        variant: "default"
      });
    }
  };

  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error", 
        description: "New password and confirmation don't match",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your password has been updated successfully. Please use your new password for future logins.",
          variant: "default"
        });
        
        // Clear form and close dialog
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsChangePasswordOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to change password",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Enhanced transfer validation schema
  const enhancedTransferSchema = z.object({
    recipient: z.string().min(1, "Recipient name is required"),
    recipientAccount: z.string().min(8, "Account number must be at least 8 digits"),
    bankName: z.string().min(1, "Bank name is required"),
    routingNumber: z.string().min(9, "Routing number must be 9 digits").max(9, "Routing number must be 9 digits"),
    accountType: z.enum(["checking", "savings", "business"], { required_error: "Account type is required" }),
    recipientPhone: z.string().min(10, "Phone number is required (minimum 10 digits)"),
    recipientAddress: z.string().min(5, "Complete address is required"),
    amount: z.coerce.number().min(0.01, "Amount must be at least $0.01"),
    description: z.string().min(1, "Description/purpose is required"),
  });

  type EnhancedTransferFormData = z.infer<typeof enhancedTransferSchema>;

  const enhancedTransferForm = useForm<EnhancedTransferFormData>({
    resolver: zodResolver(enhancedTransferSchema),
    defaultValues: {
      recipient: '',
      recipientAccount: '',
      bankName: '',
      routingNumber: '',
      accountType: 'checking',
      recipientPhone: '',
      recipientAddress: '',
      amount: 0,
      description: '',
    }
  });

  // Bill pay form state
  const [billPayForm, setBillPayForm] = useState({
    payee: '',
    accountNumber: '',
    amount: '',
    description: '',
    paymentDate: ''
  });

  // Internal transfer form state
  const [internalTransferForm, setInternalTransferForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });

  // External transfer validation schema with enhanced recipient details
  const externalTransferValidationSchema = insertPendingExternalTransferSchema.extend({
    amount: z.coerce.number().min(0.01, "Amount must be at least $0.01"),
    recipientAccountNumber: z.string().min(8, "Account number must be at least 8 digits"),
    recipientRoutingNumber: z.string().min(9, "Routing number must be 9 digits").max(9, "Routing number must be 9 digits"),
    recipientPhoneNumber: z.string().transform(val => val.trim() === '' ? undefined : val).optional().refine(val => !val || val.length >= 10, "Phone number must be at least 10 digits"),
    recipientAddress: z.object({
      street: z.string().min(1, "Street address is required"),
      city: z.string().min(1, "City is required"),
      state: z.string().min(2, "State is required"),
      zip: z.string().min(5, "ZIP code must be at least 5 digits"),
    }).optional().or(z.undefined()),
  }).omit({ userId: true });

  // External transfer form state with enhanced recipient details
  const [externalTransferForm, setExternalTransferForm] = useState({
    fromAccountId: '',
    recipientName: '',
    recipientAccountNumber: '',
    recipientRoutingNumber: '',
    recipientBankName: '',
    recipientPhoneNumber: '',
    recipientAddress: {
      street: '',
      city: '',
      state: '',
      zip: ''
    },
    amount: '',
    transferType: 'ACH',
    purpose: ''
  });

  // Wire transfer form states
  const [domesticWireForm, setDomesticWireForm] = useState({
    fromAccountId: '',
    recipientBankName: '',
    recipientBankAddress: '',
    recipientRoutingNumber: '',
    recipientAccountNumber: '',
    beneficiaryName: '',
    beneficiaryAddress: '',
    beneficiaryAccountType: 'checking',
    amount: '',
    purpose: '',
    reference: '',
    senderFee: '25.00',
    estimatedCompletionDate: ''
  });

  const [internationalWireForm, setInternationalWireForm] = useState({
    fromAccountId: '',
    recipientBankName: '',
    recipientBankAddress: '',
    recipientBankSwift: '',
    recipientRoutingNumber: '',
    recipientAccountNumber: '',
    beneficiaryName: '',
    beneficiaryAddress: '',
    beneficiaryCountry: '',
    correspondentBankName: '',
    correspondentBankSwift: '',
    amount: '',
    purpose: '',
    reference: '',
    senderFee: '45.00',
    intermediaryFee: '25.00',
    recipientFee: '15.00',
    estimatedCompletionDate: ''
  });

  // Dialog and confirmation states
  const [isExternalTransferDialogOpen, setIsExternalTransferDialogOpen] = useState(false);
  const [showTransferConfirmation, setShowTransferConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const toggleAccountNumberVisibility = () => {
    setAccountNumberVisible(!accountNumberVisible);
  };

  const copyAccountNumber = async (accountNumber: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccountNumber(true);
      toast({
        title: "Copied!",
        description: "Account number copied to clipboard",
      });
      setTimeout(() => setCopiedAccountNumber(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy account number",
        variant: "destructive",
      });
    }
  };

  // Check user session and account status
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check sessionStorage first for immediate login experience
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Always verify status with server for security
          const response = await apiRequest('GET', '/api/user/session');
          if (response.ok) {
            const serverUserData = await response.json();
            if (serverUserData.status === 'blocked') {
              sessionStorage.removeItem('user');
              toast({
                title: "Account Blocked",
                description: serverUserData.statusReason || "Your account has been temporarily suspended. Please contact customer support for assistance.",
                variant: "destructive",
              });
              setLocation('/');
              return;
            }
            setUser(serverUserData);
          } else {
            sessionStorage.removeItem('user');
            setLocation('/');
          }
          return;
        }
        
        // Fallback to server session check
        const response = await apiRequest('GET', '/api/user/session');
        if (response.ok) {
          const userData = await response.json();
          if (userData.status === 'blocked') {
            toast({
              title: "Account Blocked",
              description: userData.statusReason || "Your account has been temporarily suspended. Please contact customer support for assistance.",
              variant: "destructive",
            });
            setLocation('/');
            return;
          }
          setUser(userData);
        } else {
          setLocation('/');
        }
      } catch (error) {
        setLocation('/');
      }
    };
    checkSession();
  }, [setLocation, toast]);

  // Get user's bank account (primary)
  const { data: bankAccount, isLoading: accountLoading } = useQuery({
    queryKey: ['/api/user/account'],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time balance updates
    refetchOnWindowFocus: true,
  });

  // Get all user's accounts
  const { data: allAccounts, isLoading: allAccountsLoading } = useQuery({
    queryKey: ['/api/user/accounts'],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time account updates
    refetchOnWindowFocus: true,
  });

  // Calculate total balance from all accounts
  const totalBalance = allAccounts && (allAccounts as BankAccount[]).length > 0 
    ? (allAccounts as BankAccount[]).reduce((sum, account) => sum + Math.abs(parseFloat(account.balance)), 0)
    : 0;

  // Get user profile data
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user/profile'],
    enabled: !!user,
  });

  // Get user's transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/user/transactions'],
    enabled: !!user,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time transaction updates
    refetchOnWindowFocus: true,
  });

  // Get specific account transactions
  const { data: accountTransactions, isLoading: accountTransactionsLoading } = useQuery({
    queryKey: ['account-transactions', selectedAccount?.id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/user/account-transactions/${selectedAccount?.id}`);
      if (!response.ok) throw new Error('Failed to fetch account transactions');
      return response.json();
    },
    enabled: !!selectedAccount?.id && selectedAccount.id !== 'credit-card',
  });

  // Get user statements (3 months)
  const { data: statements, isLoading: statementsLoading } = useQuery({
    queryKey: ['/api/user/statements'],
    enabled: !!user,
  });

  // Transfer money mutation
  const transferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      const response = await apiRequest('POST', '/api/user/transfer', transferData);
      if (!response.ok) throw new Error('Transfer failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/transactions'] });
      toast({
        title: "Transfer Successful",
        description: "Your money transfer has been completed.",
      });
      setIsTransferDialogOpen(false);
      enhancedTransferForm.reset({
        recipient: '',
        recipientAccount: '',
        bankName: '',
        routingNumber: '',
        accountType: 'checking',
        recipientPhone: '',
        recipientAddress: '',
        amount: 0,
        description: '',
      });
    },
    onError: () => {
      toast({
        title: "Transfer Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  // Bill pay mutation
  const billPayMutation = useMutation({
    mutationFn: async (billData: any) => {
      const response = await apiRequest('POST', '/api/user/billpay', billData);
      if (!response.ok) throw new Error('Bill payment failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/transactions'] });
      toast({
        title: "Bill Payment Successful",
        description: "Your bill payment has been processed.",
      });
      setIsBillPayDialogOpen(false);
      setBillPayForm({ payee: '', accountNumber: '', amount: '', description: '', paymentDate: '' });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  // Internal transfer mutation
  const internalTransferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      const response = await apiRequest('POST', '/api/user/internal-transfer', transferData);
      if (!response.ok) throw new Error('Internal transfer failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/transactions'] });
      toast({
        title: "Transfer Successful",
        description: "Your internal transfer has been completed.",
      });
      setIsInternalTransferOpen(false);
      setInternalTransferForm({ fromAccount: '', toAccount: '', amount: '', description: '' });
    },
    onError: () => {
      toast({
        title: "Transfer Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });


  // External transfer mutation with proper payload types
  const externalTransferMutation = useMutation({
    mutationFn: async (transferData: any) => {
      const response = await apiRequest('POST', '/api/user/external-transfer', transferData);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'External transfer failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/pending-external-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/transactions'] });
      
      // Show transfer receipt
      setTransferReceiptData({
        ...data,
        transferType: 'ACH',
        type: 'External Transfer'
      });
      setIsTransferReceiptOpen(true);
      
      setIsExternalTransferDialogOpen(false);
      setShowTransferConfirmation(false);
      setConfirmationData(null);
      // Reset form state properly for useState
      setExternalTransferForm({
        fromAccountId: '',
        recipientName: '',
        recipientAccountNumber: '',
        recipientRoutingNumber: '',
        recipientBankName: '',
        recipientPhoneNumber: '',
        recipientAddress: {
          street: '',
          city: '',
          state: '',
          zip: ''
        },
        amount: '',
        transferType: 'ACH',
        purpose: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Request Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
      setShowTransferConfirmation(false);
    }
  });

  // Domestic wire transfer mutation
  const domesticWireMutation = useMutation({
    mutationFn: async (wireData: any) => {
      const response = await apiRequest('POST', '/api/user/domestic-wire-transfer', wireData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Domestic wire transfer failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Show transfer receipt - normalize wireTransfer to transfer for consistent modal display
      setTransferReceiptData({
        ...data,
        transfer: data.wireTransfer, // Normalize to 'transfer' property
        transferType: 'Domestic Wire',
        type: 'Domestic Wire Transfer'
      });
      setIsTransferReceiptOpen(true);
      
      // Reset form
      setDomesticWireForm({
        fromAccountId: '',
        recipientBankName: '',
        recipientBankAddress: '',
        recipientRoutingNumber: '',
        recipientAccountNumber: '',
        beneficiaryName: '',
        beneficiaryAddress: '',
        amount: '',
        purpose: '',
        reference: '',
        senderFee: '25.00',
        estimatedCompletionDate: ''
      });
      setIsTransferDialogOpen(false);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/user/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/transactions'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Wire Transfer Failed",
        description: error.message || "Failed to process wire transfer. Please try again.",
      });
    },
  });

  // International wire transfer mutation
  const internationalWireMutation = useMutation({
    mutationFn: async (wireData: any) => {
      const response = await apiRequest('POST', '/api/user/international-wire-transfer', wireData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'International wire transfer failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Show transfer receipt - normalize wireTransfer to transfer for consistent modal display
      setTransferReceiptData({
        ...data,
        transfer: data.wireTransfer, // Normalize to 'transfer' property
        transferType: 'International Wire',
        type: 'International Wire Transfer'
      });
      setIsTransferReceiptOpen(true);
      
      // Reset form
      setInternationalWireForm({
        fromAccountId: '',
        recipientBankName: '',
        recipientBankAddress: '',
        recipientBankSwift: '',
        recipientRoutingNumber: '',
        recipientAccountNumber: '',
        beneficiaryName: '',
        beneficiaryAddress: '',
        beneficiaryCountry: '',
        correspondentBankName: '',
        correspondentBankSwift: '',
        amount: '',
        purpose: '',
        reference: '',
        senderFee: '45.00',
        intermediaryFee: '25.00',
        recipientFee: '15.00',
        estimatedCompletionDate: ''
      });
      setIsTransferDialogOpen(false);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/user/account'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/accounts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/transactions'] });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "International Wire Transfer Failed",
        description: error.message || "Failed to process international wire transfer. Please try again.",
      });
    },
  });

  // Profile update removed - users cannot edit their own profiles
  // Only admins can modify customer profile information

  // Query for pending external transfers
  const { data: pendingExternalTransfers = [] } = useQuery<any[]>({
    queryKey: ['/api/user/pending-external-transfers'],
    refetchInterval: 30000, // Refetch every 30 seconds to check for status updates
  });

  const handleLogout = async () => {
    try {
      await apiRequest('POST', '/api/user/logout');
      sessionStorage.removeItem('user');
      setUser(null);
      setLocation('/');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1c92d2, #203a43, #9b59b6)'}}>
        <div className="text-center">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #1c92d2, #203a43, #9b59b6)'}}>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src="https://www.firstcitizens.com/content/dam/firstcitizens/images/logos/fcb-logo-horiz-web-2020@2x.png.transform/original/image.20230612.png"
            alt="First Citizens Bank"
            className="h-6 w-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          data-testid="button-mobile-menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 shadow-2xl transition-transform duration-300 ease-in-out lg:transition-none`} style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #2563eb 50%, #1d4ed8 75%, #1e3a8a 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center px-6 py-4 border-b border-white/10 backdrop-blur-sm">
              <img 
                src="https://www.firstcitizens.com/content/dam/firstcitizens/images/logos/fcb-logo-horiz-web-2020@2x.png.transform/original/image.20230612.png"
                alt="First Citizens Bank"
                className="h-8 w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div className="ml-3" style={{ display: 'none' }}>
                <h1 className="text-lg font-bold text-white tracking-tight">Customer Portal</h1>
                <p className="text-xs text-blue-200/90 font-medium">First Citizens Bank</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="px-6 py-6 border-b border-white/10 backdrop-blur-sm relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div className="relative">
              <div className="flex items-center space-x-3 mb-4">
                {user && (() => {
                  const avatar = generateUserAvatar(user.firstName, user.lastName, user.id);
                  return (
                    <div className={`w-14 h-14 ${avatar.gradientClass} rounded-full flex items-center justify-center border-2 border-white/20`}>
                      <span className="text-white font-bold text-xl tracking-wide">{avatar.initials}</span>
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-blue-200 text-sm">{user.username}</p>
                </div>
              </div>
              <p className="text-blue-100 text-sm">
                {getTimeGreeting()}, {user.firstName}!
              </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 px-4 py-4 space-y-2">
              <div className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-3">
                Account Services
              </div>
              
              <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogTrigger asChild data-testid="trigger-profile-dialog">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                    data-testid="button-profile"
                  >
                    <UserCircle className="w-4 h-4 mr-3" />
                    My Profile
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>My Profile</DialogTitle>
                    <DialogDescription>
                      Your personal account information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <p className="text-sm text-gray-600">Username: {user?.username}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Date of Birth</span>
                        <span className="text-sm">
                          {userProfile?.profile?.dateOfBirth 
                            ? new Date(userProfile.profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Phone Number</span>
                        <span className="text-sm">{userProfile?.profile?.phoneNumber || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Address</span>
                        <span className="text-sm">
                          {userProfile?.profile?.address 
                            ? `${userProfile.profile.address.street}, ${userProfile.profile.address.city}, ${userProfile.profile.address.state} ${userProfile.profile.address.zip}` 
                            : 'Not provided'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Customer Since</span>
                        <span className="text-sm">
                          {userProfile?.user?.createdAt 
                            ? new Date(userProfile.user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
                            : 'Not available'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> To update your profile information, please contact customer support or visit a branch location.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isCardsDialogOpen} onOpenChange={setIsCardsDialogOpen}>
                <DialogTrigger asChild data-testid="trigger-cards-dialog">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                    data-testid="button-cards"
                  >
                    <CardIcon className="w-4 h-4 mr-3" />
                    My Cards
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>My Cards</DialogTitle>
                    <DialogDescription>
                      Manage your credit and debit cards
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Debit Card */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-blue-200 uppercase tracking-wide">Debit Card</p>
                          <p className="font-semibold text-lg">First Citizens Debit</p>
                        </div>
                        <div className="text-right">
                          <SiVisa className="w-12 h-8 text-white mb-2" />
                          <p className="text-xs text-blue-200">Balance</p>
                          <p className="font-semibold text-lg">
                            {allAccounts && balanceVisible 
                              ? `$${totalBalance.toLocaleString()}`
                              : "••••••"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="font-mono text-xl tracking-wider mb-4 mt-6">
                        {bankAccount 
                          ? `**** **** **** ${(bankAccount as BankAccount).accountNumber.slice(-4)}`
                          : "**** **** **** ----"
                        }
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-xs text-blue-200 uppercase tracking-wide">Valid Thru</div>
                          <div className="font-mono text-sm font-medium">12/28</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-blue-200 uppercase tracking-wide">CVV</div>
                          <div className="font-mono text-sm font-medium">***</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium uppercase tracking-wide">{user?.firstName} {user?.lastName}</span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className={`text-white border-0 ${
                              isDebitCardFrozen 
                                ? "bg-red-600 hover:bg-red-500" 
                                : "bg-blue-700 hover:bg-blue-600"
                            }`}
                            onClick={handleDebitCardFreeze}
                            data-testid="button-toggle-debit-freeze"
                          >
                            <Lock className="w-4 h-4 mr-1" />
                            {isDebitCardFrozen ? "Unfreeze" : "Freeze"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="text-white bg-green-600 hover:bg-green-500 border-0"
                            onClick={() => setIsDebitLimitIncreaseOpen(true)}
                            data-testid="button-increase-debit-limits"
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Increase Limits
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div className="p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl text-white shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-300 uppercase tracking-wide">Credit Card</p>
                          <p className="font-semibold text-lg">FCB Rewards Card</p>
                        </div>
                        <div className="text-right">
                          <SiMastercard className="w-12 h-8 text-white mb-2" />
                          <p className="text-xs text-gray-300">Available Credit</p>
                          <p className="font-semibold text-lg text-green-400">$4,750</p>
                        </div>
                      </div>
                      <div className="font-mono text-xl tracking-wider mb-4 mt-6">
                        **** **** **** 8492
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="text-xs text-gray-300 uppercase tracking-wide">Valid Thru</div>
                          <div className="font-mono text-sm font-medium">03/27</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-300 uppercase tracking-wide">CVV</div>
                          <div className="font-mono text-sm font-medium">***</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium uppercase tracking-wide">{user?.firstName} {user?.lastName}</span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className={`text-white border-0 ${
                              isCreditCardFrozen 
                                ? "bg-red-600 hover:bg-red-500" 
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                            onClick={handleCreditCardFreeze}
                            data-testid="button-toggle-credit-freeze"
                          >
                            <Lock className="w-4 h-4 mr-1" />
                            {isCreditCardFrozen ? "Unfreeze" : "Freeze"}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="text-white bg-green-600 hover:bg-green-500 border-0"
                            onClick={() => setIsCreditLimitIncreaseOpen(true)}
                            data-testid="button-increase-credit-limit"
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Increase Limit
                          </Button>
                        </div>
                      </div>
                      
                      {/* Credit Card Details */}
                      <div className="pt-4 border-t border-gray-600 space-y-3">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Credit Limit</div>
                            <div className="font-semibold text-sm">$5,000</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Current Balance</div>
                            <div className="font-semibold text-sm text-red-400">$250</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Available</div>
                            <div className="font-semibold text-sm text-green-400">$4,750</div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs pt-2 border-t border-gray-700">
                          <div>
                            <span className="text-gray-400">Payment Due:</span>
                            <span className="ml-1 font-medium">Dec 15, 2025</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Min Payment:</span>
                            <span className="ml-1 font-semibold text-yellow-400">$25.00</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="w-full" data-testid="button-add-card">
                      Add New Card
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Credit Card Limit Increase Dialog */}
              <Dialog open={isCreditLimitIncreaseOpen} onOpenChange={setIsCreditLimitIncreaseOpen}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Credit Limit Increase Request</DialogTitle>
                    <DialogDescription>
                      Request an increase to your credit limit. Current limit: $5,000
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...creditLimitForm}>
                    <form onSubmit={creditLimitForm.handleSubmit(handleCreditLimitIncrease)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel>Current Limit</FormLabel>
                          <FormControl>
                            <Input 
                              value="$5,000" 
                              disabled 
                              className="bg-gray-100 text-gray-600"
                              data-testid="input-current-credit-limit"
                            />
                          </FormControl>
                        </FormItem>
                        <FormField
                          control={creditLimitForm.control}
                          name="requestedLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requested Limit</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(parseInt(value))} 
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-requested-credit-limit">
                                    <SelectValue placeholder="Select limit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="7500">$7,500</SelectItem>
                                  <SelectItem value="10000">$10,000</SelectItem>
                                  <SelectItem value="15000">$15,000</SelectItem>
                                  <SelectItem value="20000">$20,000</SelectItem>
                                  <SelectItem value="25000">$25,000</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={creditLimitForm.control}
                        name="annualIncome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Annual Income</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $75,000"
                                {...field}
                                data-testid="input-annual-income"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={creditLimitForm.control}
                        name="employmentStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employment Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-employment-status">
                                  <SelectValue placeholder="Select employment status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="full-time">Full-time employed</SelectItem>
                                <SelectItem value="part-time">Part-time employed</SelectItem>
                                <SelectItem value="self-employed">Self-employed</SelectItem>
                                <SelectItem value="retired">Retired</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="unemployed">Unemployed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={creditLimitForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for Increase</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Optional: Explain why you need a credit limit increase"
                                className="h-20 resize-none"
                                {...field}
                                value={field.value || ''}
                                data-testid="textarea-credit-reason"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Processing time:</strong> 2-3 business days<br/>
                          <strong>Review criteria:</strong> Income, credit history, account standing
                        </p>
                      </div>
                      
                      <DialogFooter className="space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsCreditLimitIncreaseOpen(false)}
                          data-testid="button-cancel-credit-increase"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={creditLimitMutation.isPending}
                          data-testid="button-submit-credit-increase"
                        >
                          {creditLimitMutation.isPending ? "Submitting..." : "Submit Request"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              {/* Debit Card Limit Increase Dialog */}
              <Dialog open={isDebitLimitIncreaseOpen} onOpenChange={setIsDebitLimitIncreaseOpen}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Debit Card Limit Increase</DialogTitle>
                    <DialogDescription>
                      Increase your daily ATM withdrawal and purchase limits
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...debitLimitForm}>
                    <form onSubmit={debitLimitForm.handleSubmit(handleDebitLimitIncrease)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel>Current ATM Daily Limit</FormLabel>
                          <FormControl>
                            <Input 
                              value="$500" 
                              disabled 
                              className="bg-gray-100 text-gray-600"
                              data-testid="input-current-atm-limit"
                            />
                          </FormControl>
                        </FormItem>
                        <FormField
                          control={debitLimitForm.control}
                          name="requestedATMLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New ATM Daily Limit</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(parseInt(value))} 
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-requested-atm-limit">
                                    <SelectValue placeholder="Select ATM limit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="750">$750</SelectItem>
                                  <SelectItem value="1000">$1,000</SelectItem>
                                  <SelectItem value="1500">$1,500</SelectItem>
                                  <SelectItem value="2000">$2,000</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel>Current Purchase Daily Limit</FormLabel>
                          <FormControl>
                            <Input 
                              value="$2,500" 
                              disabled 
                              className="bg-gray-100 text-gray-600"
                              data-testid="input-current-purchase-limit"
                            />
                          </FormControl>
                        </FormItem>
                        <FormField
                          control={debitLimitForm.control}
                          name="requestedPurchaseLimit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Purchase Daily Limit</FormLabel>
                              <Select 
                                onValueChange={(value) => field.onChange(parseInt(value))} 
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger data-testid="select-requested-purchase-limit">
                                    <SelectValue placeholder="Select purchase limit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="3000">$3,000</SelectItem>
                                  <SelectItem value="5000">$5,000</SelectItem>
                                  <SelectItem value="7500">$7,500</SelectItem>
                                  <SelectItem value="10000">$10,000</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={debitLimitForm.control}
                        name="reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reason for Increase</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Optional: Explain why you need higher limits"
                                className="h-20 resize-none"
                                {...field}
                                data-testid="textarea-debit-reason"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Processing time:</strong> Immediate (up to 24 hours)<br/>
                          <strong>Security:</strong> New limits activated after verification
                        </p>
                      </div>
                      
                      <DialogFooter className="space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDebitLimitIncreaseOpen(false)}
                          data-testid="button-cancel-debit-increase"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={debitLimitMutation.isPending}
                          data-testid="button-submit-debit-increase"
                        >
                          {debitLimitMutation.isPending ? "Submitting..." : "Update Limits"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                onClick={() => setIsStatementsDialogOpen(true)}
                data-testid="button-statements"
              >
                <FileText className="w-4 h-4 mr-3" />
                Statements
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>

              <Dialog open={isSecurityDialogOpen} onOpenChange={setIsSecurityDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                    data-testid="button-security"
                  >
                    <Shield className="w-4 h-4 mr-3" />
                    Security
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Security Settings</DialogTitle>
                    <DialogDescription>
                      Manage your account security and privacy settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsChangePasswordOpen(true)}
                      >
                        <Lock className="w-4 h-4 mr-3" />
                        Change Password
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsTwoFactorOpen(true)}
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Two-Factor Authentication
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsSecurityQuestionsOpen(true)}
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Security Questions
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setIsSecurityAlertsOpen(true)}
                      >
                        <Bell className="w-4 h-4 mr-3" />
                        Security Alerts
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </Button>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Security Tip</h4>
                      <p className="text-sm text-red-700">
                        Never share your login credentials or personal information via email or phone calls.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <div className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-3 mt-6">
                Support & Help
              </div>

              <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                    data-testid="button-support"
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    Support Center
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Support Center</DialogTitle>
                    <DialogDescription>
                      Get help with your banking needs
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <Phone className="w-6 h-6 text-blue-600" />
                        <span className="text-xs">Call Support</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-20 flex-col space-y-2"
                        onClick={() => setShowEmailDropdown(!showEmailDropdown)}
                      >
                        <Mail className="w-6 h-6 text-green-600" />
                        <span className="text-xs">Email Support</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <HelpCircle className="w-6 h-6 text-purple-600" />
                        <span className="text-xs">FAQ</span>
                      </Button>
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <Shield className="w-6 h-6 text-red-600" />
                        <span className="text-xs">Report Fraud</span>
                      </Button>
                    </div>

                    {showEmailDropdown && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">Email Support</h4>
                        <p className="text-sm text-green-700 mb-3">
                          You can reach our support team via email and one of our customer representatives will attend to you promptly.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="font-mono text-sm text-green-900">support@fiirstcitizens.com</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText('support@fiirstcitizens.com');
                                toast({ title: "Email copied to clipboard!" });
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-white rounded border">
                            <span className="font-mono text-sm text-green-900">help@fiirstcitizens.com</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => {
                                navigator.clipboard.writeText('help@fiirstcitizens.com');
                                toast({ title: "Email copied to clipboard!" });
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">24/7 Support</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Need immediate assistance? Our support team is available 24/7.
                      </p>
                      <p className="font-mono text-sm text-blue-900">1-800-CITIZENS</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                    data-testid="button-contact"
                  >
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Contact Us
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Contact Us</DialogTitle>
                    <DialogDescription>
                      Get in touch with First Citizens Bank
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center p-3 border rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium">Phone Support</p>
                          <p className="text-sm text-gray-600">1-800-CITIZENS</p>
                          <p className="text-xs text-gray-500">24/7 Available</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg">
                        <Mail className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">Email Support</p>
                          <p className="text-sm text-gray-600">support@fiirstcitizens.com</p>
                          <p className="text-xs text-gray-500">Response within 24 hours</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-600 mr-3" />
                        <div>
                          <p className="font-medium">Visit Us</p>
                          <p className="text-sm text-gray-600">Find a branch near you</p>
                          <p className="text-xs text-gray-500">Use our branch locator</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Business Hours</h4>
                      <p className="text-sm text-blue-700">
                        Monday - Friday: 8:00 AM - 6:00 PM<br/>
                        Saturday: 9:00 AM - 2:00 PM<br/>
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isBranchLocatorOpen} onOpenChange={setIsBranchLocatorOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                    data-testid="button-locations"
                  >
                    <MapPin className="w-4 h-4 mr-3" />
                    Branch Locator
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Branch Locator</DialogTitle>
                    <DialogDescription>
                      Find First Citizens Bank branches and ATMs near you
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Raleigh Downtown</h4>
                            <p className="text-sm text-blue-700">239 Fayetteville Street</p>
                            <p className="text-sm text-blue-700">Raleigh, NC 27601</p>
                            <p className="text-xs text-blue-600 mt-1">Open: Mon-Fri 9AM-5PM • (919) 716-7050</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Charlotte Main</h4>
                            <p className="text-sm text-gray-600">128 S Tryon Street</p>
                            <p className="text-sm text-gray-600">Charlotte, NC 28202</p>
                            <p className="text-xs text-gray-500 mt-1">Open: Mon-Fri 9AM-5PM • Full Service Branch</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Raleigh Stonehenge</h4>
                            <p className="text-sm text-gray-600">7208 Creedmoor Road</p>
                            <p className="text-sm text-gray-600">Raleigh, NC 27613</p>
                            <p className="text-xs text-gray-500 mt-1">Open: Mon-Fri 9AM-5PM • (919) 716-7577</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium">ATM Network</h4>
                            <p className="text-sm text-gray-600">500+ ATM locations nationwide</p>
                            <p className="text-xs text-gray-500 mt-1">24/7 Access • Surcharge-free</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Need more locations?</strong> Visit locations.firstcitizens.com or call 1-888-FC-DIRECT (888-323-4732) for our complete branch locator with maps and driving directions.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                    data-testid="button-notifications"
                  >
                    <Bell className="w-4 h-4 mr-3" />
                    Notifications
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                    <DialogDescription>
                      Manage your account notifications and alerts
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Account Balance Alert</p>
                          <p className="text-xs text-gray-500">Your account balance has exceeded $50,000</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Transfer Complete</p>
                          <p className="text-xs text-gray-500">$1,500 transfer to John Smith completed</p>
                          <p className="text-xs text-gray-400">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-gray-300 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Security Update</p>
                          <p className="text-xs text-gray-500">Password was successfully updated</p>
                          <p className="text-xs text-gray-400">3 days ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Notification Preferences</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Email Alerts</span>
                          <div className="w-8 h-4 bg-blue-500 rounded-full relative">
                            <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full shadow"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">SMS Alerts</span>
                          <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                            <div className="absolute left-0 top-0 w-4 h-4 bg-white rounded-full shadow"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-blue-500">
              <Button 
                onClick={handleLogout}
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-blue-500"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">
                {getTimeGreeting()}, {user?.firstName}!
              </h1>
              <p className="text-blue-100">
                Manage your finances with ease
              </p>
            </div>

            {/* Balance Card */}
            <Card className="mb-6 bg-white/95 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-600">Available Balance</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleBalanceVisibility}
                        className="h-6 w-6 p-0"
                        data-testid="button-toggle-balance"
                      >
                        {balanceVisible ? (
                          <Eye className="w-4 h-4 text-gray-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    {allAccountsLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                    ) : allAccounts && (allAccounts as BankAccount[]).length > 0 ? (
                      <h2 className="text-3xl font-bold text-gray-900">
                        {balanceVisible 
                          ? `$${Math.abs(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : "••••••"
                        }
                      </h2>
                    ) : (
                      <h2 className="text-3xl font-bold text-gray-400">{balanceVisible ? "$0.00" : "••••••"}</h2>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500">Account</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleAccountNumberVisibility}
                        className="h-4 w-4 p-0"
                        data-testid="button-toggle-account"
                      >
                        {accountNumberVisible ? (
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        ) : (
                          <Eye className="w-3 h-3 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {bankAccount ? (
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">
                          {accountNumberVisible 
                            ? (bankAccount as BankAccount).accountNumber
                            : `****${(bankAccount as BankAccount).accountNumber.slice(-4)}`
                          }
                        </p>
                        {accountNumberVisible && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyAccountNumber((bankAccount as BankAccount).accountNumber)}
                            className="h-4 w-4 p-0"
                            data-testid="button-copy-account"
                          >
                            {copiedAccountNumber ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-gray-400" />
                            )}
                          </Button>
                        )}
                      </div>
                    ) : (
                      <p className="font-mono text-sm">****----</p>
                    )}
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-16 flex-col space-y-1 bg-blue-50 hover:bg-blue-100 border-blue-200"
                        data-testid="button-transfer"
                      >
                        <Send className="w-5 h-5 text-blue-600" />
                        <span className="text-xs text-blue-700">Transfer</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Transfer Money</DialogTitle>
                        <DialogDescription>
                          Choose your transfer method and send money
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="external" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="external">External Transfer</TabsTrigger>
                          <TabsTrigger value="domestic-wire">Domestic Wire</TabsTrigger>
                          <TabsTrigger value="international-wire">International Wire</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="external" className="space-y-4 mt-4">
                          <Form {...enhancedTransferForm}>
                            <form onSubmit={enhancedTransferForm.handleSubmit((data) => {
                              transferMutation.mutate({
                                ...data,
                                transferType: 'external'
                              });
                            })} className="space-y-6">
                          
                          {/* Banking Information Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Banking Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={enhancedTransferForm.control}
                                name="bankName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Bank Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="e.g., Chase Bank, Bank of America"
                                        data-testid="input-bank-name"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={enhancedTransferForm.control}
                                name="routingNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Routing Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="9-digit routing number"
                                        maxLength={9}
                                        data-testid="input-routing-number"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={enhancedTransferForm.control}
                                name="recipientAccount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Account Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Recipient's account number"
                                        data-testid="input-recipient-account"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={enhancedTransferForm.control}
                                name="accountType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Account Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger data-testid="select-account-type">
                                          <SelectValue placeholder="Select account type" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="checking">Checking</SelectItem>
                                        <SelectItem value="savings">Savings</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Recipient Information Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recipient Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={enhancedTransferForm.control}
                                name="recipient"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Full Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="Recipient's full legal name"
                                        data-testid="input-recipient"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={enhancedTransferForm.control}
                                name="recipientPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Phone Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="(555) 123-4567"
                                        data-testid="input-recipient-phone"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={enhancedTransferForm.control}
                              name="recipientAddress"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Complete Address</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Street address, City, State, ZIP"
                                      data-testid="input-recipient-address"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Transfer Details Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transfer Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={enhancedTransferForm.control}
                                name="amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Amount ($)</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        placeholder="0.00"
                                        data-testid="input-transfer-amount"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={enhancedTransferForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Purpose</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="e.g., Rent payment, Gift, Loan repayment"
                                        data-testid="input-transfer-description"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <DialogFooter>
                            <Button 
                              type="submit"
                              disabled={!enhancedTransferForm.formState.isValid || transferMutation.isPending}
                              className="w-full"
                              data-testid="button-confirm-transfer"
                            >
                              {transferMutation.isPending ? 'Processing...' : `Transfer $${enhancedTransferForm.watch('amount') || '0'}`}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </TabsContent>
                    
                    <TabsContent value="domestic-wire" className="space-y-4 mt-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Domestic Wire Transfer</h4>
                        <p className="text-blue-700 text-sm">Same-day processing within the United States. Fee: $25.00</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="wireFromAccount">From Account</Label>
                          <Select 
                            value={domesticWireForm.fromAccountId} 
                            onValueChange={(value) => setDomesticWireForm({...domesticWireForm, fromAccountId: value})}
                          >
                            <SelectTrigger data-testid="select-wire-from-account">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                            <SelectContent>
                              {allAccounts && Array.isArray(allAccounts) && 
                                (allAccounts as BankAccount[]).map((account: BankAccount) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.accountType} (****{account.accountNumber.slice(-4)}) ${Math.abs(parseFloat(account.balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </SelectItem>
                                )) as React.ReactNode[]
                              }
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="wireAmount">Amount ($)</Label>
                          <Input
                            id="wireAmount"
                            type="number"
                            step="0.01"
                            className="text-lg"
                            value={domesticWireForm.amount}
                            onChange={(e) => setDomesticWireForm({...domesticWireForm, amount: e.target.value})}
                            placeholder="0.00"
                            data-testid="input-wire-amount"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recipientBank">Recipient Bank Name</Label>
                          <Select
                            value={domesticWireForm.recipientBankName}
                            onValueChange={(value) => setDomesticWireForm({...domesticWireForm, recipientBankName: value})}
                          >
                            <SelectTrigger data-testid="select-recipient-bank">
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {US_BANKS.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="recipientBankAddress">Recipient Bank Address</Label>
                          <Input
                            id="recipientBankAddress"
                            value={domesticWireForm.recipientBankAddress}
                            onChange={(e) => setDomesticWireForm({...domesticWireForm, recipientBankAddress: e.target.value})}
                            placeholder="Bank address"
                            data-testid="input-recipient-bank-address"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            value={domesticWireForm.recipientRoutingNumber}
                            onChange={(e) => setDomesticWireForm({...domesticWireForm, recipientRoutingNumber: e.target.value})}
                            placeholder="9-digit routing number"
                            data-testid="input-routing-number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Recipient Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={domesticWireForm.recipientAccountNumber}
                            onChange={(e) => setDomesticWireForm({...domesticWireForm, recipientAccountNumber: e.target.value})}
                            placeholder="Account number"
                            data-testid="input-account-number"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                          <Input
                            id="beneficiaryName"
                            value={domesticWireForm.beneficiaryName}
                            onChange={(e) => setDomesticWireForm({...domesticWireForm, beneficiaryName: e.target.value})}
                            placeholder="Full name"
                            data-testid="input-beneficiary-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="beneficiaryAddress">Beneficiary Address</Label>
                          <Input
                            id="beneficiaryAddress"
                            value={domesticWireForm.beneficiaryAddress}
                            onChange={(e) => setDomesticWireForm({...domesticWireForm, beneficiaryAddress: e.target.value})}
                            placeholder="Full address"
                            data-testid="input-beneficiary-address"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="beneficiaryAccountType">Account Type</Label>
                          <Select
                            value={domesticWireForm.beneficiaryAccountType}
                            onValueChange={(value) => setDomesticWireForm({...domesticWireForm, beneficiaryAccountType: value})}
                          >
                            <SelectTrigger data-testid="select-beneficiary-account-type">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="purpose">Wire Purpose</Label>
                          <Input
                            id="purpose"
                            value={domesticWireForm.purpose}
                            onChange={(e) => setDomesticWireForm({...domesticWireForm, purpose: e.target.value})}
                            placeholder="e.g., Business payment, Real estate"
                            data-testid="input-purpose"
                          />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-amber-50 rounded-lg text-sm border border-amber-200">
                        <div className="flex justify-between text-amber-800">
                          <span>Transfer Amount:</span>
                          <span className="font-medium">${domesticWireForm.amount || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-amber-800">
                          <span>Wire Fee:</span>
                          <span className="font-medium">$25.00</span>
                        </div>
                        <div className="flex justify-between text-amber-900 font-semibold pt-1 border-t border-amber-300 mt-1">
                          <span>Total:</span>
                          <span>${(parseFloat(domesticWireForm.amount || '0') + 25).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          const { senderFee, estimatedCompletionDate, ...wireData } = domesticWireForm;
                          domesticWireMutation.mutate(wireData);
                        }}
                        disabled={!domesticWireForm.fromAccountId || !domesticWireForm.amount || !domesticWireForm.recipientBankName || 
                                 !domesticWireForm.recipientBankAddress || !domesticWireForm.recipientRoutingNumber || 
                                 !domesticWireForm.recipientAccountNumber || !domesticWireForm.beneficiaryName || 
                                 !domesticWireForm.beneficiaryAddress || !domesticWireForm.beneficiaryAccountType || 
                                 !domesticWireForm.purpose || domesticWireMutation.isPending}
                        data-testid="button-send-domestic-wire"
                      >
                        {domesticWireMutation.isPending ? 'Processing...' : `Send Domestic Wire - $${domesticWireForm.amount || '0.00'}`}
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="international-wire" className="space-y-4 mt-4">
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                        <h4 className="font-semibold text-amber-800 mb-2">International Wire Transfer</h4>
                        <p className="text-amber-700 text-sm">Global transfers via SWIFT network. Processing: 1-5 business days. Fees: $45 sender + $25 intermediary</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="intlFromAccount">From Account</Label>
                          <Select 
                            value={internationalWireForm.fromAccountId} 
                            onValueChange={(value) => setInternationalWireForm({...internationalWireForm, fromAccountId: value})}
                          >
                            <SelectTrigger data-testid="select-intl-wire-from-account">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                            <SelectContent>
                              {allAccounts && Array.isArray(allAccounts) && 
                                (allAccounts as BankAccount[]).map((account: BankAccount) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.accountType} (****{account.accountNumber.slice(-4)}) ${Math.abs(parseFloat(account.balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </SelectItem>
                                )) as React.ReactNode[]
                              }
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="intlAmount">Amount ($)</Label>
                          <Input
                            id="intlAmount"
                            type="number"
                            step="0.01"
                            className="text-lg"
                            value={internationalWireForm.amount}
                            onChange={(e) => setInternationalWireForm({...internationalWireForm, amount: e.target.value})}
                            placeholder="0.00"
                            data-testid="input-intl-amount"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="intlBankName">Recipient Bank Name</Label>
                          <Select
                            value={internationalWireForm.recipientBankName}
                            onValueChange={(value) => setInternationalWireForm({...internationalWireForm, recipientBankName: value})}
                          >
                            <SelectTrigger data-testid="select-intl-bank-name">
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                              {US_BANKS.map((bank) => (
                                <SelectItem key={bank} value={bank}>
                                  {bank}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="intlBankAddress">Recipient Bank Address</Label>
                          <Input
                            id="intlBankAddress"
                            value={internationalWireForm.recipientBankAddress}
                            onChange={(e) => setInternationalWireForm({...internationalWireForm, recipientBankAddress: e.target.value})}
                            placeholder="Bank address"
                            data-testid="input-intl-bank-address"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="swiftCode">SWIFT Code</Label>
                          <Input
                            id="swiftCode"
                            value={internationalWireForm.recipientBankSwift}
                            onChange={(e) => setInternationalWireForm({...internationalWireForm, recipientBankSwift: e.target.value})}
                            placeholder="e.g., CHASUS33"
                            data-testid="input-swift-code"
                          />
                        </div>
                        <div>
                          <Label htmlFor="intlAccountNumber">Account Number</Label>
                          <Input
                            id="intlAccountNumber"
                            value={internationalWireForm.recipientAccountNumber}
                            onChange={(e) => setInternationalWireForm({...internationalWireForm, recipientAccountNumber: e.target.value})}
                            placeholder="IBAN or account number"
                            data-testid="input-intl-account-number"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="intlBeneficiary">Beneficiary Name</Label>
                          <Input
                            id="intlBeneficiary"
                            value={internationalWireForm.beneficiaryName}
                            onChange={(e) => setInternationalWireForm({...internationalWireForm, beneficiaryName: e.target.value})}
                            placeholder="Recipient's full name"
                            data-testid="input-intl-beneficiary"
                          />
                        </div>
                        <div>
                          <Label htmlFor="beneficiaryAddress">Beneficiary Address</Label>
                          <Input
                            id="beneficiaryAddress"
                            value={internationalWireForm.beneficiaryAddress}
                            onChange={(e) => setInternationalWireForm({...internationalWireForm, beneficiaryAddress: e.target.value})}
                            placeholder="Complete address"
                            data-testid="input-intl-beneficiary-address"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="beneficiaryCountry">Beneficiary Country</Label>
                          <Select
                            value={internationalWireForm.beneficiaryCountry}
                            onValueChange={(value) => setInternationalWireForm({...internationalWireForm, beneficiaryCountry: value})}
                          >
                            <SelectTrigger data-testid="select-beneficiary-country">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="intlPurpose">Wire Purpose</Label>
                          <Input
                            id="intlPurpose"
                            value={internationalWireForm.purpose}
                            onChange={(e) => setInternationalWireForm({...internationalWireForm, purpose: e.target.value})}
                            placeholder="Transfer purpose"
                            data-testid="input-intl-purpose"
                          />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-red-50 rounded-lg text-sm border border-red-200">
                        <div className="flex justify-between text-red-800">
                          <span>Transfer Amount:</span>
                          <span className="font-medium">${internationalWireForm.amount || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-red-800">
                          <span>Sender Fee:</span>
                          <span className="font-medium">$45.00</span>
                        </div>
                        <div className="flex justify-between text-red-800">
                          <span>Intermediary Fee:</span>
                          <span className="font-medium">$25.00</span>
                        </div>
                        <div className="flex justify-between text-red-900 font-semibold pt-1 border-t border-red-300 mt-1">
                          <span>Total:</span>
                          <span>${(parseFloat(internationalWireForm.amount || '0') + 70).toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => internationalWireMutation.mutate(internationalWireForm)}
                        disabled={!internationalWireForm.fromAccountId || !internationalWireForm.amount || !internationalWireForm.recipientBankName || 
                                 !internationalWireForm.recipientBankAddress || !internationalWireForm.recipientBankSwift || 
                                 !internationalWireForm.recipientAccountNumber || !internationalWireForm.beneficiaryName || 
                                 !internationalWireForm.beneficiaryAddress || !internationalWireForm.beneficiaryCountry || 
                                 !internationalWireForm.purpose || internationalWireMutation.isPending}
                        data-testid="button-send-international-wire"
                      >
                        {internationalWireMutation.isPending ? 'Processing...' : `Send International Wire - $${internationalWireForm.amount || '0.00'}`}
                      </Button>
                    </TabsContent>
                  </Tabs>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isBillPayDialogOpen} onOpenChange={setIsBillPayDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-16 flex-col space-y-1 bg-green-50 hover:bg-green-100 border-green-200"
                        data-testid="button-bill-pay"
                      >
                        <Receipt className="w-5 h-5 text-green-600" />
                        <span className="text-xs text-green-700">Bill Pay</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Pay Bills</DialogTitle>
                        <DialogDescription>
                          Pay your bills quickly and securely
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="payee">Payee</Label>
                          <Select value={billPayForm.payee} onValueChange={(value) => setBillPayForm({...billPayForm, payee: value})}>
                            <SelectTrigger data-testid="select-payee">
                              <SelectValue placeholder="Select payee" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="electric">Electric Company</SelectItem>
                              <SelectItem value="gas">Gas Company</SelectItem>
                              <SelectItem value="water">Water Utility</SelectItem>
                              <SelectItem value="internet">Internet Provider</SelectItem>
                              <SelectItem value="phone">Phone Company</SelectItem>
                              <SelectItem value="credit-card">Credit Card</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="billAmount">Amount ($)</Label>
                          <Input
                            id="billAmount"
                            type="number"
                            value={billPayForm.amount}
                            onChange={(e) => setBillPayForm({...billPayForm, amount: e.target.value})}
                            placeholder="0.00"
                            data-testid="input-bill-amount"
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input
                            id="accountNumber"
                            value={billPayForm.accountNumber}
                            onChange={(e) => setBillPayForm({...billPayForm, accountNumber: e.target.value})}
                            placeholder="Your account number with payee"
                            data-testid="input-bill-account"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={() => billPayMutation.mutate(billPayForm)}
                          disabled={!billPayForm.payee || !billPayForm.amount || billPayMutation.isPending}
                          className="w-full"
                          data-testid="button-confirm-bill-pay"
                        >
                          {billPayMutation.isPending ? 'Processing...' : `Pay $${billPayForm.amount || '0'}`}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isInternalTransferOpen} onOpenChange={setIsInternalTransferOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-16 flex-col space-y-1 bg-purple-50 hover:bg-purple-100 border-purple-200"
                        data-testid="button-internal-transfer"
                      >
                        <ArrowLeftRight className="w-5 h-5 text-purple-600" />
                        <span className="text-xs text-purple-700">Between Accounts</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Transfer Between Accounts</DialogTitle>
                        <DialogDescription>
                          Move money between your First Citizens Bank accounts
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="fromAccount">From Account</Label>
                          <Select value={internalTransferForm.fromAccount} onValueChange={(value) => setInternalTransferForm({...internalTransferForm, fromAccount: value})}>
                            <SelectTrigger data-testid="select-from-account">
                              <SelectValue placeholder="Select source account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking (****{bankAccount ? (bankAccount as BankAccount).accountNumber.slice(-4) : '0000'})</SelectItem>
                              <SelectItem value="savings">Savings (****2468)</SelectItem>
                              <SelectItem value="business">Business (****3579)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="toAccount">To Account</Label>
                          <Select value={internalTransferForm.toAccount} onValueChange={(value) => setInternalTransferForm({...internalTransferForm, toAccount: value})}>
                            <SelectTrigger data-testid="select-to-account">
                              <SelectValue placeholder="Select destination account" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking (****{bankAccount ? (bankAccount as BankAccount).accountNumber.slice(-4) : '0000'})</SelectItem>
                              <SelectItem value="savings">Savings (****2468)</SelectItem>
                              <SelectItem value="business">Business (****3579)</SelectItem>
                              <SelectItem value="credit-card">FCB Rewards Credit Card (****8492)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="internalAmount">Amount ($)</Label>
                          <Input
                            id="internalAmount"
                            type="number"
                            value={internalTransferForm.amount}
                            onChange={(e) => setInternalTransferForm({...internalTransferForm, amount: e.target.value})}
                            placeholder="0.00"
                            data-testid="input-internal-amount"
                          />
                        </div>
                        <div>
                          <Label htmlFor="internalDescription">Description (Optional)</Label>
                          <Input
                            id="internalDescription"
                            value={internalTransferForm.description}
                            onChange={(e) => setInternalTransferForm({...internalTransferForm, description: e.target.value})}
                            placeholder="Transfer note"
                            data-testid="input-internal-description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={() => internalTransferMutation.mutate(internalTransferForm)}
                          disabled={!internalTransferForm.fromAccount || !internalTransferForm.toAccount || !internalTransferForm.amount || internalTransferForm.fromAccount === internalTransferForm.toAccount || internalTransferMutation.isPending}
                          className="w-full"
                          data-testid="button-confirm-internal-transfer"
                        >
                          {internalTransferMutation.isPending ? 'Processing...' : `Transfer $${internalTransferForm.amount || '0'}`}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="h-16 flex-col space-y-1 bg-orange-50 hover:bg-orange-100 border-orange-200"
                        data-testid="button-mobile-deposit"
                      >
                        <Camera className="w-5 h-5 text-orange-600" />
                        <span className="text-xs text-orange-700">Mobile Deposit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Mobile Check Deposit</DialogTitle>
                        <DialogDescription>
                          Deposit checks instantly using your mobile device
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="font-medium text-gray-900 mb-2">Ready to Deposit?</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Take photos of the front and back of your check
                          </p>
                          <div className="space-y-2 text-xs text-gray-500">
                            <p>• Ensure check is properly endorsed</p>
                            <p>• Good lighting and clear images</p>
                            <p>• Amount limit: $5,000 per day</p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="w-full" data-testid="button-start-deposit">
                          Start Deposit
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* All Accounts */}
            <Card className="mb-6 bg-white/95 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  My Accounts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allAccountsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                      </div>
                    ))}
                  </div>
                ) : allAccounts && (allAccounts as BankAccount[]).length > 0 ? (
                  <div className="space-y-4">
                    {(allAccounts as BankAccount[]).map((account) => (
                      <div 
                        key={account.id} 
                        className="p-4 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedAccount(account)}
                        data-testid={`account-card-${account.accountType.toLowerCase()}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {account.accountType}
                            </h3>
                            <p className="text-sm text-gray-600 font-mono">
                              Account ****{account.accountNumber.slice(-4)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              ${Math.abs(parseFloat(account.balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                              {account.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Routing Number</p>
                            <p className="font-mono">{account.routingNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Opened</p>
                            <p>{new Date(account.openDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end mt-3 text-blue-600 group-hover:text-blue-700">
                          <span className="text-sm font-medium">View Details</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    ))}
                    {/* Credit Card Information */}
                    <div 
                      className="p-4 border rounded-lg hover:bg-blue-50 transition-colors bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer group"
                      onClick={() => setSelectedAccount({
                        id: 'credit-card',
                        accountType: 'Credit Card',
                        accountNumber: '****8492',
                        routingNumber: '053100300',
                        balance: '-250.00',
                        status: 'active',
                        openDate: new Date().toISOString(),
                        userId: user?.id || ''
                      } as any)}
                      data-testid="account-card-credit"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                            FCB Rewards Credit Card
                          </h3>
                          <p className="text-sm text-gray-600 font-mono">
                            Card ****8492
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            $4,750 Available
                          </p>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Credit Limit</p>
                          <p className="font-semibold">$5,000</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                          <p className="font-semibold text-red-600">$250</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end mt-3 text-blue-600 group-hover:text-blue-700">
                        <span className="text-sm font-medium">View Details</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No account information available</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-white/95 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <History className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : transactions && (transactions as Transaction[]).length > 0 ? (
                  <div className="space-y-3">
                    {(transactions as Transaction[]).slice(0, 5).map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction)}
                        data-testid={`transaction-item-${transaction.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? 
                              <ArrowUpRight className="w-5 h-5" /> : 
                              <ArrowDownRight className="w-5 h-5" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{transaction.description}</p>
                            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
                              <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="font-mono truncate">{(() => {
                                // Generate truly random reference number
                                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                const randomRef = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                                const year = new Date(transaction.transactionDate).getFullYear();
                                return `FCB${year}-${randomRef}`;
                              })()}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`font-bold text-left sm:text-right ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div>${Math.abs(parseFloat(transaction.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="text-xs text-gray-500 font-normal">
                            ${Math.abs(parseFloat(transaction.balanceAfter)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">No transactions yet</p>
                    <p className="text-sm text-gray-400">Your account activity will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Security Dialogs */}
      
      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your account password for enhanced security
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                type="password" 
                id="current-password" 
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                type="password" 
                id="new-password" 
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                type="password" 
                id="confirm-password" 
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Password Requirements:</strong> Must be at least 8 characters with uppercase, lowercase, numbers, and special characters.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsChangePasswordOpen(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Two-Factor Authentication Dialog */}
      <Dialog open={isTwoFactorOpen} onOpenChange={setIsTwoFactorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Secure your account with two-factor authentication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">SMS Authentication</h4>
                <p className="text-sm text-gray-600">Receive codes via text message</p>
              </div>
              <div className="w-10 h-5 bg-green-500 rounded-full relative">
                <div className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Authenticator App</h4>
                <p className="text-sm text-gray-600">Use Google Authenticator or similar</p>
              </div>
              <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                <div className="absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Currently Active</h4>
              <p className="text-sm text-green-700">
                SMS authentication is enabled for phone number ending in **67
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTwoFactorOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({ title: "Two-factor settings updated!" });
              setIsTwoFactorOpen(false);
            }}>
              Update Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Questions Dialog */}
      <Dialog open={isSecurityQuestionsOpen} onOpenChange={setIsSecurityQuestionsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Security Questions</DialogTitle>
            <DialogDescription>
              Manage your security questions for account recovery
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question 1: What was your first pet's name?</Label>
              <Input placeholder="Your answer (already set)" disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Question 2: What city were you born in?</Label>
              <Input placeholder="Your answer (already set)" disabled className="bg-gray-50" />
            </div>
            <div>
              <Label>Question 3: What was your mother's maiden name?</Label>
              <Input placeholder="Your answer (already set)" disabled className="bg-gray-50" />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Security Questions Status</h4>
              <p className="text-sm text-blue-700">
                All 3 security questions have been set up. Contact support at 1-888-FC-DIRECT to update them.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSecurityQuestionsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Alerts Dialog */}
      <Dialog open={isSecurityAlertsOpen} onOpenChange={setIsSecurityAlertsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Security Alerts</DialogTitle>
            <DialogDescription>
              Configure security alerts for suspicious activity
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Login Alerts</h4>
                  <p className="text-sm text-gray-600">Notify when account is accessed</p>
                </div>
                <div className="w-10 h-5 bg-green-500 rounded-full relative">
                  <div className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Transaction Alerts</h4>
                  <p className="text-sm text-gray-600">Notify for large transactions</p>
                </div>
                <div className="w-10 h-5 bg-green-500 rounded-full relative">
                  <div className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full shadow"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">Profile Changes</h4>
                  <p className="text-sm text-gray-600">Notify when profile is modified</p>
                </div>
                <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                  <div className="absolute left-0 top-0 w-5 h-5 bg-white rounded-full shadow"></div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Alert Methods</h4>
              <p className="text-sm text-green-700 mb-2">
                ✓ Email: cole.palmer@email.com<br/>
                ✓ SMS: ***-***-*567
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSecurityAlertsOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({ title: "Security alert settings updated!" });
              setIsSecurityAlertsOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Detail Dialog */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Wallet className="w-5 h-5 mr-2 text-blue-600" />
              {selectedAccount?.accountType} Details
            </DialogTitle>
            <DialogDescription>
              Complete account information and transaction history
            </DialogDescription>
          </DialogHeader>
          
          {selectedAccount && (
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Account Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Type:</span>
                        <span className="font-medium">{selectedAccount.accountType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-mono">{selectedAccount.id === 'credit-card' ? '****8492' : `****${selectedAccount.accountNumber.slice(-4)}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Routing Number:</span>
                        <span className="font-mono">{selectedAccount.routingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={selectedAccount.status === 'active' ? 'default' : 'secondary'}>
                          {selectedAccount.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Balance Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {selectedAccount.id === 'credit-card' ? 'Available Credit:' : 'Current Balance:'}
                        </span>
                        <span className="font-bold text-2xl text-green-600">
                          {selectedAccount.id === 'credit-card' 
                            ? '$4,750' 
                            : `$${Math.abs(parseFloat(selectedAccount.balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          }
                        </span>
                      </div>
                      {selectedAccount.id === 'credit-card' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Credit Limit:</span>
                            <span className="font-medium">$5,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Current Balance:</span>
                            <span className="font-medium text-red-600">$250</span>
                          </div>
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Opened:</span>
                        <span className="font-medium">{new Date(selectedAccount.openDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Options */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                  <ArrowLeftRight className="w-5 h-5 mr-2 text-blue-600" />
                  Transfer Options
                </h3>
                
                <Tabs defaultValue="domestic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="domestic">Domestic Transfer</TabsTrigger>
                    <TabsTrigger value="domestic-wire">Domestic Wire</TabsTrigger>
                    <TabsTrigger value="international-wire">International Wire</TabsTrigger>
                    <TabsTrigger value="external">External Transfer</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="domestic" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="toAccount">To Account</Label>
                        <Select 
                          value={accountTransferForm.toAccount} 
                          onValueChange={(value) => setAccountTransferForm({...accountTransferForm, toAccount: value})}
                        >
                          <SelectTrigger data-testid="select-transfer-to-account">
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {allAccounts && Array.isArray(allAccounts) && 
                              (allAccounts as BankAccount[])
                                .filter(acc => acc.id !== selectedAccount.id)
                                .map((account: BankAccount) => (
                                  <SelectItem key={account.id} value={account.id}>
                                    {account.accountType} (****{account.accountNumber.slice(-4)})
                                  </SelectItem>
                                )) as React.ReactNode[]
                            }
                            <SelectItem value="external">External Bank Account</SelectItem>
                            <SelectItem value="credit-card">FCB Credit Card (****8492)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="transferAmount">Amount ($)</Label>
                        <Input
                          id="transferAmount"
                          type="number"
                          value={accountTransferForm.amount}
                          onChange={(e) => setAccountTransferForm({...accountTransferForm, amount: e.target.value})}
                          placeholder="0.00"
                          data-testid="input-transfer-amount"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="transferDescription">Description (Optional)</Label>
                      <Input
                        id="transferDescription"
                        value={accountTransferForm.description}
                        onChange={(e) => setAccountTransferForm({...accountTransferForm, description: e.target.value})}
                        placeholder="Transfer purpose"
                        data-testid="input-transfer-description"
                      />
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-sm">
                      <p className="text-blue-800">
                        <strong>Routing:</strong> Domestic transfers use ACH routing ({selectedAccount.routingNumber})
                      </p>
                      <p className="text-blue-600 mt-1">Processing time: 1-3 business days</p>
                    </div>
                    <Button 
                      className="w-full" 
                      data-testid="button-domestic-transfer"
                      disabled={!accountTransferForm.toAccount || !accountTransferForm.amount}
                    >
                      Transfer ${accountTransferForm.amount || '0'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="domestic-wire" className="space-y-4 mt-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Domestic Wire Transfer</h4>
                      <p className="text-blue-700 text-sm">Same-day processing within the United States. Fee: $25.00</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="domesticFromAccount">From Account</Label>
                        <Select 
                          value={domesticWireForm.fromAccountId} 
                          onValueChange={(value) => setDomesticWireForm({...domesticWireForm, fromAccountId: value})}
                        >
                          <SelectTrigger data-testid="select-domestic-wire-from-account">
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                          <SelectContent>
                            {allAccounts && Array.isArray(allAccounts) && 
                              (allAccounts as BankAccount[]).map((account: BankAccount) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.accountType} (****{account.accountNumber.slice(-4)}) ${Math.abs(parseFloat(account.balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </SelectItem>
                              )) as React.ReactNode[]
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="domesticAmount">Amount ($)</Label>
                        <Input
                          id="domesticAmount"
                          type="number"
                          step="0.01"
                          className="text-lg"
                          value={domesticWireForm.amount}
                          onChange={(e) => setDomesticWireForm({...domesticWireForm, amount: e.target.value})}
                          placeholder="0.00"
                          data-testid="input-domestic-wire-amount"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="domesticRecipientBank">Recipient Bank Name</Label>
                        <Input
                          id="domesticRecipientBank"
                          value={domesticWireForm.recipientBankName}
                          onChange={(e) => setDomesticWireForm({...domesticWireForm, recipientBankName: e.target.value})}
                          placeholder="e.g., Wells Fargo Bank"
                          data-testid="input-domestic-recipient-bank"
                        />
                      </div>
                      <div>
                        <Label htmlFor="domesticRoutingNumber">Routing Number</Label>
                        <Input
                          id="domesticRoutingNumber"
                          value={domesticWireForm.recipientRoutingNumber}
                          onChange={(e) => setDomesticWireForm({...domesticWireForm, recipientRoutingNumber: e.target.value})}
                          placeholder="9-digit routing number"
                          data-testid="input-domestic-routing-number"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="domesticAccountNumber">Recipient Account Number</Label>
                        <Input
                          id="domesticAccountNumber"
                          value={domesticWireForm.recipientAccountNumber}
                          onChange={(e) => setDomesticWireForm({...domesticWireForm, recipientAccountNumber: e.target.value})}
                          placeholder="Account number"
                          data-testid="input-domestic-account-number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="domesticBeneficiaryName">Beneficiary Name</Label>
                        <Input
                          id="domesticBeneficiaryName"
                          value={domesticWireForm.beneficiaryName}
                          onChange={(e) => setDomesticWireForm({...domesticWireForm, beneficiaryName: e.target.value})}
                          placeholder="Recipient's full name"
                          data-testid="input-domestic-beneficiary-name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="domesticPurpose">Wire Purpose</Label>
                      <Input
                        id="domesticPurpose"
                        value={domesticWireForm.purpose}
                        onChange={(e) => setDomesticWireForm({...domesticWireForm, purpose: e.target.value})}
                        placeholder="e.g., Real estate purchase, business payment"
                        data-testid="input-domestic-purpose"
                      />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      data-testid="button-domestic-wire-transfer"
                      disabled={!domesticWireForm.fromAccountId || !domesticWireForm.amount || !domesticWireForm.recipientBankName || 
                               !domesticWireForm.recipientRoutingNumber || !domesticWireForm.recipientAccountNumber || 
                               !domesticWireForm.beneficiaryName || domesticWireMutation.isPending}
                      onClick={() => {
                        domesticWireMutation.mutate(domesticWireForm);
                      }}
                    >
                      {domesticWireMutation.isPending ? 'Processing...' : `Send Domestic Wire - $${domesticWireForm.amount || '0'}`}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="international-wire" className="space-y-4 mt-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                      <h4 className="font-semibold text-amber-800 mb-2">International Wire Transfer</h4>
                      <p className="text-amber-700 text-sm">Global transfers via SWIFT network. Processing: 1-5 business days. Fees: $45 + intermediary fees</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="intlFromAccount">From Account</Label>
                        <Select 
                          value={internationalWireForm.fromAccountId} 
                          onValueChange={(value) => setInternationalWireForm({...internationalWireForm, fromAccountId: value})}
                        >
                          <SelectTrigger data-testid="select-intl-wire-from-account">
                            <SelectValue placeholder="Select source account" />
                          </SelectTrigger>
                          <SelectContent>
                            {allAccounts && Array.isArray(allAccounts) && 
                              (allAccounts as BankAccount[]).map((account: BankAccount) => (
                                <SelectItem key={account.id} value={account.id}>
                                  {account.accountType} (****{account.accountNumber.slice(-4)}) ${Math.abs(parseFloat(account.balance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </SelectItem>
                              )) as React.ReactNode[]
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="intlAmount">Amount ($)</Label>
                        <Input
                          id="intlAmount"
                          type="number"
                          step="0.01"
                          className="text-lg"
                          value={internationalWireForm.amount}
                          onChange={(e) => setInternationalWireForm({...internationalWireForm, amount: e.target.value})}
                          placeholder="0.00"
                          data-testid="input-intl-wire-amount"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="intlRecipientBank">Recipient Bank Name</Label>
                        <Input
                          id="intlRecipientBank"
                          value={internationalWireForm.recipientBankName}
                          onChange={(e) => setInternationalWireForm({...internationalWireForm, recipientBankName: e.target.value})}
                          placeholder="Bank name"
                          data-testid="input-intl-recipient-bank"
                        />
                      </div>
                      <div>
                        <Label htmlFor="intlSwiftCode">SWIFT/BIC Code</Label>
                        <Input
                          id="intlSwiftCode"
                          value={internationalWireForm.recipientBankSwift}
                          onChange={(e) => setInternationalWireForm({...internationalWireForm, recipientBankSwift: e.target.value})}
                          placeholder="e.g., CHASUS33"
                          data-testid="input-intl-swift-code"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="intlAccountNumber">Recipient Account Number</Label>
                        <Input
                          id="intlAccountNumber"
                          value={internationalWireForm.recipientAccountNumber}
                          onChange={(e) => setInternationalWireForm({...internationalWireForm, recipientAccountNumber: e.target.value})}
                          placeholder="International account number"
                          data-testid="input-intl-account-number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="intlBeneficiaryName">Beneficiary Name</Label>
                        <Input
                          id="intlBeneficiaryName"
                          value={internationalWireForm.beneficiaryName}
                          onChange={(e) => setInternationalWireForm({...internationalWireForm, beneficiaryName: e.target.value})}
                          placeholder="Recipient's full name"
                          data-testid="input-intl-beneficiary-name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="intlBeneficiaryAddress">Beneficiary Address</Label>
                        <Input
                          id="intlBeneficiaryAddress"
                          value={internationalWireForm.beneficiaryAddress}
                          onChange={(e) => setInternationalWireForm({...internationalWireForm, beneficiaryAddress: e.target.value})}
                          placeholder="Full address"
                          data-testid="input-intl-beneficiary-address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="intlBeneficiaryCountry">Beneficiary Country</Label>
                        <Select
                          value={internationalWireForm.beneficiaryCountry}
                          onValueChange={(value) => setInternationalWireForm({...internationalWireForm, beneficiaryCountry: value})}
                        >
                          <SelectTrigger data-testid="select-intl-beneficiary-country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="intlPurpose">Wire Purpose</Label>
                      <Input
                        id="intlPurpose"
                        value={internationalWireForm.purpose}
                        onChange={(e) => setInternationalWireForm({...internationalWireForm, purpose: e.target.value})}
                        placeholder="e.g., Family support, business payment, property purchase"
                        data-testid="input-intl-purpose"
                      />
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <h5 className="font-semibold text-gray-800 mb-2">Fee Breakdown:</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Sender Fee:</span>
                          <span>$45.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Intermediary Fee (est.):</span>
                          <span>$25.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recipient Fee (est.):</span>
                          <span>$15.00</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1">
                          <span>Total Estimated Fees:</span>
                          <span>$85.00</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      data-testid="button-international-wire-transfer"
                      disabled={!internationalWireForm.fromAccountId || !internationalWireForm.amount || !internationalWireForm.recipientBankName || 
                               !internationalWireForm.recipientBankSwift || !internationalWireForm.recipientAccountNumber || 
                               !internationalWireForm.beneficiaryName || !internationalWireForm.beneficiaryCountry || 
                               internationalWireMutation.isPending}
                      onClick={() => {
                        const { senderFee, estimatedCompletionDate, recipientRoutingNumber, ...wireData } = internationalWireForm;
                        internationalWireMutation.mutate(wireData);
                      }}
                    >
                      {internationalWireMutation.isPending ? 'Processing...' : `Send International Wire - $${internationalWireForm.amount || '0'}`}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="external" className="space-y-6 mt-4">
                    {/* Administrative Approval Notice */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
                        <div>
                          <h4 className="font-medium text-amber-800">Administrative Approval Required</h4>
                          <p className="text-sm text-amber-700 mt-1">External transfers require admin approval and may take 1-3 business days to process.</p>
                        </div>
                      </div>
                    </div>

                    {/* From Account Section */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Transfer From</h3>
                      <div>
                        <Label htmlFor="fromAccountExternal" className="text-gray-700 font-medium">Select Account</Label>
                        <Select value={externalTransferForm.fromAccountId} onValueChange={(value) => 
                          setExternalTransferForm({...externalTransferForm, fromAccountId: value})
                        }>
                          <SelectTrigger className="mt-2 h-12" data-testid="select-from-account-external">
                            <SelectValue placeholder="Choose account to transfer from" />
                          </SelectTrigger>
                          <SelectContent>
                            {(allAccounts as BankAccount[])?.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                <div className="flex justify-between items-center w-full">
                                  <div>
                                    <div className="font-medium">{account.accountType}</div>
                                    <div className="text-sm text-gray-500">****{account.accountNumber.slice(-4)}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-semibold text-green-600">
                                      ${Math.abs(parseFloat(account.balance || '0')).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="text-xs text-gray-500">Available</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Transfer Amount */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900">Transfer Amount</h3>
                      <div>
                        <Label htmlFor="externalAmount" className="text-gray-700 font-medium">Amount ($)</Label>
                        <Input
                          id="externalAmount"
                          type="number"
                          step="0.01"
                          className="mt-2 h-12 text-lg"
                          value={externalTransferForm.amount}
                          onChange={(e) => setExternalTransferForm({...externalTransferForm, amount: e.target.value})}
                          placeholder="0.00"
                          data-testid="input-external-amount"
                        />
                      </div>
                    </div>

                    {/* Recipient Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recipient Information</h3>
                      
                      {/* Recipient Name & Phone */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recipientName" className="text-gray-700 font-medium">Full Name</Label>
                          <Input
                            id="recipientName"
                            className="mt-2"
                            value={externalTransferForm.recipientName}
                            onChange={(e) => setExternalTransferForm({...externalTransferForm, recipientName: e.target.value})}
                            placeholder="Enter recipient's full name"
                            data-testid="input-recipient-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="recipientPhone" className="text-gray-700 font-medium">Phone Number</Label>
                          <Input
                            id="recipientPhone"
                            className="mt-2"
                            value={externalTransferForm.recipientPhoneNumber}
                            onChange={(e) => setExternalTransferForm({...externalTransferForm, recipientPhoneNumber: e.target.value})}
                            placeholder="(555) 123-4567"
                            data-testid="input-recipient-phone"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <Label className="text-gray-700 font-medium">Address</Label>
                        <div className="mt-2 space-y-3">
                          <Input
                            placeholder="Street Address"
                            value={externalTransferForm.recipientAddress.street}
                            onChange={(e) => setExternalTransferForm({
                              ...externalTransferForm, 
                              recipientAddress: {...externalTransferForm.recipientAddress, street: e.target.value}
                            })}
                            data-testid="input-recipient-street"
                          />
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <Input
                              placeholder="City"
                              value={externalTransferForm.recipientAddress.city}
                              onChange={(e) => setExternalTransferForm({
                                ...externalTransferForm, 
                                recipientAddress: {...externalTransferForm.recipientAddress, city: e.target.value}
                              })}
                              data-testid="input-recipient-city"
                            />
                            <Input
                              placeholder="State"
                              value={externalTransferForm.recipientAddress.state}
                              onChange={(e) => setExternalTransferForm({
                                ...externalTransferForm, 
                                recipientAddress: {...externalTransferForm.recipientAddress, state: e.target.value}
                              })}
                              data-testid="input-recipient-state"
                            />
                            <Input
                              placeholder="ZIP Code"
                              value={externalTransferForm.recipientAddress.zip}
                              onChange={(e) => setExternalTransferForm({
                                ...externalTransferForm, 
                                recipientAddress: {...externalTransferForm.recipientAddress, zip: e.target.value}
                              })}
                              data-testid="input-recipient-zip"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Banking Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Banking Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recipientBank" className="text-gray-700 font-medium">Bank Name</Label>
                          <Input
                            id="recipientBank"
                            className="mt-2"
                            value={externalTransferForm.recipientBankName}
                            onChange={(e) => setExternalTransferForm({...externalTransferForm, recipientBankName: e.target.value})}
                            placeholder="e.g., Chase Bank, Wells Fargo"
                            data-testid="input-recipient-bank"
                          />
                        </div>
                        <div>
                          <Label htmlFor="routingNumber" className="text-gray-700 font-medium">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            className="mt-2"
                            value={externalTransferForm.recipientRoutingNumber}
                            onChange={(e) => setExternalTransferForm({...externalTransferForm, recipientRoutingNumber: e.target.value})}
                            placeholder="9-digit routing number"
                            data-testid="input-routing-number"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="accountNumber" className="text-gray-700 font-medium">Account Number</Label>
                        <Input
                          id="accountNumber"
                          className="mt-2"
                          value={externalTransferForm.recipientAccountNumber}
                          onChange={(e) => setExternalTransferForm({...externalTransferForm, recipientAccountNumber: e.target.value})}
                          placeholder="Recipient's account number"
                          data-testid="input-account-number"
                        />
                      </div>
                    </div>

                    {/* Transfer Options */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Transfer Options</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="transferType" className="text-gray-700 font-medium">Transfer Type</Label>
                          <Select value={externalTransferForm.transferType} onValueChange={(value) => 
                            setExternalTransferForm({...externalTransferForm, transferType: value})
                          }>
                            <SelectTrigger className="mt-2" data-testid="select-transfer-type">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACH">ACH Transfer (1-3 business days)</SelectItem>
                              <SelectItem value="Wire">Wire Transfer (Same day - $25 fee)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="purpose" className="text-gray-700 font-medium">Reason for Transfer</Label>
                          <Input
                            id="purpose"
                            className="mt-2"
                            value={externalTransferForm.purpose}
                            onChange={(e) => setExternalTransferForm({...externalTransferForm, purpose: e.target.value})}
                            placeholder="e.g., Gift, Payment, Family support"
                            data-testid="input-purpose"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700" 
                        disabled={!externalTransferForm.fromAccountId || !externalTransferForm.amount || 
                                 !externalTransferForm.recipientName || !externalTransferForm.recipientAccountNumber || 
                                 !externalTransferForm.recipientRoutingNumber || !externalTransferForm.recipientBankName ||
                                 externalTransferMutation.isPending}
                        onClick={() => {
                          // Proper validation using Zod schema as requested by architect
                          try {
                            const validatedData = externalTransferValidationSchema.parse({
                              ...externalTransferForm,
                              amount: parseFloat(externalTransferForm.amount) || 0 // Number coercion for API contract
                            });
                            // Show confirmation dialog with validated data
                            setConfirmationData(validatedData);
                            setShowTransferConfirmation(true);
                          } catch (error: any) {
                            // Proper error handling for validation failures
                            const errorMessage = error.errors?.[0]?.message || "Please check your form data";
                            toast({
                              title: "Validation Error",
                              description: errorMessage,
                              variant: "destructive",
                            });
                          }
                        }}
                        data-testid="button-submit-external-transfer"
                      >
                        {externalTransferMutation.isPending ? 'Submitting Transfer...' : 'Review & Submit Transfer'}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* External Transfer Confirmation Dialog */}
              {showTransferConfirmation && confirmationData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Confirm External Transfer
                    </h3>
                    
                    {/* Compliance Warning */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <h4 className="font-medium text-yellow-800 flex items-center">
                        ⚠️ Important Banking Disclosure
                      </h4>
                      <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                        <li>• External transfers require administrative approval</li>
                        <li>• {confirmationData.transferType === 'ACH' ? 'ACH transfers take 1-3 business days' : 'Wire transfers are processed same day with $25 fee'}</li>
                        <li>• This transfer may be irreversible once approved</li>
                        <li>• Ensure recipient details are accurate</li>
                      </ul>
                    </div>

                    {/* Transfer Details Review */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">From Account:</span>
                        <span className="font-medium">
                          {(allAccounts as BankAccount[])?.find(acc => acc.id === confirmationData.fromAccountId)?.accountType} 
                          ****{(allAccounts as BankAccount[])?.find(acc => acc.id === confirmationData.fromAccountId)?.accountNumber?.slice(-4)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-lg">${confirmationData.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recipient:</span>
                        <span className="font-medium">{confirmationData.recipientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium">{confirmationData.recipientBankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account:</span>
                        <span className="font-medium">****{confirmationData.recipientAccountNumber?.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transfer Type:</span>
                        <span className="font-medium">{confirmationData.transferType}</span>
                      </div>
                      {confirmationData.purpose && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Purpose:</span>
                          <span className="font-medium">{confirmationData.purpose}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setShowTransferConfirmation(false);
                          setConfirmationData(null);
                        }}
                        data-testid="button-cancel-transfer"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={externalTransferMutation.isPending}
                        onClick={() => {
                          externalTransferMutation.mutate({
                            ...confirmationData,
                            userId: user?.id
                          });
                        }}
                        data-testid="button-confirm-transfer"
                      >
                        {externalTransferMutation.isPending ? 'Submitting...' : 'Confirm Transfer'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending External Transfers */}
              {pendingExternalTransfers.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Pending External Transfers
                  </h3>
                  <div className="space-y-3">
                    {pendingExternalTransfers.map((transfer: any) => (
                      <div key={transfer.id} className="p-3 border rounded-lg bg-orange-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              ${Math.abs(parseFloat(transfer.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} to {transfer.recipientName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {transfer.recipientBankName} • {transfer.transferType}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Submitted: {new Date(transfer.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={transfer.status === 'pending' ? 'outline' : 
                                     transfer.status === 'approved' ? 'default' : 'destructive'}
                              className={transfer.status === 'pending' ? 'border-orange-500 text-orange-700' : ''}
                            >
                              {transfer.status === 'pending' && '⏳ Pending Approval'}
                              {transfer.status === 'approved' && '✅ Approved'}
                              {transfer.status === 'disapproved' && '❌ Disapproved'}
                            </Badge>
                            {transfer.rejectionReason && (
                              <p className="text-xs text-red-600 mt-1 max-w-40 text-right">
                                {transfer.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transaction History */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                  <History className="w-5 h-5 mr-2 text-blue-600" />
                  Transaction History
                </h3>
                
                {selectedAccount.id === 'credit-card' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Amazon Purchase</p>
                          <p className="text-sm text-gray-600">Sep 24, 2025 • 3:45 PM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">$125.99</div>
                        <div className="text-xs text-gray-500">Balance: $250.00</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <Car className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Shell Gas Station</p>
                          <p className="text-sm text-gray-600">Sep 22, 2025 • 8:30 AM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-red-600">$45.20</div>
                        <div className="text-xs text-gray-500">Balance: $124.01</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Payment - Thank You</p>
                          <p className="text-sm text-gray-600">Sep 20, 2025 • 2:15 PM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">$150.00</div>
                        <div className="text-xs text-gray-500">Balance: $78.81</div>
                      </div>
                    </div>
                  </div>
                ) : accountTransactionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : accountTransactions && (accountTransactions as any[]).length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {(accountTransactions as any[]).map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? 
                              <ArrowDownLeft className="w-5 h-5" /> : 
                              <ArrowUpRight className="w-5 h-5" />
                            }
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600">{new Date(transaction.transaction_date).toLocaleString()}</p>
                            <p className="text-xs text-gray-500">Ref: {transaction.reference}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ${Math.abs(parseFloat(transaction.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-xs text-gray-500">
                            Balance: ${Math.abs(parseFloat(transaction.balance_after)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No transaction history available</p>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAccount(null)} data-testid="button-close-account">
              Close
            </Button>
            <Button onClick={() => setSelectedAccount(null)} className="bg-blue-600 hover:bg-blue-700" data-testid="button-done-account">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statements Dialog */}
      <Dialog open={isStatementsDialogOpen} onOpenChange={setIsStatementsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Account Statements (Last 3 Months)
            </DialogTitle>
            <DialogDescription>
              View and download your monthly account statements
            </DialogDescription>
          </DialogHeader>
          
          {statementsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : statements && Array.isArray(statements) && statements.length > 0 ? (
            <div className="space-y-6">
              {/* Group statements by month */}
              {['September 2025', 'August 2025', 'July 2025'].map((month) => {
                const monthStatements = Array.isArray(statements) ? statements.filter((stmt: any) => stmt.month === month) : [];
                if (monthStatements.length === 0) return null;
                
                return (
                  <div key={month} className="border rounded-lg p-6 bg-gray-50">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                      {month}
                    </h3>
                    
                    <div className="grid gap-4">
                      {monthStatements.map((statement: any) => (
                        <Card key={statement.id} className="bg-white">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg text-blue-700">
                                  {statement.accountType} Account
                                </CardTitle>
                                <CardDescription className="font-mono">
                                  ****{statement.accountNumber.slice(-4)} • Routing: {statement.routingNumber}
                                </CardDescription>
                              </div>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {statement.transactionCount} transactions
                              </Badge>
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-sm text-gray-600">Opening Balance</div>
                                <div className="text-lg font-bold text-gray-800">
                                  ${Math.abs(parseFloat(statement.openingBalance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-sm text-gray-600">Total Credits</div>
                                <div className="text-lg font-bold text-green-600">
                                  ${Math.abs(parseFloat(statement.totalCredits)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                              <div className="text-center p-3 bg-red-50 rounded-lg">
                                <div className="text-sm text-gray-600">Total Debits</div>
                                <div className="text-lg font-bold text-red-600">
                                  ${Math.abs(parseFloat(statement.totalDebits)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-sm text-gray-600">Closing Balance</div>
                                <div className="text-lg font-bold text-blue-600">
                                  ${Math.abs(parseFloat(statement.closingBalance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                            
                            {/* Recent Transactions Preview */}
                            {statement.transactions && statement.transactions.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Transaction Summary</h4>
                                <div className={`${expandedStatements.has(statement.id) ? 'max-h-96' : 'max-h-32'} overflow-y-auto space-y-1`}>
                                  {(expandedStatements.has(statement.id) 
                                    ? statement.transactions 
                                    : statement.transactions.slice(0, 5)
                                  ).map((transaction: any) => (
                                    <div key={transaction.id} className="border rounded-lg p-3 hover:bg-gray-50">
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-start space-x-3 flex-1">
                                          {transaction.type === 'credit' ? (
                                            <ArrowDownRight className="w-4 h-4 mt-1 text-green-600" />
                                          ) : (
                                            <ArrowUpRight className="w-4 h-4 mt-1 text-red-600" />
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">
                                              {transaction.merchantName || transaction.description}
                                            </div>
                                            {transaction.merchantLocation && (
                                              <div className="text-xs text-gray-500">
                                                {transaction.merchantLocation}
                                              </div>
                                            )}
                                            {transaction.merchantCategory && (
                                              <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">
                                                {transaction.merchantCategory}
                                              </div>
                                            )}
                                            <div className="text-xs text-gray-500 mt-1">
                                              <div className="flex flex-col space-y-1">
                                                <div className="flex items-center space-x-3">
                                                  <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {new Date(transaction.transactionDate).toLocaleDateString('en-US', {
                                                      weekday: 'short',
                                                      month: 'short', 
                                                      day: 'numeric',
                                                      year: 'numeric'
                                                    })}
                                                  </span>
                                                  <span className="flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {new Date(transaction.transactionDate).toLocaleTimeString('en-US', {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                      hour12: true
                                                    })}
                                                  </span>
                                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    transaction.type === 'credit' 
                                                      ? 'bg-green-100 text-green-800' 
                                                      : 'bg-red-100 text-red-800'
                                                  }`}>
                                                    {transaction.type === 'credit' ? 'Money In' : 'Money Out'}
                                                  </span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-gray-400">
                                                  {transaction.reference && (
                                                    <span>Ref: {transaction.reference}</span>
                                                  )}
                                                  {transaction.status && (
                                                    <span className="capitalize">Status: {transaction.status}</span>
                                                  )}
                                                  {transaction.processedBy && (
                                                    <span>Processed by FCB</span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`font-semibold ${
                                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            ${Math.abs(parseFloat(transaction.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Balance: ${Math.abs(parseFloat(transaction.balanceAfter)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  {statement.transactions.length > 5 && (
                                    <button 
                                      onClick={() => toggleStatementExpansion(statement.id)}
                                      className="w-full text-xs text-blue-600 hover:text-blue-800 text-center py-2 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                      data-testid={`toggle-transactions-${statement.id}`}
                                    >
                                      {expandedStatements.has(statement.id) 
                                        ? "Show less transactions" 
                                        : `+ ${statement.transactions.length - 5} more transactions`
                                      }
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center mt-4 pt-3 border-t">
                              <div className="text-xs text-gray-500">
                                Statement Date: {new Date(statement.statementDate).toLocaleDateString()}
                              </div>
                              <Button variant="outline" size="sm" className="flex items-center">
                                <Download className="w-3 h-3 mr-1" />
                                Download PDF
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No statements available</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatementsDialogOpen(false)} data-testid="button-close-statements">
              Close
            </Button>
            <Button onClick={() => setIsStatementsDialogOpen(false)} className="bg-blue-600 hover:bg-blue-700" data-testid="button-done-statements">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Receipt Modal */}
      <Dialog open={isTransferReceiptOpen} onOpenChange={setIsTransferReceiptOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-blue-600">
              Transfer Receipt
            </DialogTitle>
          </DialogHeader>
          
          {transferReceiptData && (
            <div className="space-y-6 py-4">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>

              {/* Transfer Type */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">{transferReceiptData.type}</h3>
                <p className="text-gray-500 text-sm mt-1">Transaction Successful</p>
              </div>

              {/* Amount */}
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">Transfer Amount</p>
                <p className="text-4xl font-bold text-blue-600">
                  ${parseFloat(transferReceiptData.transfer?.amount || transferReceiptData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Transfer Details */}
              <div className="border rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Transfer Details</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Reference Number</p>
                    <p className="font-mono text-sm font-medium">{transferReceiptData.transfer?.referenceNumber || transferReceiptData.referenceNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date & Time</p>
                    <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {transferReceiptData.transfer?.status || transferReceiptData.status || 'Completed'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium">{transferReceiptData.transferType}</p>
                  </div>
                </div>

                {/* Recipient Details */}
                {(transferReceiptData.transfer?.recipientName || transferReceiptData.transfer?.beneficiaryName) && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">Recipient Information</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">
                          {transferReceiptData.transfer?.recipientName || transferReceiptData.transfer?.beneficiaryName}
                        </p>
                      </div>
                      {(transferReceiptData.transfer?.recipientBankName || transferReceiptData.transfer?.beneficiaryBankName) && (
                        <div>
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p className="text-sm">{transferReceiptData.transfer?.recipientBankName || transferReceiptData.transfer?.beneficiaryBankName}</p>
                        </div>
                      )}
                      {(transferReceiptData.transfer?.recipientAccount || transferReceiptData.transfer?.beneficiaryAccount || transferReceiptData.transfer?.recipientAccountNumber) && (
                        <div>
                          <p className="text-xs text-gray-500">Account Number</p>
                          <p className="text-sm font-mono">****{(transferReceiptData.transfer?.recipientAccount || transferReceiptData.transfer?.beneficiaryAccount || transferReceiptData.transfer?.recipientAccountNumber || '').slice(-4)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fees if applicable */}
                {(transferReceiptData.transfer?.senderFee || transferReceiptData.senderFee) && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">Fees</p>
                    <div className="flex justify-between text-sm">
                      <span>Transfer Fee</span>
                      <span className="font-medium">${parseFloat(transferReceiptData.transfer?.senderFee || transferReceiptData.senderFee || '0').toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 text-center">
                  {transferReceiptData.message || 'Please save this receipt for your records. You can screenshot this page.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsTransferReceiptOpen(false);
                    setTransferReceiptData(null);
                  }}
                  data-testid="button-close-receipt"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    toast({
                      title: "Receipt Saved",
                      description: "You can screenshot this receipt for your records.",
                    });
                  }}
                  data-testid="button-save-receipt"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Screenshot This Receipt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-blue-600">
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="space-y-6 py-4">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedTransaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {selectedTransaction.type === 'credit' ? 
                    <ArrowUpRight className="w-10 h-10 text-green-600" /> : 
                    <ArrowDownRight className="w-10 h-10 text-red-600" />
                  }
                </div>
              </div>

              {/* Transaction Type */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedTransaction.type === 'credit' ? 'Money Received' : 'Payment Sent'}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{selectedTransaction.description}</p>
              </div>

              {/* Amount */}
              <div className={`rounded-lg p-6 text-center ${
                selectedTransaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className="text-sm text-gray-600 mb-2">Transaction Amount</p>
                <p className={`text-4xl font-bold ${
                  selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(parseFloat(selectedTransaction.amount)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              {/* Transaction Details */}
              <div className="border rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">Transaction Information</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Reference Number</p>
                    <p className="font-mono text-sm font-medium">{(() => {
                      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                      const randomRef = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
                      const year = new Date(selectedTransaction.transactionDate).getFullYear();
                      return `FCB${year}-${randomRef}`;
                    })()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transaction Date</p>
                    <p className="text-sm font-medium">{new Date(selectedTransaction.transactionDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Transaction Type</p>
                    <Badge className={selectedTransaction.type === 'credit' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}>
                      {selectedTransaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {selectedTransaction.status || 'Completed'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Balance After</p>
                    <p className="text-sm font-medium">
                      ${Math.abs(parseFloat(selectedTransaction.balanceAfter)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  {selectedTransaction.merchantName && (
                    <div>
                      <p className="text-xs text-gray-500">Merchant</p>
                      <p className="text-sm font-medium">{selectedTransaction.merchantName}</p>
                    </div>
                  )}
                </div>

                {selectedTransaction.merchantLocation && (
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">{selectedTransaction.merchantLocation}</p>
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 text-center">
                  You can screenshot this page for your records. For any questions about this transaction, please contact customer support.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedTransaction(null)}
                  data-testid="button-close-transaction-details"
                >
                  Close
                </Button>
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    toast({
                      title: "Transaction Details",
                      description: "You can screenshot this page for your records.",
                    });
                  }}
                  data-testid="button-screenshot-transaction"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Screenshot
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}