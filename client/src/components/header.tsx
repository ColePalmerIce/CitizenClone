import { useState } from "react";
import { Search, Menu, X, ChevronDown, MapPin, HelpCircle } from "lucide-react";
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

  return (
    <div className="sticky top-0 z-40">
      {/* FDIC Information Bar */}
      <div className="bg-slate-700 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="text-white font-medium">FDIC</span>
            <span className="mx-2 text-white">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
            <ChevronDown className="h-4 w-4 text-white ml-auto" />
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-border">
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
            <nav className="flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button 
                  key={item.label}
                  className="flex items-center text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm"
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <span>{item.label}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-6">
              {/* Support */}
              <button className="flex items-center text-gray-600 hover:text-blue-700 font-medium transition-colors text-sm">
                <HelpCircle className="h-4 w-4 mr-1" />
                Support
              </button>
              
              {/* Locations */}
              <button className="flex items-center text-gray-600 hover:text-blue-700 font-medium transition-colors text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                Locations
              </button>
              
              {/* Search */}
              <button
                onClick={onSearchClick}
                className="flex items-center text-gray-600 hover:text-blue-700 font-medium transition-colors text-sm"
                data-testid="button-search"
              >
                <Search className="h-4 w-4 mr-1" />
                <span>Search</span>
              </button>
              
              {/* Login */}
              <Button
                onClick={onLoginClick}
                variant="outline"
                className="border-gray-400 text-gray-900 hover:bg-gray-50 font-medium"
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
                        className="text-left text-foreground hover:text-primary font-medium transition-colors py-2 flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                    ))}
                    <button 
                      className="text-left text-foreground hover:text-primary font-medium transition-colors py-2 flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Support
                    </button>
                    <button 
                      className="text-left text-foreground hover:text-primary font-medium transition-colors py-2 flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Locations
                    </button>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}