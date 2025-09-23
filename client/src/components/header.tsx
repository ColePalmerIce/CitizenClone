import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onLoginClick: () => void;
  onSearchClick: () => void;
}

export default function Header({ onLoginClick, onSearchClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "Personal", href: "#" },
    { label: "Small Business", href: "#" },
    { label: "Commercial", href: "#" },
    { label: "Wealth", href: "#" },
    { label: "About Us", href: "#" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">FC</span>
            </div>
            <span className="text-xl font-semibold text-primary">First Citizens</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button 
                key={item.label}
                className="text-foreground hover:text-primary font-medium transition-colors"
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Login */}
            <Button
              onClick={onLoginClick}
              className="bg-primary text-primary-foreground hover:bg-secondary"
              data-testid="button-login"
            >
              Log In
            </Button>

            {/* Mobile menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FC</span>
                  </div>
                  <span className="text-lg font-semibold text-primary">First Citizens</span>
                </div>
                <nav className="flex flex-col space-y-4">
                  {navigationItems.map((item) => (
                    <button 
                      key={item.label}
                      className="text-left text-foreground hover:text-primary font-medium transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
