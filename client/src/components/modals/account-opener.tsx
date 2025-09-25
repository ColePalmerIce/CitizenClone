import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AccountOpenerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AccountOpener({ open, onOpenChange }: AccountOpenerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="modal-account-opener">
        <DialogTitle className="text-xl font-semibold">Open a Personal Account</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Choose whether you already have a checking account with us to get started with the right option.
        </DialogDescription>
        
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              data-testid="button-close-account-opener"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-medium">Do you have a First Citizens checking account?</h4>
            
            <div className="space-y-3">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h5 className="font-semibold mb-2">Yes</h5>
                  <p className="text-sm text-muted-foreground mb-4">I want to open another account.</p>
                  <Button 
                    className="w-full"
                    data-testid="button-yes-have-account"
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h5 className="font-semibold mb-2">No</h5>
                  <p className="text-sm text-muted-foreground mb-4">I want to open a checking account.</p>
                  <Button 
                    className="w-full"
                    data-testid="button-no-need-account"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Looking to open a small business account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary"
                data-testid="link-small-business"
              >
                Get started
              </Button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
