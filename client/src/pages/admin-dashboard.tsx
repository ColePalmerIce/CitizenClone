import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  Plus,
  Trash2,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Building,
  Shield
} from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  totalBalance: string;
  totalAccounts: number;
  recentTransactions: any[];
  accounts: any[];
}

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check admin session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check sessionStorage first for immediate login experience
        const storedAdmin = sessionStorage.getItem('admin');
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
          return;
        }
        
        // Fallback to server session check
        const response = await apiRequest('GET', '/api/admin/session');
        if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData);
        } else {
          setLocation('/admin/login');
        }
      } catch (error) {
        setLocation('/admin/login');
      }
    };
    checkSession();
  }, [setLocation]);

  // Dashboard stats query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard/stats'],
    enabled: !!admin,
  });

  // Customers query
  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ['/api/admin/customers'],
    enabled: !!admin,
  });

  // Transactions query
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/admin/transactions'],
    enabled: !!admin,
  });

  // Logout functionality
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/logout'),
    onSuccess: () => {
      setAdmin(null);
      setLocation('/admin/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/admin/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      toast({
        title: "Account created",
        description: "Customer account created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create customer account.",
        variant: "destructive",
      });
    },
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: (accountId: string) => apiRequest('DELETE', `/api/admin/customers/${accountId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      toast({
        title: "Account deleted",
        description: "Customer account deleted successfully.",
      });
    },
  });

  // Create transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/admin/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      toast({
        title: "Transaction processed",
        description: "Transaction completed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Transaction failed",
        description: error.message || "Failed to process transaction.",
        variant: "destructive",
      });
    },
  });

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded mr-2 flex items-center justify-center">
              <span className="text-white font-bold text-xs">FCB</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Admin Portal</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          data-testid="button-mobile-menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl lg:shadow-sm border-r
        `}>
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">Admin Portal</h2>
                <p className="text-blue-100 text-sm">First Citizens Bank</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <Button
              variant={selectedTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedTab("overview");
                setIsSidebarOpen(false);
              }}
              data-testid="nav-overview"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={selectedTab === "customers" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedTab("customers");
                setIsSidebarOpen(false);
              }}
              data-testid="nav-customers"
            >
              <Users className="w-4 h-4 mr-2" />
              Customers
            </Button>
            <Button
              variant={selectedTab === "transactions" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedTab("transactions");
                setIsSidebarOpen(false);
              }}
              data-testid="nav-transactions"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Transactions
            </Button>
          </nav>

          <div className="absolute bottom-4 left-4 right-4 space-y-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {admin.firstName} {admin.lastName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">{admin.email}</p>
              <Badge variant="outline" className="text-xs mt-1">
                {admin.role}
              </Badge>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <main className="p-4 lg:p-8">
            {selectedTab === "overview" && (
              <OverviewTab stats={stats} statsLoading={statsLoading} admin={admin} />
            )}
            {selectedTab === "customers" && (
              <CustomersTab 
                customers={customers} 
                customersLoading={customersLoading}
                createCustomerMutation={createCustomerMutation}
                deleteCustomerMutation={deleteCustomerMutation}
              />
            )}
            {selectedTab === "transactions" && (
              <TransactionsTab 
                transactions={transactions}
                transactionsLoading={transactionsLoading}
                customers={customers}
                createTransactionMutation={createTransactionMutation}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats, statsLoading, admin }: { stats: DashboardStats, statsLoading: boolean, admin: AdminUser | null }) {
  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 sm:mt-0">
          {(() => {
            const hour = new Date().getHours();
            const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
            return `${greeting}, ${admin?.firstName || 'Admin'}! Welcome to the admin portal`;
          })()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold">{stats?.totalCustomers || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold">${stats?.totalBalance || '0.00'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Active Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold">{stats?.totalAccounts || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-2xl font-bold">{stats?.recentTransactions?.length || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest banking activities</CardDescription>
        </CardHeader>
        <CardContent>
          {stats?.recentTransactions?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTransactions.map((transaction: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {transaction.type === 'credit' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`font-bold text-sm ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent transactions</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Customers Tab Component
function CustomersTab({ 
  customers, 
  customersLoading, 
  createCustomerMutation, 
  deleteCustomerMutation 
}: {
  customers: any[];
  customersLoading: boolean;
  createCustomerMutation: any;
  deleteCustomerMutation: any;
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    accountType: 'checking',
    initialBalance: '0.00'
  });

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomerMutation.mutate(newCustomer, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setNewCustomer({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          accountType: 'checking',
          initialBalance: '0.00'
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Customer Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0" data-testid="button-create-customer">
              <Plus className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Create Customer Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newCustomer.lastName}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newCustomer.username}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, username: e.target.value }))}
                  required
                  data-testid="input-username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  required
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newCustomer.password}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, password: e.target.value }))}
                  required
                  data-testid="input-password"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select 
                    value={newCustomer.accountType} 
                    onValueChange={(value) => setNewCustomer(prev => ({ ...prev, accountType: value }))}
                  >
                    <SelectTrigger data-testid="select-account-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="initialBalance">Initial Balance</Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newCustomer.initialBalance}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, initialBalance: e.target.value }))}
                    data-testid="input-initial-balance"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={createCustomerMutation.isPending}
                data-testid="button-submit-create-customer"
              >
                {createCustomerMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Accounts</CardTitle>
          <CardDescription>Manage all customer banking accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {customersLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : customers?.length > 0 ? (
            <div className="space-y-3">
              {customers.map((account: any) => (
                <div key={account.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      <div>
                        <p className="font-medium">Account #{account.accountNumber}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {account.accountType} • Routing: {account.routingNumber}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                          {account.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-lg">${account.balance}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        Opened: {new Date(account.openDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCustomerMutation.mutate(account.id)}
                      disabled={deleteCustomerMutation.isPending}
                      data-testid={`button-delete-${account.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No customer accounts found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Transactions Tab Component  
function TransactionsTab({ 
  transactions, 
  transactionsLoading, 
  customers, 
  createTransactionMutation 
}: {
  transactions: any[];
  transactionsLoading: boolean;
  customers: any[];
  createTransactionMutation: any;
}) {
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    accountId: '',
    type: 'credit',
    amount: '',
    description: ''
  });

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    createTransactionMutation.mutate(newTransaction, {
      onSuccess: () => {
        setIsTransactionDialogOpen(false);
        setNewTransaction({
          accountId: '',
          type: 'credit',
          amount: '',
          description: ''
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Transaction Management</h1>
        <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 sm:mt-0" data-testid="button-create-transaction">
              <Plus className="w-4 h-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>Process Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <Label htmlFor="accountId">Customer Account</Label>
                <Select 
                  value={newTransaction.accountId} 
                  onValueChange={(value) => setNewTransaction(prev => ({ ...prev, accountId: value }))}
                >
                  <SelectTrigger data-testid="select-account">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map((account: any) => (
                      <SelectItem key={account.id} value={account.id}>
                        #{account.accountNumber} - ${account.balance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Transaction Type</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger data-testid="select-transaction-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit (Deposit)</SelectItem>
                    <SelectItem value="debit">Debit (Withdrawal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  required
                  placeholder="0.00"
                  data-testid="input-transaction-amount"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Transaction description"
                  data-testid="input-transaction-description"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={createTransactionMutation.isPending}
                data-testid="button-submit-transaction"
              >
                {createTransactionMutation.isPending ? "Processing..." : "Process Transaction"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All banking transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : transactions?.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction: any) => (
                <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {transaction.type === 'credit' ? (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(transaction.transactionDate).toLocaleString()}
                      </p>
                      {transaction.reference && (
                        <p className="text-xs text-gray-500">Ref: {transaction.reference}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end mt-2 sm:mt-0">
                    <div className={`font-bold text-lg ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Balance: ${transaction.balanceAfter}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}