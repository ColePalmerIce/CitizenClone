import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import SearchDropdown from "@/components/ui/search-dropdown";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      // Clear search when modal opens
      setSearchQuery("");
    }
  }, [open]);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          userId: "anonymous"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Search results:", data);
        // Here you could show results or navigate based on the search
        onOpenChange(false); // Close modal after search
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-2xl p-0 overflow-visible border-0 shadow-none bg-transparent" 
        data-testid="modal-search"
      >
        <DialogTitle className="sr-only">Search First Citizens</DialogTitle>
        <DialogDescription className="sr-only">
          Search for banking services, account information, and financial help
        </DialogDescription>
        <div className="mt-4">
          <SearchDropdown
            placeholder="How can we help?"
            onSearch={handleSearch}
            onClose={handleClose}
            showCloseButton={true}
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full"
            inputClassName="text-lg py-4 px-6 shadow-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
