import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Copy,
  Check
} from "lucide-react";

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
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
  balanceAfter: string;
  transactionDate: string;
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
  const [activeTab, setActiveTab] = useState("overview");
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [accountNumberVisible, setAccountNumberVisible] = useState(false);
  const [copiedAccountNumber, setCopiedAccountNumber] = useState(false);
  const { toast } = useToast();

  // Transfer form state
  const [transferForm, setTransferForm] = useState({
    recipient: '',
    recipientAccount: '',
    amount: '',
    description: '',
    transferType: 'external'
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

  // Check user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check sessionStorage first for immediate login experience
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          return;
        }
        
        // Fallback to server session check
        const response = await apiRequest('GET', '/api/user/session');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setLocation('/');
        }
      } catch (error) {
        setLocation('/');
      }
    };
    checkSession();
  }, [setLocation]);

  // Get user's bank account
  const { data: bankAccount, isLoading: accountLoading } = useQuery({
    queryKey: ['/api/user/account'],
    enabled: !!user,
  });

  // Get user's transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/user/transactions'],
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
      queryClient.invalidateQueries({ queryKey: ['/api/user/transactions'] });
      toast({
        title: "Transfer Successful",
        description: "Your money transfer has been completed.",
      });
      setIsTransferDialogOpen(false);
      setTransferForm({ recipient: '', recipientAccount: '', amount: '', description: '', transferType: 'external' });
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
        <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-blue-600 transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center px-6 py-4 border-b border-blue-500">
              <Building className="w-8 h-8 text-white mr-3" />
              <div>
                <h1 className="text-lg font-bold text-white">Customer Portal</h1>
                <p className="text-xs text-blue-200">First Citizens Bank</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="px-6 py-6 border-b border-blue-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
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

            {/* Navigation Menu */}
            <div className="flex-1 px-4 py-4 space-y-2">
              <div className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-3">
                Account Services
              </div>
              
              <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                <DialogTrigger asChild>
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
                        <span className="text-sm">January 15, 1990</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Phone Number</span>
                        <span className="text-sm">(555) 123-4567</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Address</span>
                        <span className="text-sm">123 Main St, City, ST</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Customer Since</span>
                        <span className="text-sm">March 2020</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isCardsDialogOpen} onOpenChange={setIsCardsDialogOpen}>
                <DialogTrigger asChild>
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
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>My Cards</DialogTitle>
                    <DialogDescription>
                      Manage your credit and debit cards
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Debit Card */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-blue-200">Debit Card</p>
                          <p className="font-semibold">First Citizens Debit</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-blue-200">Balance</p>
                          <p className="font-semibold">
                            {bankAccount && balanceVisible 
                              ? `$${parseFloat((bankAccount as BankAccount).balance).toLocaleString()}`
                              : "••••••"
                            }
                          </p>
                        </div>
                      </div>
                      <div className="font-mono text-lg tracking-wider mb-2">
                        {bankAccount 
                          ? `**** **** **** ${(bankAccount as BankAccount).accountNumber.slice(-4)}`
                          : "**** **** **** ----"
                        }
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary">
                            <Lock className="w-4 h-4 mr-1" />
                            Freeze
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Credit Card */}
                    <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg text-white">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-300">Credit Card</p>
                          <p className="font-semibold">FCB Rewards Card</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-300">Available Credit</p>
                          <p className="font-semibold">$4,750</p>
                        </div>
                      </div>
                      <div className="font-mono text-lg tracking-wider mb-2">
                        **** **** **** 8492
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary">
                            <Lock className="w-4 h-4 mr-1" />
                            Freeze
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">Payment Due</span>
                          <span>Dec 15, 2025</span>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-300">Minimum Payment</span>
                          <span className="font-semibold">$125.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="w-full">
                      Add New Card
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                data-testid="button-statements"
              >
                <FileText className="w-4 h-4 mr-3" />
                Statements
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                data-testid="button-security"
              >
                <Shield className="w-4 h-4 mr-3" />
                Security
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>

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
                      <Button variant="outline" className="h-20 flex-col space-y-2">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                        <span className="text-xs">Live Chat</span>
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

              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                data-testid="button-contact"
              >
                <MessageCircle className="w-4 h-4 mr-3" />
                Contact Us
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                data-testid="button-locations"
              >
                <MapPin className="w-4 h-4 mr-3" />
                Branch Locator
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-blue-500 mb-1"
                data-testid="button-notifications"
              >
                <Bell className="w-4 h-4 mr-3" />
                Notifications
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Button>
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
                    {accountLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                    ) : bankAccount ? (
                      <h2 className="text-3xl font-bold text-gray-900">
                        {balanceVisible 
                          ? `$${parseFloat((bankAccount as BankAccount).balance).toLocaleString()}`
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Transfer Money</DialogTitle>
                        <DialogDescription>
                          Send money to another account
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="recipient">Recipient Name</Label>
                          <Input
                            id="recipient"
                            value={transferForm.recipient}
                            onChange={(e) => setTransferForm({...transferForm, recipient: e.target.value})}
                            placeholder="Enter recipient name"
                            data-testid="input-recipient"
                          />
                        </div>
                        <div>
                          <Label htmlFor="recipientAccount">Recipient Account</Label>
                          <Input
                            id="recipientAccount"
                            value={transferForm.recipientAccount}
                            onChange={(e) => setTransferForm({...transferForm, recipientAccount: e.target.value})}
                            placeholder="Enter account number"
                            data-testid="input-recipient-account"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={transferForm.amount}
                            onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
                            placeholder="0.00"
                            data-testid="input-transfer-amount"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={transferForm.description}
                            onChange={(e) => setTransferForm({...transferForm, description: e.target.value})}
                            placeholder="Optional note"
                            data-testid="input-transfer-description"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={() => transferMutation.mutate(transferForm)}
                          disabled={!transferForm.recipient || !transferForm.amount || transferMutation.isPending}
                          className="w-full"
                          data-testid="button-confirm-transfer"
                        >
                          {transferMutation.isPending ? 'Processing...' : `Transfer $${transferForm.amount || '0'}`}
                        </Button>
                      </DialogFooter>
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

            {/* Account Details */}
            <Card className="mb-6 bg-white/95 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {accountLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                ) : bankAccount ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Type</p>
                      <p className="font-medium">{(bankAccount as BankAccount).accountType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <Badge variant={(bankAccount as BankAccount).status === 'active' ? 'default' : 'secondary'}>
                        {(bankAccount as BankAccount).status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Routing Number</p>
                      <p className="font-mono text-sm">{(bankAccount as BankAccount).routingNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Number</p>
                      <p className="font-mono text-sm">****{(bankAccount as BankAccount).accountNumber.slice(-4)}</p>
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
                      <div key={transaction.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
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
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{new Date(transaction.transactionDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="font-mono">FCB{new Date(transaction.transactionDate).toISOString().slice(0, 10).replace(/-/g, '')}-{transaction.id.slice(-6).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className={`font-bold text-right ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div>{transaction.type === 'credit' ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString()}</div>
                          <div className="text-xs text-gray-500 font-normal">
                            ${parseFloat(transaction.balanceAfter).toLocaleString()}
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

    </div>
  );
}