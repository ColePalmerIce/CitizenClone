import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  Plus,
  Minus,
  Trash2,
  LogOut,
  Menu,
  X,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Building,
  Shield,
  ChevronDown,
  Lock,
  Unlock,
  CheckCircle,
  Info
} from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  totalBalance: string;
  totalAccounts: number;
  recentTransactions: any[];
  accounts: any[];
}

interface AdminBalance {
  id: string;
  adminId: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

interface TransactionDetail {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  fromAccount?: any;
  toAccount?: any;
  user?: any;
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
  const [isCustomerDetailsDialogOpen, setIsCustomerDetailsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isCustomerFundDialogOpen, setIsCustomerFundDialogOpen] = useState(false);
  const [isCustomerWithdrawDialogOpen, setIsCustomerWithdrawDialogOpen] = useState(false);
  const [customerFundAmount, setCustomerFundAmount] = useState("");
  const [customerFundDescription, setCustomerFundDescription] = useState("");
  const [customerWithdrawAmount, setCustomerWithdrawAmount] = useState<string>("");
  const [customerWithdrawDescription, setCustomerWithdrawDescription] = useState<string>("");
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check admin session
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Always verify with server session first for security
        const response = await apiRequest('GET', '/api/admin/session');
        if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData);
          // Sync with sessionStorage for quick access
          sessionStorage.setItem('admin', JSON.stringify(adminData));
        } else {
          // Clear invalid sessionStorage
          sessionStorage.removeItem('admin');
          setLocation('/admin/login');
        }
      } catch (error) {
        // Clear invalid sessionStorage and redirect
        sessionStorage.removeItem('admin');
        setLocation('/admin/login');
      }
    };
    checkSession();
  }, [setLocation]);

  // Dashboard stats query
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/dashboard/stats'],
    enabled: !!admin,
    refetchInterval: 10000, // Refetch every 10 seconds for real-time stats
    refetchOnWindowFocus: true,
  });
  const safeStats = stats || { totalCustomers: 0, totalBalance: '0.00', totalAccounts: 0, recentTransactions: [], accounts: [] };

  // Customers query
  const { data: customers, isLoading: customersLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/customers'],
    enabled: !!admin,
    refetchInterval: 15000, // Refetch every 15 seconds for customer updates
    refetchOnWindowFocus: true,
  });
  const safeCustomers = customers || [];

  // Transactions query
  const { data: transactions, isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/transactions'],
    enabled: !!admin,
    refetchInterval: 10000, // Refetch every 10 seconds for transaction updates
    refetchOnWindowFocus: true,
  });
  const safeTransactions = transactions || [];

  // Admin balance query
  const { data: adminBalance, isLoading: balanceLoading, refetch: refetchBalance } = useQuery<AdminBalance | null>({
    queryKey: ['/api/admin/balance'],
    enabled: !!admin,
  });
  const safeAdminBalance = adminBalance || { id: '', adminId: '', balance: '500000000.00', createdAt: '', updatedAt: '' };

  // Logout functionality
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/admin/logout'),
    onSuccess: () => {
      setAdmin(null);
      // Clear sessionStorage to prevent stale admin data
      sessionStorage.removeItem('admin');
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
    onError: (error: any) => {
      console.error("Customer creation error:", error);
      const errorMessage = error?.message || "Failed to create customer account.";
      toast({
        title: "Error",
        description: errorMessage,
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

  // Block customer mutation
  const blockCustomerMutation = useMutation({
    mutationFn: async (data: { userId: string; reason?: string }) => {
      const response = await apiRequest('POST', `/api/admin/block-customer/${data.userId}`, { reason: data.reason });
      if (!response.ok) throw new Error('Failed to block customer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      toast({
        title: "Account Blocked",
        description: "Customer account has been blocked successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Block Failed",
        description: error.message || "Failed to block customer account.",
        variant: "destructive",
      });
    },
  });

  // Unblock customer mutation
  const unblockCustomerMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('POST', `/api/admin/unblock-customer/${userId}`);
      if (!response.ok) throw new Error('Failed to unblock customer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      toast({
        title: "Account Unblocked",
        description: "Customer account has been unblocked successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Unblock Failed",
        description: error.message || "Failed to unblock customer account.",
        variant: "destructive",
      });
    },
  });

  // Customer fund management mutations
  const customerAddFundsMutation = useMutation({
    mutationFn: async (data: { accountId: string; amount: string; description: string }) => {
      const response = await apiRequest('POST', '/api/admin/customer/add-funds', data);
      if (!response.ok) throw new Error('Failed to add funds');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/balance'] });
      toast({
        title: "Funds Added",
        description: "Customer account has been credited successfully.",
      });
      setIsCustomerFundDialogOpen(false);
      setCustomerFundAmount("");
      setCustomerFundDescription("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add funds to customer account.",
        variant: "destructive",
      });
    },
  });

  const customerWithdrawFundsMutation = useMutation({
    mutationFn: async (data: { accountId: string; amount: string; description: string }) => {
      const response = await apiRequest('POST', '/api/admin/customer/withdraw-funds', data);
      if (!response.ok) throw new Error('Failed to withdraw funds');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/balance'] });
      toast({
        title: "Funds Withdrawn",
        description: "Amount has been withdrawn from customer account.",
      });
      setIsCustomerWithdrawDialogOpen(false);
      setCustomerWithdrawAmount("");
      setCustomerWithdrawDescription("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to withdraw funds from customer account.",
        variant: "destructive",
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
      refetchBalance(); // Refresh admin balance
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

  // Admin self-credit mutation
  const adminCreditMutation = useMutation({
    mutationFn: (data: { amount: string; description: string }) => 
      apiRequest('POST', '/api/admin/credit-self', data),
    onSuccess: () => {
      refetchBalance();
      toast({
        title: "Balance Updated",
        description: "Admin balance credited successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Credit Failed",
        description: error.message || "Failed to credit admin balance.",
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
          flex flex-col
        `}>
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 flex-shrink-0">
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

          <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
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
            <Button
              variant={selectedTab === "pending-transfers" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedTab("pending-transfers");
                setIsSidebarOpen(false);
              }}
              data-testid="nav-pending-transfers"
            >
              <Shield className="w-4 h-4 mr-2" />
              Pending Transfers
            </Button>
            <Button
              variant={selectedTab === "external-transfers" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedTab("external-transfers");
                setIsSidebarOpen(false);
              }}
              data-testid="nav-external-transfers"
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              External Transfers
            </Button>
            <Button
              variant={selectedTab === "account-applications" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedTab("account-applications");
                setIsSidebarOpen(false);
              }}
              data-testid="nav-account-applications"
            >
              <Plus className="w-4 h-4 mr-2" />
              Account Applications
            </Button>
            <Button
              variant={selectedTab === "access-codes" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedTab("access-codes");
                setIsSidebarOpen(false);
              }}
              data-testid="nav-access-codes"
            >
              <Lock className="w-4 h-4 mr-2" />
              Access Codes
            </Button>
          </nav>

          <div className="p-4 border-t space-y-4 flex-shrink-0">
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
          <main className="p-4 lg:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
            {selectedTab === "overview" && (
              <OverviewTab 
                stats={safeStats} 
                statsLoading={statsLoading} 
                admin={admin} 
                adminBalance={safeAdminBalance}
                balanceLoading={balanceLoading}
                adminCreditMutation={adminCreditMutation}
                transactions={safeTransactions}
                transactionsLoading={transactionsLoading}
                setSelectedTab={setSelectedTab}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                isCustomerDetailsDialogOpen={isCustomerDetailsDialogOpen}
                setIsCustomerDetailsDialogOpen={setIsCustomerDetailsDialogOpen}
                isCustomerFundDialogOpen={isCustomerFundDialogOpen}
                setIsCustomerFundDialogOpen={setIsCustomerFundDialogOpen}
                isCustomerWithdrawDialogOpen={isCustomerWithdrawDialogOpen}
                setIsCustomerWithdrawDialogOpen={setIsCustomerWithdrawDialogOpen}
                customerFundAmount={customerFundAmount}
                setCustomerFundAmount={setCustomerFundAmount}
                customerFundDescription={customerFundDescription}
                setCustomerFundDescription={setCustomerFundDescription}
                customerWithdrawAmount={customerWithdrawAmount}
                setCustomerWithdrawAmount={setCustomerWithdrawAmount}
                customerWithdrawDescription={customerWithdrawDescription}
                setCustomerWithdrawDescription={setCustomerWithdrawDescription}
                customerAddFundsMutation={customerAddFundsMutation}
                customerWithdrawFundsMutation={customerWithdrawFundsMutation}
              />
            )}
            {selectedTab === "customers" && (
              <CustomersTab 
                customers={safeCustomers} 
                customersLoading={customersLoading}
                createCustomerMutation={createCustomerMutation}
                deleteCustomerMutation={deleteCustomerMutation}
                blockCustomerMutation={blockCustomerMutation}
                unblockCustomerMutation={unblockCustomerMutation}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                isCustomerDetailsDialogOpen={isCustomerDetailsDialogOpen}
                setIsCustomerDetailsDialogOpen={setIsCustomerDetailsDialogOpen}
                isCustomerFundDialogOpen={isCustomerFundDialogOpen}
                setIsCustomerFundDialogOpen={setIsCustomerFundDialogOpen}
                isCustomerWithdrawDialogOpen={isCustomerWithdrawDialogOpen}
                setIsCustomerWithdrawDialogOpen={setIsCustomerWithdrawDialogOpen}
                customerFundAmount={customerFundAmount}
                setCustomerFundAmount={setCustomerFundAmount}
                customerFundDescription={customerFundDescription}
                setCustomerFundDescription={setCustomerFundDescription}
                customerWithdrawAmount={customerWithdrawAmount}
                setCustomerWithdrawAmount={setCustomerWithdrawAmount}
                customerWithdrawDescription={customerWithdrawDescription}
                setCustomerWithdrawDescription={setCustomerWithdrawDescription}
                customerAddFundsMutation={customerAddFundsMutation}
                customerWithdrawFundsMutation={customerWithdrawFundsMutation}
              />
            )}
            {selectedTab === "transactions" && (
              <TransactionsTab 
                transactions={safeTransactions}
                transactionsLoading={transactionsLoading}
                customers={safeCustomers}
                createTransactionMutation={createTransactionMutation}
              />
            )}
            {selectedTab === "pending-transfers" && (
              <PendingTransfersTab />
            )}
            {selectedTab === "external-transfers" && (
              <ExternalTransfersTab />
            )}
            {selectedTab === "account-applications" && (
              <AccountApplicationsTab />
            )}
            {selectedTab === "access-codes" && (
              <AccessCodesTab />
            )}
          </main>
        </div>
      </div>
      
      {/* Global Customer Fund Management Dialogs */}
      <Dialog open={isCustomerFundDialogOpen} onOpenChange={setIsCustomerFundDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Funds to Customer Account</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="font-medium">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Account #{selectedCustomer.accountNumber}</p>
                <p className="text-sm font-medium">Current Balance: ${parseFloat(selectedCustomer.balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <Label htmlFor="fund-amount">Amount to Add</Label>
                <Input
                  id="fund-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customerFundAmount}
                  onChange={(e) => setCustomerFundAmount(e.target.value)}
                  data-testid="input-customer-fund-amount"
                />
              </div>
              <div>
                <Label htmlFor="fund-description">Description</Label>
                <Input
                  id="fund-description"
                  placeholder="Reason for adding funds"
                  value={customerFundDescription}
                  onChange={(e) => setCustomerFundDescription(e.target.value)}
                  data-testid="input-customer-fund-description"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCustomerFundDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (customerFundAmount && customerFundDescription) {
                      customerAddFundsMutation.mutate({
                        accountId: selectedCustomer.id,
                        amount: customerFundAmount,
                        description: customerFundDescription
                      });
                    }
                  }}
                  disabled={!customerFundAmount || !customerFundDescription || customerAddFundsMutation.isPending}
                  className="flex-1"
                  data-testid="button-confirm-add-funds"
                >
                  {customerAddFundsMutation.isPending ? 'Adding...' : `Add ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(customerFundAmount || '0'))}`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCustomerWithdrawDialogOpen} onOpenChange={setIsCustomerWithdrawDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Withdraw Funds from Customer Account</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="font-medium">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Account #{selectedCustomer.accountNumber}</p>
                <p className="text-sm font-medium">Current Balance: ${parseFloat(selectedCustomer.balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={customerWithdrawAmount}
                  onChange={(e) => setCustomerWithdrawAmount(e.target.value)}
                  data-testid="input-customer-withdraw-amount"
                />
              </div>
              <div>
                <Label htmlFor="withdraw-description">Description</Label>
                <Input
                  id="withdraw-description"
                  placeholder="Reason for withdrawal"
                  value={customerWithdrawDescription}
                  onChange={(e) => setCustomerWithdrawDescription(e.target.value)}
                  data-testid="input-customer-withdraw-description"
                />
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCustomerWithdrawDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (customerWithdrawAmount && customerWithdrawDescription) {
                      customerWithdrawFundsMutation.mutate({
                        accountId: selectedCustomer.id,
                        amount: customerWithdrawAmount,
                        description: customerWithdrawDescription
                      });
                    }
                  }}
                  disabled={!customerWithdrawAmount || !customerWithdrawDescription || customerWithdrawFundsMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-confirm-withdraw-funds"
                >
                  {customerWithdrawFundsMutation.isPending ? 'Withdrawing...' : `Withdraw ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(customerWithdrawAmount || '0'))}`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ 
  stats, 
  statsLoading, 
  admin, 
  adminBalance, 
  balanceLoading,
  adminCreditMutation,
  transactions,
  transactionsLoading,
  setSelectedTab,
  selectedCustomer,
  setSelectedCustomer,
  isCustomerDetailsDialogOpen,
  setIsCustomerDetailsDialogOpen,
  isCustomerFundDialogOpen,
  setIsCustomerFundDialogOpen,
  isCustomerWithdrawDialogOpen,
  setIsCustomerWithdrawDialogOpen,
  customerFundAmount,
  setCustomerFundAmount,
  customerFundDescription,
  setCustomerFundDescription,
  customerWithdrawAmount,
  setCustomerWithdrawAmount,
  customerWithdrawDescription,
  setCustomerWithdrawDescription,
  customerAddFundsMutation,
  customerWithdrawFundsMutation
}: { 
  stats: DashboardStats; 
  statsLoading: boolean; 
  admin: AdminUser | null;
  adminBalance: AdminBalance | null;
  balanceLoading: boolean;
  adminCreditMutation: any;
  transactions: any[];
  transactionsLoading: boolean;
  setSelectedTab: (tab: string) => void;
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
  isCustomerDetailsDialogOpen: boolean;
  setIsCustomerDetailsDialogOpen: (open: boolean) => void;
  isCustomerFundDialogOpen: boolean;
  setIsCustomerFundDialogOpen: (open: boolean) => void;
  isCustomerWithdrawDialogOpen: boolean;
  setIsCustomerWithdrawDialogOpen: (open: boolean) => void;
  customerFundAmount: string;
  setCustomerFundAmount: (amount: string) => void;
  customerFundDescription: string;
  setCustomerFundDescription: (desc: string) => void;
  customerWithdrawAmount: string;
  setCustomerWithdrawAmount: (amount: string) => void;
  customerWithdrawDescription: string;
  setCustomerWithdrawDescription: (desc: string) => void;
  customerAddFundsMutation: any;
  customerWithdrawFundsMutation: any;
}) {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDescription, setCreditDescription] = useState("");

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  };

  // Format transaction ID to proper banking format with random reference
  const formatTransactionId = (rawId: string, transactionDate?: string) => {
    // Generate truly random reference number
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomRef = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const year = transactionDate 
      ? new Date(transactionDate).getFullYear()
      : new Date().getFullYear();
    return `FCB${year}-${randomRef}`;
  };

  // Handle admin self-credit
  const handleSelfCredit = () => {
    if (!creditAmount || !creditDescription) {
      return;
    }
    adminCreditMutation.mutate({
      amount: creditAmount,
      description: creditDescription
    });
    setShowCreditModal(false);
    setCreditAmount("");
    setCreditDescription("");
  };
  if (statsLoading || balanceLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
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
        <p className="text-black font-bold text-lg drop-shadow-lg mt-2 sm:mt-0">
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

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center justify-between">
              Admin Balance
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCreditModal(true)}
                className="text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Credit
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {adminBalance ? formatCurrency(adminBalance.balance) : '$0.00'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Available for transactions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Customer Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold">{formatCurrency(stats?.totalBalance || '0.00')}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">All customer accounts combined</p>
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
              <span className="text-2xl font-bold">{transactions?.length || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Transactions Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Latest Admin Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Admin Transactions
              <Badge variant="secondary">{transactions?.slice(0, 5).length || 0}</Badge>
            </CardTitle>
            <CardDescription>Your recent banking activities</CardDescription>
          </CardHeader>
          <CardContent>
            {!transactionsLoading && transactions && transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction: any) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => setSelectedTransaction(transaction)}
                  >
                    <div className="flex items-center space-x-3">
                      {transaction.type === 'credit' ? (
                        <div className="p-1 bg-green-100 rounded-full">
                          <ArrowUpRight className="w-3 h-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-1 bg-red-100 rounded-full">
                          <ArrowDownRight className="w-3 h-3 text-red-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">ID: {formatTransactionId(transaction.id, transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold text-sm ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                      <p className="text-xs text-gray-500">
                        <Eye className="w-3 h-3 inline mr-1" />
                        Click for details
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : transactionsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent transactions</p>
            )}
          </CardContent>
        </Card>
        
        {/* Admin Balance Management */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-blue-700">
              <span className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Admin Balance Management
              </span>
            </CardTitle>
            <CardDescription>Manage your administrative funds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Current Balance</p>
              <p className="text-3xl font-bold text-green-600">
                {adminBalance ? formatCurrency(adminBalance.balance) : '$0.00'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => setShowCreditModal(true)}
                className="bg-green-600 hover:bg-green-700"
                disabled={adminCreditMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-200 hover:bg-blue-50"
                onClick={() => setSelectedTab('transactions')}
                data-testid="button-view-history"
              >
                <Eye className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <p><strong>Note:</strong> Admin balance automatically adjusts when processing customer transactions.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transaction Details Modal */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">Transaction Amount</p>
                  <p className={`text-lg font-bold ${
                    selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedTransaction.type === 'credit' ? '+' : ''}{formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${
                  selectedTransaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {selectedTransaction.type === 'credit' ? (
                    <ArrowUpRight className="w-6 h-6 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-medium">Transaction ID</p>
                  <p className="font-mono text-xs bg-gray-100 p-1 rounded">{formatTransactionId(selectedTransaction.id, selectedTransaction.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Status</p>
                  <Badge variant={selectedTransaction.status === 'completed' ? 'default' : 'secondary'}>
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Date & Time</p>
                  <p>{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Type</p>
                  <p className="capitalize">{selectedTransaction.type}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-600 font-medium mb-2">Description</p>
                <p className="bg-gray-50 p-3 rounded text-sm">{selectedTransaction.description}</p>
              </div>
              
              {selectedTransaction.toAccount && (
                <div>
                  <p className="text-gray-600 font-medium mb-2">Customer Details</p>
                  <div className="bg-blue-50 p-3 rounded space-y-1">
                    <p><strong>Name:</strong> {selectedTransaction.toAccount.user?.firstName} {selectedTransaction.toAccount.user?.lastName}</p>
                    <p><strong>Email:</strong> {selectedTransaction.toAccount.user?.email}</p>
                    <p><strong>Account:</strong> {selectedTransaction.toAccount.accountNumber}</p>
                    <p><strong>Account Type:</strong> {selectedTransaction.toAccount.accountType}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Customer Details Modal */}
      <Dialog open={isCustomerDetailsDialogOpen} onOpenChange={setIsCustomerDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Full Name:</span> {selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedCustomer.email}</p>
                    <p><span className="font-medium">Username:</span> {selectedCustomer.username}</p>
                    {selectedCustomer.phoneNumber && (
                      <p><span className="font-medium">Phone:</span> {selectedCustomer.phoneNumber}</p>
                    )}
                    {selectedCustomer.dateOfBirth && (
                      <p><span className="font-medium">Date of Birth:</span> {new Date(selectedCustomer.dateOfBirth).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Account Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Account #:</span> {selectedCustomer.accountNumber}</p>
                    <p><span className="font-medium">Account Type:</span> {selectedCustomer.accountType}</p>
                    <p><span className="font-medium">Routing #:</span> {selectedCustomer.routingNumber}</p>
                    <p><span className="font-medium">Status:</span> 
                      <Badge variant={selectedCustomer.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                        {selectedCustomer.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Employment Information */}
              {(selectedCustomer.jobTitle || selectedCustomer.annualIncome || selectedCustomer.employer) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Employment Information</h3>
                    <div className="space-y-2">
                      {selectedCustomer.employer && (
                        <p><span className="font-medium">Employer:</span> {selectedCustomer.employer}</p>
                      )}
                      {selectedCustomer.jobTitle && (
                        <p><span className="font-medium">Job Title:</span> {selectedCustomer.jobTitle}</p>
                      )}
                      {selectedCustomer.employmentType && (
                        <p><span className="font-medium">Employment Type:</span> 
                          <Badge variant="outline" className="ml-2 capitalize">
                            {selectedCustomer.employmentType.replace('_', ' ')}
                          </Badge>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100">Financial Information</h3>
                    <div className="space-y-2">
                      {selectedCustomer.annualIncome && (
                        <p><span className="font-medium">Annual Income:</span> 
                          <span className="font-semibold text-green-600 ml-2">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(selectedCustomer.annualIncome))}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Current Balance */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border">
                <h3 className="font-semibold text-lg mb-2">Current Balance</h3>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${parseFloat(selectedCustomer.balance || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              
              {/* Fund Management Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Dialog open={isCustomerFundDialogOpen} onOpenChange={setIsCustomerFundDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="default" 
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="button-add-funds"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Funds
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                <Dialog open={isCustomerWithdrawDialogOpen} onOpenChange={setIsCustomerWithdrawDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      data-testid="button-withdraw-funds"
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      Withdraw
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              
              <div className="text-sm text-gray-500 text-center">
                Account opened: {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      
      {/* Admin Credit Modal */}
      <Dialog open={showCreditModal} onOpenChange={setShowCreditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Funds to Admin Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="credit-amount">Amount</Label>
              <Input
                id="credit-amount"
                type="number"
                placeholder="Enter amount"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="credit-description">Description</Label>
              <Input
                id="credit-description"
                placeholder="Reason for credit (e.g., Balance top-up)"
                value={creditDescription}
                onChange={(e) => setCreditDescription(e.target.value)}
              />
            </div>
            <div className="flex space-x-2 pt-4">
              <Button
                onClick={handleSelfCredit}
                disabled={!creditAmount || !creditDescription || adminCreditMutation.isPending}
                className="flex-1"
              >
                {adminCreditMutation.isPending ? 'Processing...' : 'Add Funds'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Customers Tab Component
function CustomersTab({ 
  customers, 
  customersLoading, 
  createCustomerMutation, 
  deleteCustomerMutation,
  blockCustomerMutation,
  unblockCustomerMutation,
  selectedCustomer,
  setSelectedCustomer,
  isCustomerDetailsDialogOpen,
  setIsCustomerDetailsDialogOpen,
  isCustomerFundDialogOpen,
  setIsCustomerFundDialogOpen,
  isCustomerWithdrawDialogOpen,
  setIsCustomerWithdrawDialogOpen,
  customerFundAmount,
  setCustomerFundAmount,
  customerFundDescription,
  setCustomerFundDescription,
  customerWithdrawAmount,
  setCustomerWithdrawAmount,
  customerWithdrawDescription,
  setCustomerWithdrawDescription,
  customerAddFundsMutation,
  customerWithdrawFundsMutation
}: {
  customers: any[];
  customersLoading: boolean;
  createCustomerMutation: any;
  deleteCustomerMutation: any;
  blockCustomerMutation: any;
  unblockCustomerMutation: any;
  selectedCustomer: any;
  setSelectedCustomer: (customer: any) => void;
  isCustomerDetailsDialogOpen: boolean;
  setIsCustomerDetailsDialogOpen: (open: boolean) => void;
  isCustomerFundDialogOpen: boolean;
  setIsCustomerFundDialogOpen: (open: boolean) => void;
  isCustomerWithdrawDialogOpen: boolean;
  setIsCustomerWithdrawDialogOpen: (open: boolean) => void;
  customerFundAmount: string;
  setCustomerFundAmount: (amount: string) => void;
  customerFundDescription: string;
  setCustomerFundDescription: (desc: string) => void;
  customerWithdrawAmount: string;
  setCustomerWithdrawAmount: (amount: string) => void;
  customerWithdrawDescription: string;
  setCustomerWithdrawDescription: (desc: string) => void;
  customerAddFundsMutation: any;
  customerWithdrawFundsMutation: any;
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    ssn: '',
    dateOfBirth: '',
    phoneNumber: '',
    accountCreationDate: '', // Optional: Admin can backdate account creation
    createAllAccounts: true,
    createCards: true,
    initialCheckingBalance: '1000.00',
    initialSavingsBalance: '500.00',
    initialBusinessBalance: '0.00'
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
          ssn: '',
          dateOfBirth: '',
          phoneNumber: '',
          accountCreationDate: '',
          createAllAccounts: true,
          createCards: true,
          initialCheckingBalance: '1000.00',
          initialSavingsBalance: '500.00',
          initialBusinessBalance: '0.00'
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
          <DialogContent className="max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Comprehensive Customer Account</DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Complete banking profile with auto-generated accounts and cards
              </p>
            </DialogHeader>
            <form onSubmit={handleCreateCustomer} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 border-b pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newCustomer.firstName}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                      data-testid="input-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newCustomer.lastName}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                      data-testid="input-last-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
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
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter 10 digits (any format)"
                      value={newCustomer.phoneNumber}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      required
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ssn">Social Security Number *</Label>
                    <Input
                      id="ssn"
                      placeholder="Enter 9 digits (any format)"
                      value={newCustomer.ssn}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, ssn: e.target.value }))}
                      required
                      data-testid="input-ssn"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newCustomer.dateOfBirth}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      required
                      data-testid="input-dob"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountCreationDate">Account Creation Date (optional)</Label>
                    <Input
                      id="accountCreationDate"
                      type="datetime-local"
                      value={newCustomer.accountCreationDate}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, accountCreationDate: e.target.value }))}
                      data-testid="input-account-creation-date"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave blank to use current date/time. Admin can backdate for legacy accounts.</p>
                  </div>
                </div>
              </div>

              {/* Login Credentials Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 border-b pb-2">
                  Login Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      placeholder="john.doe"
                      value={newCustomer.username}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, username: e.target.value }))}
                      required
                      data-testid="input-username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Strong password"
                      value={newCustomer.password}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, password: e.target.value }))}
                      required
                      data-testid="input-password"
                    />
                  </div>
                </div>
              </div>

              {/* Account Setup Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 border-b pb-2">
                  Account Setup Options
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="createAllAccounts"
                      checked={newCustomer.createAllAccounts}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, createAllAccounts: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      data-testid="checkbox-create-all-accounts"
                    />
                    <Label htmlFor="createAllAccounts" className="font-medium">
                      Create All Account Types (Checking, Savings, Business)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="createCards"
                      checked={newCustomer.createCards}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, createCards: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      data-testid="checkbox-create-cards"
                    />
                    <Label htmlFor="createCards" className="font-medium">
                      Create Credit and Debit Cards
                    </Label>
                  </div>
                  
                  {newCustomer.createAllAccounts && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium mb-3">Initial Account Balances</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="initialCheckingBalance">Checking Balance</Label>
                          <Input
                            id="initialCheckingBalance"
                            type="number"
                            step="0.01"
                            min="0"
                            value={newCustomer.initialCheckingBalance}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, initialCheckingBalance: e.target.value }))}
                            data-testid="input-checking-balance"
                          />
                        </div>
                        <div>
                          <Label htmlFor="initialSavingsBalance">Savings Balance</Label>
                          <Input
                            id="initialSavingsBalance"
                            type="number"
                            step="0.01"
                            min="0"
                            value={newCustomer.initialSavingsBalance}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, initialSavingsBalance: e.target.value }))}
                            data-testid="input-savings-balance"
                          />
                        </div>
                        <div>
                          <Label htmlFor="initialBusinessBalance">Business Balance</Label>
                          <Input
                            id="initialBusinessBalance"
                            type="number"
                            step="0.01"
                            min="0"
                            value={newCustomer.initialBusinessBalance}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, initialBusinessBalance: e.target.value }))}
                            data-testid="input-business-balance"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700" 
                  disabled={createCustomerMutation.isPending}
                  data-testid="button-submit-create-customer"
                >
                  {createCustomerMutation.isPending ? "Creating Complete Banking Profile..." : "Create Customer Account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
              </div>
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
              {(() => {
                // Group accounts by user
                const groupedByUser = customers.reduce((acc, account) => {
                  const userId = account.userId;
                  if (!acc[userId]) {
                    acc[userId] = {
                      user: {
                        id: userId,
                        firstName: account.firstName,
                        lastName: account.lastName,
                        email: account.email,
                        username: account.username
                      },
                      accounts: []
                    };
                  }
                  acc[userId].accounts.push(account);
                  return acc;
                }, {} as Record<string, any>);

                return Object.values(groupedByUser).map((userGroup: any) => {
                  const totalBalance = userGroup.accounts.reduce((sum: number, acc: any) => sum + parseFloat(acc.balance || '0'), 0);
                  
                  return (
                    <Collapsible key={userGroup.user.id} className="w-full">
                      <CollapsibleTrigger asChild>
                        <div 
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-2 sm:space-y-0 cursor-pointer hover:shadow-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
                          data-testid={`customer-group-${userGroup.user.id}`}
                        >
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                              <div>
                                <p className="font-medium text-lg">{userGroup.user.firstName} {userGroup.user.lastName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {userGroup.accounts.length} account{userGroup.accounts.length > 1 ? 's' : ''} • Total Balance: ${totalBalance.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Email: {userGroup.user.email}
                                </p>
                              </div>
                              <div className="mt-2 sm:mt-0">
                                <Badge variant="default">
                                  {userGroup.accounts.length} accounts
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-2">
                        {userGroup.accounts.map((account: any) => (
                          <div 
                            key={account.id}
                            className="ml-6 flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2 sm:space-y-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                            onClick={() => {
                              setSelectedCustomer(account);
                              setIsCustomerDetailsDialogOpen(true);
                            }}
                            data-testid={`account-${account.id}`}
                          >
                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                <div>
                                  <p className="font-medium">{account.accountType}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Account #{account.accountNumber} • Routing: {account.routingNumber}
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
                                  Opened: {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : '2023-01-15'}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    flushSync(() => {
                                      setSelectedCustomer(account);
                                      setIsCustomerFundDialogOpen(true);
                                    });
                                  }}
                                  data-testid={`button-add-funds-${account.id}`}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    flushSync(() => {
                                      setSelectedCustomer(account);
                                      setIsCustomerWithdrawDialogOpen(true);
                                    });
                                  }}
                                  data-testid={`button-withdraw-funds-${account.id}`}
                                >
                                  <Minus className="w-4 h-4 mr-1" />
                                  Withdraw
                                </Button>
                                {account.status === 'blocked' ? (
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      unblockCustomerMutation.mutate(account.userId);
                                    }}
                                    disabled={unblockCustomerMutation.isPending}
                                    data-testid={`button-unblock-${account.id}`}
                                  >
                                    <Unlock className="w-4 h-4 mr-1" />
                                    Unblock
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const reason = prompt('Enter reason for blocking this account (optional):');
                                      blockCustomerMutation.mutate({ userId: account.userId, reason });
                                    }}
                                    disabled={blockCustomerMutation.isPending}
                                    data-testid={`button-block-${account.id}`}
                                  >
                                    <Lock className="w-4 h-4 mr-1" />
                                    Block
                                  </Button>
                                )}
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCustomerMutation.mutate(account.id);
                                  }}
                                  disabled={deleteCustomerMutation.isPending}
                                  data-testid={`button-delete-${account.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                });
              })()}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No customer accounts found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// External Transfers Tab Component  
function ExternalTransfersTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Pending external transfers query
  const { data: pendingExternalTransfers, isLoading: externalTransfersLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/pending-external-transfers'],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const safePendingExternalTransfers = pendingExternalTransfers || [];

  // Approve external transfer mutation
  const approveExternalTransferMutation = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await apiRequest('POST', `/api/admin/approve-external-transfer/${transferId}`);
      if (!response.ok) throw new Error('Failed to approve external transfer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-external-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard-stats'] });
      toast({
        title: "External Transfer Approved",
        description: "The external transfer has been approved and processed.",
      });
    },
    onError: () => {
      toast({
        title: "Approval Failed",
        description: "Failed to approve external transfer.",
        variant: "destructive",
      });
    },
  });

  // Disapprove external transfer mutation
  const disapproveExternalTransferMutation = useMutation({
    mutationFn: async (data: { transferId: string; reason: string }) => {
      const response = await apiRequest('POST', `/api/admin/disapprove-external-transfer/${data.transferId}`, { 
        reason: data.reason 
      });
      if (!response.ok) throw new Error('Failed to disapprove external transfer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-external-transfers'] });
      toast({
        title: "External Transfer Disapproved",
        description: "The external transfer has been disapproved.",
      });
    },
    onError: () => {
      toast({
        title: "Disapproval Failed",
        description: "Failed to disapprove external transfer.",
        variant: "destructive",
      });
    },
  });

  const [selectedExternalTransfer, setSelectedExternalTransfer] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">External Transfers</h1>
        <Badge variant="secondary" className="text-sm">
          {safePendingExternalTransfers.length} pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>External Transfer Approval Queue</CardTitle>
          <CardDescription>Review and approve customer external transfer requests with comprehensive recipient details</CardDescription>
        </CardHeader>
        <CardContent>
          {externalTransfersLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading external transfers...</p>
              </div>
            </div>
          ) : safePendingExternalTransfers.length > 0 ? (
            <div className="space-y-6">
              {safePendingExternalTransfers.map((transfer: any) => (
                <Card 
                  key={transfer.id} 
                  className="p-6 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950"
                >
                  <div className="space-y-4">
                    {/* Transfer Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          ${parseFloat(transfer.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {transfer.transferType} Transfer • {transfer.purpose || 'No reason provided'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted: {new Date(transfer.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                        Pending Approval
                      </Badge>
                    </div>

                    {/* Transfer Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* From Account */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">From Account</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <p>Account: ****{transfer.fromAccountId.slice(-4)}</p>
                          <p>User ID: {transfer.userId}</p>
                        </div>
                      </div>

                      {/* Recipient Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Recipient Details</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <p className="font-medium text-base">{transfer.recipientName}</p>
                          {transfer.recipientPhoneNumber ? (
                            <p className="flex items-center gap-1 mt-1">
                              <span>📞</span> {transfer.recipientPhoneNumber}
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">No phone provided</p>
                          )}
                          {transfer.recipientAddress ? (
                            <div className="mt-3 p-2 bg-white dark:bg-gray-700 rounded border">
                              <p className="font-medium text-gray-900 dark:text-white mb-1">📍 Address:</p>
                              <div className="space-y-1">
                                <p>{transfer.recipientAddress.street}</p>
                                <p>{transfer.recipientAddress.city}, {transfer.recipientAddress.state} {transfer.recipientAddress.zip}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-400 italic mt-3">No address provided</p>
                          )}
                        </div>
                      </div>

                      {/* Banking Information */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Banking Details</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <p className="font-medium">{transfer.recipientBankName}</p>
                          <p>Account: {transfer.recipientAccountNumber}</p>
                          <p>Routing: {transfer.recipientRoutingNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => approveExternalTransferMutation.mutate(transfer.id)}
                        disabled={approveExternalTransferMutation.isPending || disapproveExternalTransferMutation.isPending}
                        data-testid={`button-approve-external-${transfer.id}`}
                      >
                        {approveExternalTransferMutation.isPending ? 'Approving...' : '✓ Approve Transfer'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedExternalTransfer(transfer);
                        }}
                        disabled={approveExternalTransferMutation.isPending || disapproveExternalTransferMutation.isPending}
                        data-testid={`button-disapprove-external-${transfer.id}`}
                      >
                        ✗ Disapprove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ArrowUpRight className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending external transfers</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">All external transfer requests have been processed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disapprove External Transfer Dialog */}
      <Dialog open={selectedExternalTransfer !== null} onOpenChange={() => setSelectedExternalTransfer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disapprove External Transfer</DialogTitle>
          </DialogHeader>
          {selectedExternalTransfer && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="font-medium">${parseFloat(selectedExternalTransfer.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">To: {selectedExternalTransfer.recipientName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Bank: {selectedExternalTransfer.recipientBankName}</p>
              </div>
              <div>
                <Label htmlFor="rejectReason">Reason for disapproval</Label>
                <Input
                  id="rejectReason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Enter reason for disapproving this transfer..."
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedExternalTransfer(null);
                    setRejectReason("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (selectedExternalTransfer) {
                      disapproveExternalTransferMutation.mutate({
                        transferId: selectedExternalTransfer.id,
                        reason: rejectReason
                      });
                      setSelectedExternalTransfer(null);
                      setRejectReason("");
                    }
                  }}
                  disabled={!rejectReason.trim() || disapproveExternalTransferMutation.isPending}
                >
                  {disapproveExternalTransferMutation.isPending ? 'Disapproving...' : 'Disapprove Transfer'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Pending Transfers Tab Component
function PendingTransfersTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Pending transfers query
  const { data: pendingTransfers, isLoading: pendingTransfersLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/pending-transfers'],
    refetchInterval: 5000, // Refetch every 5 seconds for immediate pending transfer updates
    refetchOnWindowFocus: true,
  });
  const safePendingTransfers = pendingTransfers || [];

  // Pending domestic wire transfers query
  const { data: domesticWires, isLoading: domesticWiresLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/domestic-wire-transfers'],
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
  const safeDomesticWires = (domesticWires || []).filter((w: any) => w.status === 'pending');

  // Pending international wire transfers query
  const { data: internationalWires, isLoading: internationalWiresLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/international-wire-transfers'],
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
  const safeInternationalWires = (internationalWires || []).filter((w: any) => w.status === 'pending');

  // Approve transfer mutation
  const approveTransferMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await apiRequest('POST', `/api/admin/approve-transfer/${transactionId}`);
      if (!response.ok) throw new Error('Failed to approve transfer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/customers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      toast({
        title: "Transfer Approved",
        description: "The transfer has been approved and processed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve transfer.",
        variant: "destructive",
      });
    },
  });

  // Reject transfer mutation
  const rejectTransferMutation = useMutation({
    mutationFn: async (data: { transactionId: string; reason: string }) => {
      const response = await apiRequest('POST', `/api/admin/reject-transfer/${data.transactionId}`, { reason: data.reason });
      if (!response.ok) throw new Error('Failed to reject transfer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-transfers'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      toast({
        title: "Transfer Rejected",
        description: "The transfer has been rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject transfer.",
        variant: "destructive",
      });
    },
  });

  // Approve domestic wire transfer mutation
  const approveDomesticWireMutation = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await apiRequest('POST', `/api/admin/approve-domestic-wire/${transferId}`);
      if (!response.ok) throw new Error('Failed to approve domestic wire');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/domestic-wire-transfers'] });
      toast({
        title: "Wire Transfer Approved",
        description: "Domestic wire transfer has been approved and is processing.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve domestic wire transfer.",
        variant: "destructive",
      });
    },
  });

  // Disapprove domestic wire transfer mutation
  const disapproveDomesticWireMutation = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await apiRequest('POST', `/api/admin/disapprove-domestic-wire/${transferId}`);
      if (!response.ok) throw new Error('Failed to disapprove domestic wire');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/domestic-wire-transfers'] });
      toast({
        title: "Wire Transfer Rejected",
        description: "Domestic wire transfer has been rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject domestic wire transfer.",
        variant: "destructive",
      });
    },
  });

  // Approve international wire transfer mutation
  const approveInternationalWireMutation = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await apiRequest('POST', `/api/admin/approve-international-wire/${transferId}`);
      if (!response.ok) throw new Error('Failed to approve international wire');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/international-wire-transfers'] });
      toast({
        title: "Wire Transfer Approved",
        description: "International wire transfer has been approved and is processing.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve international wire transfer.",
        variant: "destructive",
      });
    },
  });

  // Disapprove international wire transfer mutation
  const disapproveInternationalWireMutation = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await apiRequest('POST', `/api/admin/disapprove-international-wire/${transferId}`);
      if (!response.ok) throw new Error('Failed to disapprove international wire');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/international-wire-transfers'] });
      toast({
        title: "Wire Transfer Rejected",
        description: "International wire transfer has been rejected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject international wire transfer.",
        variant: "destructive",
      });
    },
  });

  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const totalPending = safePendingTransfers.length + safeDomesticWires.length + safeInternationalWires.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Pending Transfers</h1>
        <Badge variant="outline" className="mt-2 sm:mt-0">
          {totalPending} pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Approval Queue</CardTitle>
          <CardDescription>Review and approve customer transfer requests</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTransfersLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : safePendingTransfers.length > 0 ? (
            <div className="space-y-4">
              {safePendingTransfers.map((transfer: any) => (
                <div 
                  key={transfer.id} 
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-lg">
                          ${parseFloat(transfer.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{transfer.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p><span className="font-medium">From:</span> {transfer.account?.firstName} {transfer.account?.lastName}</p>
                      <p><span className="font-medium">Account:</span> {transfer.account?.accountNumber}</p>
                      <p><span className="font-medium">Date:</span> {new Date(transfer.transactionDate).toLocaleString()}</p>
                      <p><span className="font-medium">Reference:</span> {transfer.reference}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 lg:mt-0">
                    <Button
                      onClick={() => approveTransferMutation.mutate(transfer.id)}
                      disabled={approveTransferMutation.isPending || rejectTransferMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid={`button-approve-${transfer.id}`}
                    >
                      {approveTransferMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setSelectedTransfer(transfer);
                        setIsRejectDialogOpen(true);
                      }}
                      disabled={approveTransferMutation.isPending || rejectTransferMutation.isPending}
                      data-testid={`button-reject-${transfer.id}`}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending transfers</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">All customer transfers have been processed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domestic Wire Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Domestic Wire Transfers</CardTitle>
          <CardDescription>Review and approve domestic wire transfer requests ($25 fee)</CardDescription>
        </CardHeader>
        <CardContent>
          {domesticWiresLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : safeDomesticWires.length > 0 ? (
            <div className="space-y-4">
              {safeDomesticWires.map((wire: any) => (
                <div 
                  key={wire.id} 
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <ArrowUpRight className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-lg">
                          ${parseFloat(wire.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Domestic Wire - {wire.recipientName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p><span className="font-medium">From:</span> {wire.userName}</p>
                      <p><span className="font-medium">Bank:</span> {wire.recipientBankName}</p>
                      <p><span className="font-medium">Routing:</span> {wire.recipientRoutingNumber}</p>
                      <p><span className="font-medium">Account:</span> {wire.recipientAccountNumber}</p>
                      <p><span className="font-medium">Date:</span> {new Date(wire.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">Reference:</span> {wire.referenceNumber}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 lg:mt-0">
                    <Button
                      onClick={() => approveDomesticWireMutation.mutate(wire.id)}
                      disabled={approveDomesticWireMutation.isPending || disapproveDomesticWireMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid={`button-approve-domestic-wire-${wire.id}`}
                    >
                      {approveDomesticWireMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => disapproveDomesticWireMutation.mutate(wire.id)}
                      disabled={approveDomesticWireMutation.isPending || disapproveDomesticWireMutation.isPending}
                      data-testid={`button-reject-domestic-wire-${wire.id}`}
                    >
                      {disapproveDomesticWireMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ArrowUpRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending domestic wire transfers</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* International Wire Transfers */}
      <Card>
        <CardHeader>
          <CardTitle>Pending International Wire Transfers</CardTitle>
          <CardDescription>Review and approve international wire transfer requests ($45 + $25 fee)</CardDescription>
        </CardHeader>
        <CardContent>
          {internationalWiresLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : safeInternationalWires.length > 0 ? (
            <div className="space-y-4">
              {safeInternationalWires.map((wire: any) => (
                <div 
                  key={wire.id} 
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <ArrowUpRight className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-lg">
                          ${parseFloat(wire.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">International Wire - {wire.beneficiaryName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p><span className="font-medium">From:</span> {wire.userName}</p>
                      <p><span className="font-medium">Bank:</span> {wire.beneficiaryBankName}</p>
                      <p><span className="font-medium">SWIFT:</span> {wire.swiftCode}</p>
                      <p><span className="font-medium">Account:</span> {wire.beneficiaryAccountNumber}</p>
                      <p><span className="font-medium">Country:</span> {wire.beneficiaryCountry}</p>
                      <p><span className="font-medium">Date:</span> {new Date(wire.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">Reference:</span> {wire.referenceNumber}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4 lg:mt-0">
                    <Button
                      onClick={() => approveInternationalWireMutation.mutate(wire.id)}
                      disabled={approveInternationalWireMutation.isPending || disapproveInternationalWireMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid={`button-approve-international-wire-${wire.id}`}
                    >
                      {approveInternationalWireMutation.isPending ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => disapproveInternationalWireMutation.mutate(wire.id)}
                      disabled={approveInternationalWireMutation.isPending || disapproveInternationalWireMutation.isPending}
                      data-testid={`button-reject-international-wire-${wire.id}`}
                    >
                      {disapproveInternationalWireMutation.isPending ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ArrowUpRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending international wire transfers</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Transfer Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Transfer</DialogTitle>
          </DialogHeader>
          {selectedTransfer && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="font-medium">${parseFloat(selectedTransfer.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedTransfer.description}</p>
              </div>
              <div>
                <Label htmlFor="reject-reason">Rejection Reason</Label>
                <Input
                  id="reject-reason"
                  placeholder="Enter reason for rejection"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  data-testid="input-reject-reason"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectReason("");
                    setSelectedTransfer(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (rejectReason.trim()) {
                      rejectTransferMutation.mutate({
                        transactionId: selectedTransfer.id,
                        reason: rejectReason
                      });
                      setIsRejectDialogOpen(false);
                      setRejectReason("");
                      setSelectedTransfer(null);
                    }
                  }}
                  disabled={!rejectReason.trim() || rejectTransferMutation.isPending}
                  className="flex-1"
                  data-testid="button-confirm-reject"
                >
                  {rejectTransferMutation.isPending ? 'Rejecting...' : 'Reject Transfer'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

  // Format transaction ID to proper banking format with random reference
  const formatTransactionId = (rawId: string, transactionDate?: string) => {
    // Generate truly random reference number
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomRef = Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const year = transactionDate 
      ? new Date(transactionDate).getFullYear()
      : new Date().getFullYear();
    return `FCB${year}-${randomRef}`;
  };

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
                        {account.firstName} {account.lastName} - #{account.accountNumber} - ${account.balance}
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
                      <p className="text-xs text-gray-500 font-mono">ID: {formatTransactionId(transaction.id, transaction.transactionDate)}</p>
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

// Account Applications Tab Component
function AccountApplicationsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Account applications query
  const { data: applications, isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/account-applications'],
    refetchInterval: 15000, // Refetch every 15 seconds
    refetchOnWindowFocus: true,
  });

  const safeApplications = applications || [];

  // Approve application mutation
  const approveApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      return await apiRequest('POST', `/api/admin/approve-account-application/${applicationId}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/account-applications'] });
      toast({
        title: "Application Approved",
        description: "Account application has been approved and user account created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    }
  });

  // Reject application mutation
  const rejectApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, notes }: { applicationId: string; notes?: string }) => {
      return await apiRequest('POST', `/api/admin/reject-account-application/${applicationId}`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/account-applications'] });
      toast({
        title: "Application Rejected",
        description: "Account application has been rejected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject application",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Account Applications</h1>
          <p className="text-white/70 mt-2">Review and manage pending account applications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>Account applications awaiting review</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          ) : safeApplications.filter(app => app.status === 'pending').length > 0 ? (
            <div className="space-y-4">
              {safeApplications.filter(app => app.status === 'pending').map((application: any) => (
                <div key={application.id} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{application.firstName} {application.lastName}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{application.email}</p>
                          <p className="text-sm text-gray-500">Applied {new Date(application.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Account Type</p>
                          <p className="capitalize">{application.accountType}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Initial Deposit</p>
                          <p className="font-semibold text-green-600">
                            ${parseFloat(application.initialDeposit || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Username</p>
                          <p className="font-mono">{application.username}</p>
                        </div>
                      </div>

                      {/* Employment Information */}
                      {(application.jobTitle || application.annualIncome || application.employer || application.employmentType) && (
                        <div className="mt-4 border-t pt-4">
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Employment Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            {application.employer && (
                              <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Employer</p>
                                <p>{application.employer}</p>
                              </div>
                            )}
                            {application.jobTitle && (
                              <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Job Title</p>
                                <p>{application.jobTitle}</p>
                              </div>
                            )}
                            {application.annualIncome && (
                              <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Annual Income</p>
                                <p className="font-semibold text-green-600">
                                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(application.annualIncome))}
                                </p>
                              </div>
                            )}
                            {application.employmentType && (
                              <div>
                                <p className="font-medium text-gray-700 dark:text-gray-300">Employment Type</p>
                                <p className="capitalize">{application.employmentType.replace('_', ' ')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {application.phoneNumber && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium text-gray-700 dark:text-gray-300">Phone</p>
                          <p>{application.phoneNumber}</p>
                        </div>
                      )}

                      {(application.street || application.city) && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium text-gray-700 dark:text-gray-300">Address</p>
                          <p>{application.street}, {application.city}, {application.state} {application.zipCode}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 lg:w-48">
                      <Button
                        onClick={() => approveApplicationMutation.mutate({ applicationId: application.id })}
                        disabled={approveApplicationMutation.isPending || rejectApplicationMutation.isPending}
                        className="w-full bg-green-600 hover:bg-green-700"
                        data-testid={`button-approve-${application.id}`}
                      >
                        {approveApplicationMutation.isPending ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => rejectApplicationMutation.mutate({ applicationId: application.id })}
                        disabled={approveApplicationMutation.isPending || rejectApplicationMutation.isPending}
                        className="w-full"
                        data-testid={`button-reject-${application.id}`}
                      >
                        {rejectApplicationMutation.isPending ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending applications</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Processed Applications</CardTitle>
          <CardDescription>Recently approved or rejected applications</CardDescription>
        </CardHeader>
        <CardContent>
          {safeApplications.filter(app => app.status !== 'pending').length > 0 ? (
            <div className="space-y-3">
              {safeApplications
                .filter(app => app.status !== 'pending')
                .slice(0, 10)
                .map((application: any) => (
                <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <div>
                    <p className="font-medium">{application.firstName} {application.lastName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{application.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={application.status === 'approved' ? 'default' : 'destructive'}>
                      {application.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {application.approvedAt ? new Date(application.approvedAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No processed applications</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Access Codes Tab Component - Simplified
function AccessCodesTab() {
  // Query for access codes with auto-refresh every 10 seconds
  const { data: accessCodes, isLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/access-codes'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const allCodes = accessCodes || [];
  const validCodes = allCodes.filter((code: any) => !code.isUsed && new Date(code.expiresAt) > new Date());
  const usedCodes = allCodes.filter((code: any) => code.isUsed);

  return (
    <div className="space-y-6 min-h-screen" style={{ background: '#f3f4f6' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white" style={{ background: 'linear-gradient(to right, #2563eb, #4f46e5)' }}>
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'white' }}>Access Codes</h2>
        <p className="text-blue-100" style={{ color: '#dbeafe' }}>Auto-generated codes for user authentication • Refreshes every 10 seconds</p>
      </div>

      {/* Active Codes - Main Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" />
            Active Access Codes ({validCodes.length})
          </CardTitle>
          <CardDescription>
            These codes can be used by users to login. Codes expire after 10 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading access codes...</p>
            </div>
          ) : validCodes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {validCodes.map((code: any) => (
                <div key={code.id} className="relative group" data-testid={`access-code-${code.id}`}>
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all">
                    <div className="text-2xl font-mono font-bold text-center text-blue-600 dark:text-blue-400 tracking-wider">
                      {code.code}
                    </div>
                    <div className="mt-2 flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No Active Codes</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Codes will be generated automatically by the system</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Used Codes History */}
      {usedCodes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-500" />
              Recently Used Codes ({usedCodes.length})
            </CardTitle>
            <CardDescription>
              Codes that have been successfully used for login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {usedCodes.slice(0, 20).map((code: any) => (
                <div key={code.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg" data-testid={`used-code-${code.id}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-lg text-gray-500 dark:text-gray-400">{code.code}</span>
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Used Successfully
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {code.usedAt ? new Date(code.usedAt).toLocaleString() : 'Recently used'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
              <p className="font-semibold">How Access Codes Work:</p>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                <li>• System automatically generates 10 new codes every 5 minutes</li>
                <li>• Each code is valid for 10 minutes after generation</li>
                <li>• Users enter the code during login for two-factor authentication</li>
                <li>• Once used, codes are marked as "Used Successfully"</li>
                <li>• This page automatically refreshes every 10 seconds</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}