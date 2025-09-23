import { X, Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" data-testid="modal-search">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Search First Citizens</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              data-testid="button-close-search"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="What can we help you find?" 
              className="pl-10 pr-4 py-3 text-base"
              data-testid="input-search"
            />
            <Search className="h-5 w-5 absolute left-3 top-3.5 text-muted-foreground" />
          </div>
          
          {/* Search suggestions could go here */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {["Account Balance", "Transfer Money", "Pay Bills", "Find Branch", "Contact Us"].map((suggestion) => (
                <Button 
                  key={suggestion}
                  variant="outline" 
                  size="sm"
                  className="text-xs"
                  data-testid={`button-suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
