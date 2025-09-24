import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, ChevronDown, ChevronUp, MapPin, HelpCircle, ArrowRight, CreditCard, TrendingUp, Home, Car, Shield, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  onLoginClick: () => void;
  onSearchClick: () => void;
}

export default function Header({ onLoginClick, onSearchClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFdicExpanded, setIsFdicExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigationItems = [
    { label: "PERSONAL", href: "#" },
    { label: "SMALL BUSINESS", href: "#" },
    { label: "COMMERCIAL", href: "#" },
    { label: "WEALTH", href: "#" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const personalMenuData = {
    sections: [
      {
        title: "Personal Home",
        href: "https://www.firstcitizens.com/personal",
        isMain: true
      },
      {
        title: "Checking",
        icon: <CreditCard className="w-4 h-4" />,
        items: [
          { label: "Primary Checking", href: "https://www.firstcitizens.com/personal/checking/primary" },
          { label: "Premier Checking", href: "https://www.firstcitizens.com/personal/checking/premier" },
          { label: "Prestige Checking", href: "https://www.firstcitizens.com/personal/checking/prestige" },
          { label: "Compare", href: "https://www.firstcitizens.com/personal/checking/compare" }
        ]
      },
      {
        title: "Savings",
        icon: <DollarSign className="w-4 h-4" />,
        items: [
          { label: "Certificates of Deposit", href: "https://www.firstcitizens.com/personal/savings/certificates-of-deposit" },
          { label: "Money Market", href: "https://www.firstcitizens.com/personal/savings/money-market" },
          { label: "Online Savings", href: "https://www.firstcitizens.com/personal/savings/online" }
        ]
      },
      {
        title: "Credit Cards",
        icon: <CreditCard className="w-4 h-4" />,
        items: [
          { label: "Compare", href: "https://www.firstcitizens.com/personal/credit-cards/compare" },
          { label: "Cash Rewards", href: "https://www.firstcitizens.com/personal/credit-cards/cash-rewards" },
          { label: "Rewards", href: "https://www.firstcitizens.com/personal/credit-cards/rewards" },
          { label: "Secured Cash Back", href: "https://www.firstcitizens.com/personal/credit-cards/secured" },
          { label: "Smart Option", href: "https://www.firstcitizens.com/personal/credit-cards/low-interest" },
          { label: "Travel Rewards", href: "https://www.firstcitizens.com/personal/credit-cards/travel-rewards" }
        ]
      }
    ],
    secondColumn: [
      {
        title: "Premier Banking",
        href: "https://www.firstcitizens.com/personal/premier-banking",
        isMain: true
      },
      {
        title: "Mortgages",
        icon: <Home className="w-4 h-4" />,
        items: [
          { label: "Adjustable-Rate Mortgages", href: "https://www.firstcitizens.com/personal/mortgages/adjustable-rate" },
          { label: "Fixed-Rate Mortgages", href: "https://www.firstcitizens.com/personal/mortgages/fixed-rate" },
          { label: "Home Construction Loans", href: "https://www.firstcitizens.com/personal/mortgages/construction" },
          { label: "Jumbo Loans", href: "https://www.firstcitizens.com/personal/mortgages/jumbo" },
          { label: "Medical Professional Mortgages", href: "https://www.firstcitizens.com/personal/mortgages/medical-professional" },
          { label: "Mortgage Refinancing", href: "https://www.firstcitizens.com/personal/mortgages/refinancing" },
          { label: "Renovation Loans", href: "https://www.firstcitizens.com/personal/mortgages/renovation" },
          { label: "VA, FHA and USDA Loans", href: "https://www.firstcitizens.com/personal/mortgages/government" }
        ]
      },
      {
        title: "Loans",
        icon: <Car className="w-4 h-4" />,
        items: [
          { label: "Auto Loans", href: "https://www.firstcitizens.com/personal/loans/auto" },
          { label: "Home Equity", href: "https://www.firstcitizens.com/personal/loans/home-equity" },
          { label: "Home Improvement Loans", href: "https://www.firstcitizens.com/personal/loans/home-improvement" },
          { label: "Specialized Lending", href: "https://www.firstcitizens.com/personal/loans/specialized" }
        ]
      }
    ],
    thirdColumn: [
      {
        title: "Retirement",
        icon: <TrendingUp className="w-4 h-4" />,
        items: [
          { label: "Traditional IRA", href: "https://www.firstcitizens.com/personal/retirement/traditional-ira" },
          { label: "Roth IRA", href: "https://www.firstcitizens.com/personal/retirement/roth-ira" },
          { label: "SEP IRA", href: "https://www.firstcitizens.com/personal/retirement/sep-ira" },
          { label: "SIMPLE IRA", href: "https://www.firstcitizens.com/personal/retirement/simple-ira" }
        ]
      },
      {
        title: "Investments",
        icon: <TrendingUp className="w-4 h-4" />,
        items: [
          { label: "Self-Directed Investing", href: "https://www.firstcitizens.com/personal/investments/self-directed-investing" },
          { label: "Education Savings Accounts", href: "https://www.firstcitizens.com/personal/investments/education-savings" }
        ]
      },
      {
        title: "Insurance",
        icon: <Shield className="w-4 h-4" />,
        items: [
          { label: "Accident Insurance", href: "https://www.firstcitizens.com/personal/insurance/accident" },
          { label: "Life Insurance", href: "https://www.firstcitizens.com/personal/insurance/life" },
          { label: "Pet Insurance", href: "https://www.firstcitizens.com/personal/insurance/pet" },
          { label: "Property Insurance", href: "https://www.firstcitizens.com/personal/insurance/property" },
          { label: "Umbrella Insurance Policy", href: "https://www.firstcitizens.com/personal/insurance/umbrella" },
          { label: "Vehicle Insurance", href: "https://www.firstcitizens.com/personal/insurance/vehicle" }
        ]
      }
    ],
    fourthColumn: [
      {
        title: "Insights",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Banking", href: "https://www.firstcitizens.com/personal/insights/banking" },
          { label: "Budgeting", href: "https://www.firstcitizens.com/personal/insights/budgeting" },
          { label: "Calculators", href: "https://www.firstcitizens.com/personal/insights/calculators" },
          { label: "Career", href: "https://www.firstcitizens.com/personal/insights/career" },
          { label: "College", href: "https://www.firstcitizens.com/personal/insights/college" },
          { label: "Credit", href: "https://www.firstcitizens.com/personal/insights/credit" },
          { label: "Debt", href: "https://www.firstcitizens.com/personal/insights/debt" },
          { label: "Family", href: "https://www.firstcitizens.com/personal/insights/family" },
          { label: "Home", href: "https://www.firstcitizens.com/personal/insights/home" },
          { label: "Insurance", href: "https://www.firstcitizens.com/personal/insights/insurance" },
          { label: "Investing", href: "https://www.firstcitizens.com/personal/insights/investing" },
          { label: "Retirement", href: "https://www.firstcitizens.com/personal/insights/retirement" },
          { label: "Saving", href: "https://www.firstcitizens.com/personal/insights/saving" },
          { label: "Security", href: "https://www.firstcitizens.com/personal/insights/security" },
          { label: "Taxes", href: "https://www.firstcitizens.com/personal/insights/taxes" },
          { label: "Videos", href: "https://www.firstcitizens.com/personal/insights/videos" }
        ]
      }
    ],
    rightSidebar: {
      title: "Control your portfolio",
      description: "Invest how you want, when you want, in real time with Self-Directed Investing.",
      cta: {
        text: "Start Online",
        href: "https://www.firstcitizens.com/personal/investments/self-directed-investing"
      }
    }
  };

  return (
    <div className="sticky top-0 z-40">
      {/* FDIC Information Bar */}
      <div className="bg-slate-700 text-white text-sm">
        {/* Collapsed Banner */}
        <div 
          className="py-2 cursor-pointer hover:bg-slate-600 transition-colors duration-200"
          onClick={() => setIsFdicExpanded(!isFdicExpanded)}
          data-testid="fdic-banner"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <span className="text-white font-bold">FDIC</span>
              <span className="mx-2 text-white">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
              {isFdicExpanded ? (
                <ChevronUp className="h-4 w-4 text-white ml-auto transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-white ml-auto transition-transform duration-200" />
              )}
            </div>
          </div>
        </div>
        
        {/* Expanded Content */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isFdicExpanded ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="border-t border-slate-600 bg-slate-700 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BankFind Section */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-slate-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">BankFind</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      This bank is insured by the Federal Deposit Insurance Corporation. The FDIC Certificate ID is 11043.
                      Click on the Certificate ID # to confirm this bank's FDIC coverage using the FDIC's BankFind tool.
                    </p>
                  </div>
                </div>

                {/* EDIE Section */}
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <HelpCircle className="w-4 h-4 text-slate-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">EDIE</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      EDIE lets consumers and bankers know, on a per-bank basis, how the insurance rules and limits apply to
                      a depositor's accounts—what's insured and what portion (if any) exceeds coverage limits at that bank.
                      Check your deposit insurance coverage {'>>'} 
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
            <nav className="flex items-center space-x-8" ref={dropdownRef}>
              {navigationItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(item.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button 
                    className="flex items-center text-gray-700 hover:text-blue-700 font-medium transition-colors text-sm"
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </button>

                  {/* Personal Dropdown */}
                  {item.label === 'PERSONAL' && activeDropdown === 'PERSONAL' && (
                    <div className="absolute top-full left-0 mt-1 w-screen max-w-6xl bg-white shadow-2xl border border-gray-200 rounded-lg z-50 -ml-32">
                      <div className="p-8">
                        <div className="grid grid-cols-5 gap-8">
                          {/* First Column */}
                          <div className="space-y-6">
                            {personalMenuData.sections.map((section, idx) => (
                              <div key={idx}>
                                {section.isMain ? (
                                  <a
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-semibold hover:text-blue-800 mb-4"
                                    data-testid="link-personal-home"
                                  >
                                    {section.title}
                                  </a>
                                ) : (
                                  <div>
                                    <div className="flex items-center mb-3">
                                      {section.icon}
                                      <h3 className="text-gray-900 font-semibold ml-2 text-sm uppercase tracking-wide">
                                        {section.title}
                                      </h3>
                                    </div>
                                    <ul className="space-y-2">
                                      {section.items?.map((item, itemIdx) => (
                                        <li key={itemIdx}>
                                          <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-600 text-sm block py-1"
                                            data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                          >
                                            {item.label}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Second Column */}
                          <div className="space-y-6">
                            {personalMenuData.secondColumn.map((section, idx) => (
                              <div key={idx}>
                                {section.isMain ? (
                                  <a
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-semibold hover:text-blue-800 mb-4"
                                    data-testid="link-premier-banking"
                                  >
                                    {section.title}
                                  </a>
                                ) : (
                                  <div>
                                    <div className="flex items-center mb-3">
                                      {section.icon}
                                      <h3 className="text-gray-900 font-semibold ml-2 text-sm uppercase tracking-wide">
                                        {section.title}
                                      </h3>
                                    </div>
                                    <ul className="space-y-2">
                                      {section.items?.map((item, itemIdx) => (
                                        <li key={itemIdx}>
                                          <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-600 text-sm block py-1"
                                            data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                          >
                                            {item.label}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Third Column */}
                          <div className="space-y-6">
                            {personalMenuData.thirdColumn.map((section, idx) => (
                              <div key={idx}>
                                <div className="flex items-center mb-3">
                                  {section.icon}
                                  <h3 className="text-gray-900 font-semibold ml-2 text-sm uppercase tracking-wide">
                                    {section.title}
                                  </h3>
                                </div>
                                <ul className="space-y-2">
                                  {section.items?.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                      <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-blue-600 text-sm block py-1"
                                        data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                      >
                                        {item.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Fourth Column */}
                          <div className="space-y-6">
                            {personalMenuData.fourthColumn.map((section, idx) => (
                              <div key={idx}>
                                <div className="flex items-center mb-3">
                                  {section.icon}
                                  <h3 className="text-gray-900 font-semibold ml-2 text-sm uppercase tracking-wide">
                                    {section.title}
                                  </h3>
                                </div>
                                <ul className="space-y-2">
                                  {section.items?.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                      <a
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-blue-600 text-sm block py-1"
                                        data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                      >
                                        {item.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Right Sidebar - Portfolio Control */}
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-gray-900 font-bold text-lg mb-3">
                              {personalMenuData.rightSidebar.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                              {personalMenuData.rightSidebar.description}
                            </p>
                            <a
                              href={personalMenuData.rightSidebar.cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-white border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:border-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                              data-testid="button-start-online"
                            >
                              {personalMenuData.rightSidebar.cta.text}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-6">
              {/* Support */}
              <button className="flex items-center text-gray-600 hover:text-blue-700 font-medium transition-colors text-sm" data-testid="button-support">
                <HelpCircle className="h-4 w-4 mr-1" />
                Support
              </button>
              
              {/* Locations */}
              <button className="flex items-center text-gray-600 hover:text-blue-700 font-medium transition-colors text-sm" data-testid="button-locations">
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