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
    { label: "PERSONAL", href: "#" },
    { label: "SMALL BUSINESS", href: "#" },
    { label: "COMMERCIAL", href: "#" },
    { label: "WEALTH", href: "#" },
  ];

  const rightNavigationItems = [
    { label: "Support", href: "#" },
    { label: "Locations", href: "#" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="https://www.firstcitizens.com/content/dam/firstcitizens/images/logos/fcb-logo-horiz-web-2020@2x.png.transform/original/image.20230612.png" 
              alt="First Citizens Bank" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button 
                key={item.label}
                className="text-gray-700 hover:text-primary font-medium transition-colors text-sm uppercase tracking-wide"
                data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-6">
            {/* Support and Locations */}
            {rightNavigationItems.map((item) => (
              <button 
                key={item.label}
                className="text-gray-600 hover:text-primary font-medium transition-colors hidden lg:block"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchClick}
              data-testid="button-search"
              className="text-gray-600 hover:text-primary"
            >
              Search
            </Button>
            
            {/* Login */}
            <Button
              onClick={onLoginClick}
              variant="outline"
              className="border-gray-400 text-gray-900 hover:bg-gray-50"
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
                <div className="flex items-center mb-8">
                  <img 
                    src="https://www.firstcitizens.com/content/dam/firstcitizens/images/logos/fcb-logo-horiz-web-2020@2x.png.transform/original/image.20230612.png" 
                    alt="First Citizens Bank" 
                    className="h-6 w-auto"
                  />
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
                  {rightNavigationItems.map((item) => (
                    <button 
                      key={item.label}
                      className="text-left text-foreground hover:text-primary font-medium transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
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
