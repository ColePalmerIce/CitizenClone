import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
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

        <div className="space-y-6">
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
              <Label htmlFor="user-id">ID*</Label>
              <Input 
                id="user-id" 
                type="text" 
                data-testid="input-user-id"
              />
            </div>
            <div>
              <Label htmlFor="password">Password*</Label>
              <Input 
                id="password" 
                type="password" 
                data-testid="input-password"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-secondary"
              data-testid="button-login-submit"
            >
              Log In
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
