import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountOpeningSchema, type AccountOpeningData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, User, Home, Briefcase, CreditCard, X } from "lucide-react";
import { useLocation } from "wouter";

interface EnhancedAccountOpenerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EnhancedAccountOpener({ open, onOpenChange }: EnhancedAccountOpenerProps) {
  const [currentStep, setCurrentStep] = useState("select-type");
  const [selectedAccountType, setSelectedAccountType] = useState<"checking" | "savings" | "loan" | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<AccountOpeningData>({
    resolver: zodResolver(accountOpeningSchema),
    defaultValues: {
      accountType: "checking",
      initialDeposit: "0",
      employmentType: "full_time"
    }
  });

  const createAccountMutation = useMutation({
    mutationFn: async (data: AccountOpeningData) => {
      return await apiRequest('POST', '/api/account-applications', data);
    },
    onSuccess: async (response) => {
      const application = await response.json();
      toast({
        title: "Application Submitted Successfully!",
        description: "Your account application has been submitted for review.",
      });
      onOpenChange(false);
      // Navigate to success page with application ID
      setLocation(`/account-success/${application.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Application Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: AccountOpeningData) => {
    const applicationData = {
      ...data,
      accountType: selectedAccountType || "checking"
    };
    createAccountMutation.mutate(applicationData);
  };

  const nextStep = () => {
    if (currentStep === "select-type" && selectedAccountType) {
      setCurrentStep("application-form");
      form.setValue("accountType", selectedAccountType);
    }
  };

  const backToSelection = () => {
    setCurrentStep("select-type");
  };

  if (currentStep === "select-type") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl" data-testid="modal-account-type-selection">
          <DialogTitle className="text-2xl font-bold text-center">Open Your New Account</DialogTitle>
          <DialogDescription className="text-center">
            Choose the type of account you'd like to open with First Citizens Bank
          </DialogDescription>
          
          <div className="flex items-center justify-end mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              data-testid="button-close-account-opener"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedAccountType === "checking" ? "ring-2 ring-blue-600 bg-blue-50" : ""
              }`}
              onClick={() => setSelectedAccountType("checking")}
              data-testid="card-checking-account"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Checking Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Perfect for everyday banking with easy access to your money
                </p>
                <ul className="text-xs space-y-1 text-gray-500">
                  <li>• No minimum balance</li>
                  <li>• Free debit card</li>
                  <li>• Online & mobile banking</li>
                  <li>• Direct deposit</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedAccountType === "savings" ? "ring-2 ring-green-600 bg-green-50" : ""
              }`}
              onClick={() => setSelectedAccountType("savings")}
              data-testid="card-savings-account"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Savings Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Grow your money with competitive interest rates
                </p>
                <ul className="text-xs space-y-1 text-gray-500">
                  <li>• Competitive APY</li>
                  <li>• $100 minimum balance</li>
                  <li>• Goal-based savings</li>
                  <li>• Automatic transfers</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedAccountType === "loan" ? "ring-2 ring-purple-600 bg-purple-50" : ""
              }`}
              onClick={() => setSelectedAccountType("loan")}
              data-testid="card-loan-account"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-600" />
                  Loan Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Personal loans for your major purchases or consolidation
                </p>
                <ul className="text-xs space-y-1 text-gray-500">
                  <li>• Competitive rates</li>
                  <li>• Flexible terms</li>
                  <li>• Quick approval</li>
                  <li>• No prepayment penalty</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              onClick={nextStep}
              disabled={!selectedAccountType}
              className="px-8"
              data-testid="button-continue-application"
            >
              Continue with {selectedAccountType ? selectedAccountType.charAt(0).toUpperCase() + selectedAccountType.slice(1) : "Selected"} Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="modal-account-application">
        <DialogTitle className="text-2xl font-bold">Complete Your {selectedAccountType?.charAt(0).toUpperCase()}{selectedAccountType?.slice(1)} Account Application</DialogTitle>
        <DialogDescription>
          Please provide the following information to open your new account
        </DialogDescription>
        
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            onClick={backToSelection}
            data-testid="button-back-to-selection"
          >
            ← Back to Account Selection
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onOpenChange(false)}
            data-testid="button-close-application"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="credentials" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Login Info
              </TabsTrigger>
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Personal
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Address
              </TabsTrigger>
              <TabsTrigger value="employment" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Employment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="credentials" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Login Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username*</Label>
                      <Input
                        id="username"
                        {...form.register("username")}
                        placeholder="Choose a username"
                        data-testid="input-username"
                      />
                      {form.formState.errors.username && (
                        <p className="text-sm text-red-600">{form.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address*</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="your@email.com"
                        data-testid="input-email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Password*</Label>
                      <Input
                        id="password"
                        type="password"
                        {...form.register("password")}
                        placeholder="Choose a secure password"
                        data-testid="input-password"
                      />
                      {form.formState.errors.password && (
                        <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password*</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...form.register("confirmPassword")}
                        placeholder="Confirm your password"
                        data-testid="input-confirm-password"
                      />
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name*</Label>
                      <Input
                        id="firstName"
                        {...form.register("firstName")}
                        placeholder="First name"
                        data-testid="input-first-name"
                      />
                      {form.formState.errors.firstName && (
                        <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name*</Label>
                      <Input
                        id="lastName"
                        {...form.register("lastName")}
                        placeholder="Last name"
                        data-testid="input-last-name"
                      />
                      {form.formState.errors.lastName && (
                        <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ssn">Social Security Number*</Label>
                      <Input
                        id="ssn"
                        {...form.register("ssn")}
                        placeholder="XXX-XX-XXXX"
                        data-testid="input-ssn"
                      />
                      {form.formState.errors.ssn && (
                        <p className="text-sm text-red-600">{form.formState.errors.ssn.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        {...form.register("dateOfBirth")}
                        data-testid="input-date-of-birth"
                      />
                      {form.formState.errors.dateOfBirth && (
                        <p className="text-sm text-red-600">{form.formState.errors.dateOfBirth.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phoneNumber">Phone Number*</Label>
                      <Input
                        id="phoneNumber"
                        {...form.register("phoneNumber")}
                        placeholder="(XXX) XXX-XXXX"
                        data-testid="input-phone-number"
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-sm text-red-600">{form.formState.errors.phoneNumber.message}</p>
                      )}
                    </div>
                  </div>
                  {selectedAccountType !== "loan" && (
                    <div>
                      <Label htmlFor="initialDeposit">Initial Deposit Amount</Label>
                      <Input
                        id="initialDeposit"
                        type="number"
                        step="0.01"
                        {...form.register("initialDeposit")}
                        placeholder="0.00"
                        data-testid="input-initial-deposit"
                      />
                      {form.formState.errors.initialDeposit && (
                        <p className="text-sm text-red-600">{form.formState.errors.initialDeposit.message}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address*</Label>
                    <Input
                      id="street"
                      {...form.register("street")}
                      placeholder="123 Main Street"
                      data-testid="input-street"
                    />
                    {form.formState.errors.street && (
                      <p className="text-sm text-red-600">{form.formState.errors.street.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City*</Label>
                      <Input
                        id="city"
                        {...form.register("city")}
                        placeholder="City"
                        data-testid="input-city"
                      />
                      {form.formState.errors.city && (
                        <p className="text-sm text-red-600">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state">State*</Label>
                      <Input
                        id="state"
                        {...form.register("state")}
                        placeholder="CA"
                        maxLength={2}
                        data-testid="input-state"
                      />
                      {form.formState.errors.state && (
                        <p className="text-sm text-red-600">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code*</Label>
                      <Input
                        id="zipCode"
                        {...form.register("zipCode")}
                        placeholder="12345"
                        data-testid="input-zip-code"
                      />
                      {form.formState.errors.zipCode && (
                        <p className="text-sm text-red-600">{form.formState.errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Employment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employer">Employer*</Label>
                      <Input
                        id="employer"
                        {...form.register("employer")}
                        placeholder="Company name"
                        data-testid="input-employer"
                      />
                      {form.formState.errors.employer && (
                        <p className="text-sm text-red-600">{form.formState.errors.employer.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="jobTitle">Job Title*</Label>
                      <Input
                        id="jobTitle"
                        {...form.register("jobTitle")}
                        placeholder="Your job title"
                        data-testid="input-job-title"
                      />
                      {form.formState.errors.jobTitle && (
                        <p className="text-sm text-red-600">{form.formState.errors.jobTitle.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="annualIncome">Annual Income*</Label>
                      <Input
                        id="annualIncome"
                        type="number"
                        {...form.register("annualIncome")}
                        placeholder="50000"
                        data-testid="input-annual-income"
                      />
                      {form.formState.errors.annualIncome && (
                        <p className="text-sm text-red-600">{form.formState.errors.annualIncome.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="employmentType">Employment Type*</Label>
                      <Select onValueChange={(value) => form.setValue("employmentType", value as any)}>
                        <SelectTrigger data-testid="select-employment-type">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contractor">Contractor</SelectItem>
                          <SelectItem value="self_employed">Self Employed</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                      {form.formState.errors.employmentType && (
                        <p className="text-sm text-red-600">{form.formState.errors.employmentType.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-application"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAccountMutation.isPending}
              data-testid="button-submit-application"
            >
              {createAccountMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}