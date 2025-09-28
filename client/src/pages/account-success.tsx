import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, Home, Phone, Mail, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface AccountApplicationDetails {
  id: string;
  accountNumber?: string;
  routingNumber?: string;
  accountType: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  initialDeposit?: string;
  status: string;
  createdAt: string;
}

export default function AccountSuccess() {
  const [, params] = useRoute("/account-success/:applicationId");
  const applicationId = params?.applicationId;
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);

  const { data: accountDetails, isLoading, error } = useQuery<AccountApplicationDetails>({
    queryKey: ['/api/account-applications', applicationId],
    enabled: !!applicationId,
  });

  useEffect(() => {
    // Show account details after a brief delay for effect
    const timer = setTimeout(() => setShowDetails(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const generateAccountNumber = () => {
    // Generate a realistic-looking account number
    const prefix = accountDetails?.accountType === 'checking' ? '1001' : 
                   accountDetails?.accountType === 'savings' ? '2001' : '3001';
    const suffix = Math.random().toString().substr(2, 8);
    return `${prefix}${suffix}`;
  };

  const getRoutingNumber = () => {
    // Different routing numbers for different account types
    switch (accountDetails?.accountType) {
      case 'checking': return '053100300';
      case 'savings': return '067092022';
      case 'loan': return '113024588';
      default: return '053100300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account details...</p>
        </div>
      </div>
    );
  }

  if (error || !accountDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">!</span>
            </div>
            <h1 className="text-xl font-semibold mb-2">Application Not Found</h1>
            <p className="text-gray-600 mb-4">
              We couldn't find your application details. Please contact customer service.
            </p>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const accountNumber = generateAccountNumber();
  const routingNumber = getRoutingNumber();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Congratulations, {accountDetails.firstName}!
            </h1>
            <p className="text-lg text-gray-600">
              Your {accountDetails.accountType} account application has been submitted successfully
            </p>
          </div>

          {/* Application Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-yellow-800">Under Review</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  Your application is currently being reviewed by our team. 
                  You'll receive an email notification within 1-2 business days once it's approved.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          {showDetails && (
            <div className="space-y-6 animate-fade-in">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Your Account Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-700">Account Number</label>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-mono font-bold text-blue-900">
                            {accountNumber}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(accountNumber, "Account number")}
                            data-testid="button-copy-account-number"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <label className="text-sm font-medium text-gray-700">Routing Number</label>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-mono font-bold text-green-900">
                            {routingNumber}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(routingNumber, "Routing number")}
                            data-testid="button-copy-routing-number"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Account Type</label>
                        <p className="text-lg font-semibold capitalize">{accountDetails.accountType} Account</p>
                      </div>

                      {accountDetails.initialDeposit && parseFloat(accountDetails.initialDeposit) > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Initial Deposit</label>
                          <p className="text-lg font-semibold text-green-600">
                            ${parseFloat(accountDetails.initialDeposit).toLocaleString()}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-gray-700">Application Date</label>
                        <p className="text-lg">
                          {new Date(accountDetails.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{accountDetails.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{accountDetails.phoneNumber}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>What Happens Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Application Review</h4>
                        <p className="text-gray-600 text-sm">
                          Our team will review your application within 1-2 business days
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Account Approval</h4>
                        <p className="text-gray-600 text-sm">
                          You'll receive an email notification once your account is approved
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Start Banking</h4>
                        <p className="text-gray-600 text-sm">
                          Use your username and password to log in and start managing your account
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="flex items-center gap-2"
                  data-testid="button-print-details"
                >
                  <Download className="w-4 h-4" />
                  Print Account Details
                </Button>
                <Link href="/">
                  <Button className="flex items-center gap-2" data-testid="button-return-home">
                    <Home className="w-4 h-4" />
                    Return to Homepage
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}