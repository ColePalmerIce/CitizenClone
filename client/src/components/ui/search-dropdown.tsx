import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchDropdownProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClose?: () => void;
  onNavigate?: (url: string) => void;
  onModalOpen?: (modalType: 'account' | 'creditCard' | 'login') => void;
  className?: string;
  inputClassName?: string;
  showCloseButton?: boolean;
  suggestions?: SuggestionItem[];
  value?: string;
  onChange?: (value: string) => void;
}

interface SuggestionItem {
  text: string;
  action: 'navigate' | 'modal' | 'search';
  target?: string;
  modalType?: 'account' | 'creditCard' | 'login';
}

const defaultSuggestions: SuggestionItem[] = [
  { text: "Open a checking account", action: "modal", modalType: "account" },
  { text: "How can I save for my kid's college?", action: "navigate", target: "https://www.firstcitizens.com/personal/savings/college-savings" },
  { text: "Merchant account for my business", action: "navigate", target: "https://www.firstcitizens.com/small-business" },
  { text: "Branches near me", action: "navigate", target: "https://locations.firstcitizens.com/" },
  { text: "Mortgage banker near me", action: "navigate", target: "https://www.firstcitizens.com/personal/mortgages" },
  { text: "Business banker near me", action: "navigate", target: "https://www.firstcitizens.com/small-business/deposits/checking" },
  { text: "Apply for a credit card", action: "modal", modalType: "creditCard" },
  { text: "Transfer money", action: "modal", modalType: "login" },
  { text: "Pay bills online", action: "modal", modalType: "login" },
  { text: "Account balance", action: "modal", modalType: "login" },
  { text: "Find ATM locations", action: "navigate", target: "https://locations.firstcitizens.com/" },
  { text: "Investment options", action: "navigate", target: "https://www.firstcitizens.com/personal/investments" }
];

export default function SearchDropdown({
  placeholder = "How can we help?",
  onSearch,
  onClose,
  onNavigate,
  onModalOpen,
  className,
  inputClassName,
  showCloseButton = false,
  suggestions = defaultSuggestions,
  value = "",
  onChange
}: SearchDropdownProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [query, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    if (onChange) {
      onChange(newValue);
    }
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: SuggestionItem) => {
    setQuery(suggestion.text);
    if (onChange) {
      onChange(suggestion.text);
    }
    
    // Handle different suggestion actions
    switch (suggestion.action) {
      case 'navigate':
        if (suggestion.target && onNavigate) {
          onNavigate(suggestion.target);
        } else if (suggestion.target) {
          const newWindow = window.open(suggestion.target, '_blank');
          if (newWindow) newWindow.opener = null;
        }
        break;
      case 'modal':
        if (suggestion.modalType && onModalOpen) {
          onModalOpen(suggestion.modalType);
        }
        break;
      case 'search':
      default:
        if (onSearch) {
          onSearch(suggestion.text);
        }
        break;
    }
    
    setIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query) {
      onSearch(query);
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    if (onChange) {
      onChange("");
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-lg", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onClick={handleInputClick}
            className={cn(
              "pl-10 pr-12 py-3 text-base rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white",
              inputClassName
            )}
            data-testid="input-search-dropdown"
          />
          <Search className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
          {showCloseButton && (query || isOpen) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              data-testid="button-close-search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>

      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
          data-testid="dropdown-search-suggestions"
        >
          <div className="p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Some suggested searches:
            </p>
            <div className="space-y-2">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.text}-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors focus:outline-none focus:bg-blue-50 focus:text-blue-600"
                  data-testid={`button-suggestion-${index}`}
                >
                  {suggestion.text}
                </button>
              ))}
              {filteredSuggestions.length === 0 && query && (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  No suggestions found for "{query}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}