import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  Building
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
  const { toast } = useToast();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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
            <div className="px-6 py-6 border-b border-blue-500 lg:border-none">
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

            {/* Logout */}
            <div className="mt-auto p-4">
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
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Account Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome to your personal banking dashboard
              </p>
            </div>

            {/* Account Summary Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Account Details
                  </CardTitle>
                  <CardDescription>Your primary banking account</CardDescription>
                </CardHeader>
                <CardContent>
                  {accountLoading ? (
                    <div className="space-y-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  ) : bankAccount ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Account Number</span>
                        <span className="font-mono">**** {(bankAccount as BankAccount).accountNumber.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Routing Number</span>
                        <span className="font-mono">{(bankAccount as BankAccount).routingNumber}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Account Type</span>
                        <Badge variant="outline">
                          {(bankAccount as BankAccount).accountType.charAt(0).toUpperCase() + (bankAccount as BankAccount).accountType.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Status</span>
                        <Badge variant={(bankAccount as BankAccount).status === 'active' ? 'default' : 'secondary'}>
                          {(bankAccount as BankAccount).status.charAt(0).toUpperCase() + (bankAccount as BankAccount).status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No account information available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Current Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {accountLoading ? (
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  ) : bankAccount ? (
                    <div className="text-3xl font-bold text-green-600">
                      ${parseFloat((bankAccount as BankAccount).balance).toLocaleString()}
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-400">
                      $0.00
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Your latest account activity</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : transactions && (transactions as Transaction[]).length > 0 ? (
                  <div className="space-y-4">
                    {(transactions as Transaction[]).map((transaction) => (
                      <div key={transaction.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? 
                            <ArrowUpRight className="w-4 h-4" /> : 
                            <ArrowDownRight className="w-4 h-4" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.transactionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${parseFloat(transaction.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Your transaction history will appear here</p>
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