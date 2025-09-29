import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | 'access-code'>('credentials');
  const [tempUserId, setTempUserId] = useState<string | null>(null);
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/user/login', { username, password });
      const user = await response.json();
      
      // Store temporary user data
      setTempUserId(user.id);
      setTempUserData(user);
      
      // Move to access code step
      setStep('access-code');
      
      toast({
        title: "Credentials verified",
        description: "Please enter your access code to complete login",
      });
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Please check your username and password";
      
      if (error.message) {
        const match = error.message.match(/^\d+:\s*(.+)$/);
        if (match) {
          errorMessage = match[1];
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode) {
      toast({
        title: "Access code required",
        description: "Please enter your access code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/auth/validate-access-code', { 
        code: accessCode, 
        userId: tempUserId 
      });
      
      const result = await response.json();
      
      if (result.valid) {
        // Store user info in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(tempUserData));
        
        toast({
          title: "Login successful",
          description: `${getTimeGreeting()}, ${tempUserData.firstName || tempUserData.username}!`,
        });
        
        onOpenChange(false);
        
        // Reset form
        setUsername("");
        setPassword("");
        setAccessCode("");
        setStep('credentials');
        setTempUserId(null);
        setTempUserData(null);
        
        setTimeout(() => {
          setLocation("/dashboard");
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('Access code validation error:', error);
      
      let errorMessage = "Invalid or expired access code";
      
      if (error.message) {
        const match = error.message.match(/^\d+:\s*(.+)$/);
        if (match) {
          errorMessage = match[1];
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Access code validation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-login">
        <DialogTitle className="text-lg font-semibold">Welcome Back</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Sign in to access your First Citizens Bank account and manage your finances securely.
        </DialogDescription>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img 
              src="https://www.firstcitizens.com/content/dam/firstcitizens/images/logos/fcb-logo-horiz-web-2020@2x.png.transform/original/image.20230612.png" 
              alt="First Citizens Bank" 
              className="h-6 w-auto"
            />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onOpenChange(false)}
            data-testid="button-close-login"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            <div>
              <Label htmlFor="login-type">Login Type</Label>
              <Select defaultValue="digital-banking">
                <SelectTrigger data-testid="select-login-type">
                  <SelectValue placeholder="Select login type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital-banking">First Citizens Digital Banking</SelectItem>
                  <SelectItem value="commercial-advantage">Commercial Advantage</SelectItem>
                  <SelectItem value="wealth">Wealth</SelectItem>
                  <SelectItem value="other-services">Other Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="user-id">Username*</Label>
                <Input 
                  id="user-id" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  data-testid="input-user-id"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password*</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  data-testid="input-password"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                disabled={isLoading}
                data-testid="button-login-submit"
              >
                {isLoading ? "Verifying..." : "Continue"}
              </Button>
              <div className="text-center text-sm space-y-2">
                <div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    data-testid="link-enroll-now"
                  >
                    Enroll Now
                  </Button>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    data-testid="link-forgot-id"
                  >
                    Forgot ID
                  </Button>
                  <span className="mx-2 text-muted-foreground">/</span>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    data-testid="link-forgot-password"
                  >
                    Password?
                  </Button>
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary"
                  data-testid="link-first-time-login"
                >
                  First Time Log In
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAccessCodeSubmit} className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-blue-700">
                For your security, please enter the access code provided by your bank administrator. This code is valid for 10 minutes.
              </p>
            </div>

            <div>
              <Label htmlFor="access-code">Access Code*</Label>
              <Input 
                id="access-code" 
                type="text" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter 6-digit access code"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                data-testid="input-access-code"
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                Contact your bank administrator if you don't have an access code
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-secondary"
                disabled={isLoading}
                data-testid="button-access-code-submit"
              >
                {isLoading ? "Validating..." : "Complete Login"}
              </Button>
              <Button 
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStep('credentials');
                  setAccessCode('');
                  setTempUserId(null);
                  setTempUserData(null);
                }}
                data-testid="button-back-to-credentials"
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
