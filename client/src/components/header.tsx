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

  // Small Business Menu Data
  const smallBusinessMenuData = {
    sections: [
      {
        title: "Small Business Home",
        href: "https://www.firstcitizens.com/small-business",
        isMain: true
      },
      {
        title: "Deposits",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Checking", href: "https://www.firstcitizens.com/small-business/deposits/checking" },
          { label: "Savings", href: "https://www.firstcitizens.com/small-business/deposits/savings" },
          { label: "Money Market", href: "https://www.firstcitizens.com/small-business/deposits/money-market" },
          { label: "CDs", href: "https://www.firstcitizens.com/small-business/deposits/certificates-of-deposit" }
        ]
      },
      {
        title: "Credit & Financing",
        icon: <CreditCard className="w-4 h-4" />,
        items: [
          { label: "Business Financing", href: "https://www.firstcitizens.com/small-business/credit-financing/business-financing" },
          { label: "Business Loans", href: "https://www.firstcitizens.com/small-business/credit-financing/business-financing/business-loans" },
          { label: "Credit Cards", href: "https://www.firstcitizens.com/small-business/credit-financing/credit-cards" },
          { label: "Equipment Financing", href: "https://www.firstcitizens.com/small-business/credit-financing/equipment-financing" },
          { label: "Lines of Credit", href: "https://www.firstcitizens.com/small-business/credit-financing/business-financing/line-of-credit" },
          { label: "SBA Loans", href: "https://www.firstcitizens.com/small-business/credit-financing/business-financing/sba-loans" }
        ]
      }
    ],
    secondColumn: [
      {
        title: "Cash Management",
        icon: <DollarSign className="w-4 h-4" />,
        items: [
          { label: "ACH Services", href: "https://www.firstcitizens.com/small-business/cash-management/ach-services" },
          { label: "Fraud Prevention", href: "https://www.firstcitizens.com/small-business/cash-management/fraud-prevention" },
          { label: "Merchant Services", href: "https://www.firstcitizens.com/small-business/cash-management/merchant-services" },
          { label: "Remote Deposit", href: "https://www.firstcitizens.com/small-business/cash-management/remote-deposit" },
          { label: "Wire Services", href: "https://www.firstcitizens.com/small-business/cash-management/wire-services" },
          { label: "Payroll Services", href: "https://www.firstcitizens.com/small-business/cash-management/payroll-services" }
        ]
      },
      {
        title: "Industry Solutions",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Healthcare", href: "https://www.firstcitizens.com/small-business/expertise/healthcare" },
          { label: "Professional Services", href: "https://www.firstcitizens.com/small-business/expertise/professional-services" },
          { label: "Real Estate", href: "https://www.firstcitizens.com/small-business/expertise/real-estate" },
          { label: "Retail", href: "https://www.firstcitizens.com/small-business/expertise/retail" },
          { label: "Technology", href: "https://www.firstcitizens.com/small-business/expertise/technology" }
        ]
      }
    ],
    thirdColumn: [
      {
        title: "Digital Banking",
        icon: <CreditCard className="w-4 h-4" />,
        items: [
          { label: "Online Banking", href: "https://www.firstcitizens.com/small-business/digital-banking/online-banking" },
          { label: "Mobile Banking", href: "https://www.firstcitizens.com/small-business/digital-banking/mobile-banking" },
          { label: "Bill Pay", href: "https://www.firstcitizens.com/small-business/digital-banking/bill-pay" },
          { label: "Account Alerts", href: "https://www.firstcitizens.com/small-business/digital-banking/account-alerts" }
        ]
      },
      {
        title: "Insights",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Business Banking", href: "https://www.firstcitizens.com/small-business/insights/business-banking" },
          { label: "Cash Flow", href: "https://www.firstcitizens.com/small-business/insights/cash-flow" },
          { label: "Credit & Financing", href: "https://www.firstcitizens.com/small-business/insights/credit-financing" },
          { label: "Growth", href: "https://www.firstcitizens.com/small-business/insights/growth" },
          { label: "Industry Insights", href: "https://www.firstcitizens.com/small-business/insights/industry" },
          { label: "Operations", href: "https://www.firstcitizens.com/small-business/insights/operations" },
          { label: "Startup", href: "https://www.firstcitizens.com/small-business/insights/startup" }
        ]
      }
    ],
    rightSidebar: {
      title: "Protect against fraud",
      description: "Protect your business with comprehensive fraud prevention tools and security features.",
      cta: {
        text: "Protect Your Business",
        href: "https://www.firstcitizens.com/small-business/cash-management/fraud-prevention"
      }
    }
  };

  // Commercial Menu Data
  const commercialMenuData = {
    sections: [
      {
        title: "Commercial Home",
        href: "https://www.firstcitizens.com/commercial",
        isMain: true
      },
      {
        title: "Credit & Financing",
        icon: <CreditCard className="w-4 h-4" />,
        items: [
          { label: "Asset Based Lending", href: "https://www.firstcitizens.com/commercial/solutions/credit-financing/asset-based-lending" },
          { label: "Commercial Real Estate", href: "https://www.firstcitizens.com/commercial/solutions/credit-financing/commercial-real-estate" },
          { label: "Equipment Financing", href: "https://www.firstcitizens.com/commercial/solutions/credit-financing/equipment-financing" },
          { label: "Government Contracting", href: "https://www.firstcitizens.com/commercial/solutions/credit-financing/government-contracting" },
          { label: "Healthcare Finance", href: "https://www.firstcitizens.com/commercial/solutions/credit-financing/healthcare-finance" },
          { label: "Lines of Credit", href: "https://www.firstcitizens.com/commercial/solutions/credit-financing/lines-of-credit" },
          { label: "Term Loans", href: "https://www.firstcitizens.com/commercial/solutions/credit-financing/term-loans" }
        ]
      }
    ],
    secondColumn: [
      {
        title: "Treasury Management",
        icon: <DollarSign className="w-4 h-4" />,
        items: [
          { label: "ACH Services", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/ach-services" },
          { label: "Account Analysis", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/account-analysis" },
          { label: "Controlled Disbursements", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/controlled-disbursements" },
          { label: "Deposit Services", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/deposit-services" },
          { label: "Information Reporting", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/information-reporting" },
          { label: "Integrated Payables", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/integrated-payables" },
          { label: "Lockbox Services", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/lockbox-services" },
          { label: "Merchant Services", href: "https://www.firstcitizens.com/commercial/solutions/treasury-management/merchant-services" }
        ]
      }
    ],
    thirdColumn: [
      {
        title: "International Services",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Foreign Exchange", href: "https://www.firstcitizens.com/commercial/solutions/international-banking/foreign-exchange" },
          { label: "International Lending", href: "https://www.firstcitizens.com/commercial/solutions/international-banking/international-lending" },
          { label: "International Wire", href: "https://www.firstcitizens.com/commercial/solutions/international-banking/international-wire" },
          { label: "Letters of Credit", href: "https://www.firstcitizens.com/commercial/solutions/international-banking/letters-of-credit" },
          { label: "Trade Finance", href: "https://www.firstcitizens.com/commercial/solutions/international-banking/trade-finance" }
        ]
      },
      {
        title: "Risk Management",
        icon: <Shield className="w-4 h-4" />,
        items: [
          { label: "Insurance Services", href: "https://www.firstcitizens.com/commercial/solutions/risk-management-insurance" },
          { label: "Fraud Prevention", href: "https://www.firstcitizens.com/commercial/solutions/risk-management-insurance/fraud-prevention" }
        ]
      }
    ],
    fourthColumn: [
      {
        title: "Industry Expertise",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Automotive", href: "https://www.firstcitizens.com/commercial/expertise/automotive" },
          { label: "Construction", href: "https://www.firstcitizens.com/commercial/expertise/construction" },
          { label: "Energy", href: "https://www.firstcitizens.com/commercial/expertise/energy" },
          { label: "Government", href: "https://www.firstcitizens.com/commercial/expertise/government" },
          { label: "Healthcare", href: "https://www.firstcitizens.com/commercial/expertise/healthcare" },
          { label: "Manufacturing", href: "https://www.firstcitizens.com/commercial/expertise/manufacturing" },
          { label: "Real Estate", href: "https://www.firstcitizens.com/commercial/expertise/real-estate" },
          { label: "Technology", href: "https://www.firstcitizens.com/commercial/expertise/technology" }
        ]
      },
      {
        title: "Middle Market Banking",
        href: "https://www.firstcitizens.com/commercial/solutions/middle-market-banking",
        isMain: true
      }
    ],
    rightSidebar: {
      title: "Address risks and protect assets",
      description: "Comprehensive risk management and insurance solutions to protect your commercial enterprise.",
      cta: {
        text: "Explore Risk Management",
        href: "https://www.firstcitizens.com/commercial/solutions/risk-management-insurance"
      }
    }
  };

  // Wealth Menu Data  
  const wealthMenuData = {
    sections: [
      {
        title: "Wealth Home",
        href: "https://www.firstcitizens.com/wealth",
        isMain: true
      },
      {
        title: "Planning",
        icon: <TrendingUp className="w-4 h-4" />,
        items: [
          { label: "Financial Planning", href: "https://www.firstcitizens.com/wealth/planning/financial-planning" },
          { label: "Estate Planning", href: "https://www.firstcitizens.com/wealth/planning/estate-planning" },
          { label: "Tax Planning", href: "https://www.firstcitizens.com/wealth/planning/tax-planning" },
          { label: "Retirement Planning", href: "https://www.firstcitizens.com/wealth/planning/retirement-planning" },
          { label: "Business Succession", href: "https://www.firstcitizens.com/wealth/planning/business-succession" },
          { label: "Charitable Planning", href: "https://www.firstcitizens.com/wealth/planning/charitable-planning" }
        ]
      }
    ],
    secondColumn: [
      {
        title: "Investment Management",
        icon: <TrendingUp className="w-4 h-4" />,
        items: [
          { label: "Investment Advisory", href: "https://www.firstcitizens.com/wealth/investment-management/investment-advisory" },
          { label: "Portfolio Management", href: "https://www.firstcitizens.com/wealth/investment-management/portfolio-management" },
          { label: "Alternative Investments", href: "https://www.firstcitizens.com/wealth/investment-management/alternative-investments" },
          { label: "ESG Investing", href: "https://www.firstcitizens.com/wealth/investment-management/esg-investing" }
        ]
      },
      {
        title: "Trust & Fiduciary",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Trust Services", href: "https://www.firstcitizens.com/wealth/trust-fiduciary-services/trust-services" },
          { label: "Estate Settlement", href: "https://www.firstcitizens.com/wealth/trust-fiduciary-services/estate-settlement" },
          { label: "Investment Management", href: "https://www.firstcitizens.com/wealth/trust-fiduciary-services/investment-management" },
          { label: "Custody Services", href: "https://www.firstcitizens.com/wealth/trust-fiduciary-services/custody-services" }
        ]
      }
    ],
    thirdColumn: [
      {
        title: "Private Banking",
        icon: <CreditCard className="w-4 h-4" />,
        items: [
          { label: "Private Banking Services", href: "https://www.firstcitizens.com/wealth/private-banking" },
          { label: "Lending Solutions", href: "https://www.firstcitizens.com/wealth/private-banking/lending-solutions" },
          { label: "Deposit Services", href: "https://www.firstcitizens.com/wealth/private-banking/deposit-services" },
          { label: "Credit Solutions", href: "https://www.firstcitizens.com/wealth/private-banking/credit-solutions" }
        ]
      },
      {
        title: "Who We Help",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Individuals & Families", href: "https://www.firstcitizens.com/wealth/who-we-help/individuals-families" },
          { label: "Businesses & Corporations", href: "https://www.firstcitizens.com/wealth/who-we-help/businesses-corporations" },
          { label: "Entrepreneurs & Founders", href: "https://www.firstcitizens.com/wealth/who-we-help/entrepreneurs-founders-investors" },
          { label: "Nonprofits", href: "https://www.firstcitizens.com/wealth/who-we-help/nonprofits" }
        ]
      }
    ],
    fourthColumn: [
      {
        title: "Market Outlook",
        href: "https://www.firstcitizens.com/wealth/market-outlook",
        isMain: true
      },
      {
        title: "Institutional Trust",
        href: "https://www.firstcitizens.com/wealth/institutional-trust",
        isMain: true
      },
      {
        title: "Insights",
        icon: <Building className="w-4 h-4" />,
        items: [
          { label: "Business", href: "https://www.firstcitizens.com/wealth/insights/business" },
          { label: "Estate Planning", href: "https://www.firstcitizens.com/wealth/insights/estate-planning" },
          { label: "Investing", href: "https://www.firstcitizens.com/wealth/insights/investing" },
          { label: "Market Commentary", href: "https://www.firstcitizens.com/wealth/insights/market-commentary" },
          { label: "Philanthropy", href: "https://www.firstcitizens.com/wealth/insights/philanthropy" },
          { label: "Podcasts", href: "https://www.firstcitizens.com/wealth/insights/podcasts" },
          { label: "Tax Planning", href: "https://www.firstcitizens.com/wealth/insights/tax-planning" }
        ]
      }
    ],
    rightSidebar: {
      title: "Building More Than Business",
      description: "A podcast series for founders and CEOs exploring risks, opportunities and pivotal decisions.",
      cta: {
        text: "Listen Now",
        href: "https://www.firstcitizens.com/wealth/insights/podcasts"
      }
    }
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
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <nav className="hidden md:flex items-center space-x-8" ref={dropdownRef}>
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
                                            className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-sm block py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
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
                                            className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-sm block py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
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

                  {/* Small Business Dropdown */}
                  {item.label === 'SMALL BUSINESS' && activeDropdown === 'SMALL BUSINESS' && (
                    <div className="absolute top-full left-0 mt-1 w-screen max-w-5xl bg-white shadow-2xl border border-gray-200 rounded-lg z-50 -ml-32">
                      <div className="p-8">
                        <div className="grid grid-cols-4 gap-8">
                          {/* First Column */}
                          <div className="space-y-6">
                            {smallBusinessMenuData.sections.map((section, idx) => (
                              <div key={idx}>
                                {section.isMain ? (
                                  <a
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-semibold hover:text-blue-800 mb-4"
                                    data-testid="link-small-business-home"
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
                                            className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-sm block py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
                                            data-testid={`link-small-business-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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
                            {smallBusinessMenuData.secondColumn.map((section, idx) => (
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
                                        data-testid={`link-small-business-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                      >
                                        {item.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Third Column */}
                          <div className="space-y-6">
                            {smallBusinessMenuData.thirdColumn.map((section, idx) => (
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
                                        data-testid={`link-small-business-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                      >
                                        {item.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Right Sidebar */}
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-gray-900 font-bold text-lg mb-3">
                              {smallBusinessMenuData.rightSidebar.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                              {smallBusinessMenuData.rightSidebar.description}
                            </p>
                            <a
                              href={smallBusinessMenuData.rightSidebar.cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-white border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:border-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                              data-testid="button-protect-business"
                            >
                              {smallBusinessMenuData.rightSidebar.cta.text}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Commercial Dropdown */}
                  {item.label === 'COMMERCIAL' && activeDropdown === 'COMMERCIAL' && (
                    <div className="absolute top-full left-0 mt-1 w-screen max-w-6xl bg-white shadow-2xl border border-gray-200 rounded-lg z-50 -ml-32">
                      <div className="p-8">
                        <div className="grid grid-cols-5 gap-8">
                          {/* First Column */}
                          <div className="space-y-6">
                            {commercialMenuData.sections.map((section, idx) => (
                              <div key={idx}>
                                {section.isMain ? (
                                  <a
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-semibold hover:text-blue-800 mb-4"
                                    data-testid="link-commercial-home"
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
                                            className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-sm block py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
                                            data-testid={`link-commercial-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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
                            {commercialMenuData.secondColumn.map((section, idx) => (
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
                                        data-testid={`link-commercial-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                      >
                                        {item.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Third Column */}
                          <div className="space-y-6">
                            {commercialMenuData.thirdColumn.map((section, idx) => (
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
                                        data-testid={`link-commercial-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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
                            {commercialMenuData.fourthColumn.map((section, idx) => (
                              <div key={idx}>
                                {section.isMain ? (
                                  <a
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-semibold hover:text-blue-800 mb-4"
                                    data-testid="link-middle-market-banking"
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
                                            className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-sm block py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
                                            data-testid={`link-commercial-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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

                          {/* Right Sidebar */}
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-gray-900 font-bold text-lg mb-3">
                              {commercialMenuData.rightSidebar.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                              {commercialMenuData.rightSidebar.description}
                            </p>
                            <a
                              href={commercialMenuData.rightSidebar.cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-white border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:border-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                              data-testid="button-explore-risk-management"
                            >
                              {commercialMenuData.rightSidebar.cta.text}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wealth Dropdown */}
                  {item.label === 'WEALTH' && activeDropdown === 'WEALTH' && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[90vw] max-w-5xl bg-white shadow-2xl border border-gray-100 rounded-xl z-50 overflow-hidden"
                         style={{boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'}}>
                      <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                          {/* First Column */}
                          <div className="space-y-6">
                            {wealthMenuData.sections.map((section, idx) => (
                              <div key={idx}>
                                {section.isMain ? (
                                  <a
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-bold hover:text-blue-800 mb-6 text-base"
                                    data-testid="link-wealth-home"
                                  >
                                    {section.title}
                                  </a>
                                ) : (
                                  <div>
                                    <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 mr-3">
                                        {section.icon}
                                      </div>
                                      <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider">
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
                                            className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-sm block py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
                                            data-testid={`link-wealth-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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
                            {wealthMenuData.secondColumn.map((section, idx) => (
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
                                        data-testid={`link-wealth-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                                      >
                                        {item.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Third Column */}
                          <div className="space-y-6">
                            {wealthMenuData.thirdColumn.map((section, idx) => (
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
                                        data-testid={`link-wealth-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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
                            {wealthMenuData.fourthColumn.map((section, idx) => (
                              <div key={idx}>
                                {section.isMain ? (
                                  <a
                                    href={section.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-semibold hover:text-blue-800 mb-4"
                                    data-testid={`link-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
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
                                            className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 text-sm block py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
                                            data-testid={`link-wealth-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
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

                          {/* Right Sidebar */}
                          <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-gray-900 font-bold text-lg mb-3">
                              {wealthMenuData.rightSidebar.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                              {wealthMenuData.rightSidebar.description}
                            </p>
                            <a
                              href={wealthMenuData.rightSidebar.cta.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center bg-white border-2 border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:border-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
                              data-testid="button-listen-now"
                            >
                              {wealthMenuData.rightSidebar.cta.text}
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
            <div className="hidden md:flex items-center space-x-6">
              {/* Support */}
              <a 
                href="https://www.firstcitizens.com/support" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-600 hover:text-blue-700 font-medium transition-colors text-sm" 
                data-testid="button-support"
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Support
              </a>
              
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
                    className="md:hidden"
                    data-testid="button-mobile-menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:w-[350px] px-0">
                  {/* Clean header with logo */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <img
                      src="https://www.firstcitizens.com/etc.clientlibs/firstcitizens/clientlibs/clientlib-site/resources/fcb-main-logo.svg"
                      alt="First Citizens Bank"
                      className="h-6"
                    />
                  </div>
                  
                  {/* Simplified mobile navigation */}
                  <div className="overflow-y-auto h-full">
                    <nav className="py-6">
                      {/* Main navigation sections */}
                      <div className="space-y-1">
                        {navigationItems.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="block px-6 py-4 text-gray-900 hover:bg-gray-50 font-semibold text-lg border-b border-gray-50 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                            data-testid={`mobile-nav-${item.label.toLowerCase().replace(' ', '-')}`}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                      
                      {/* Additional services */}
                      <div className="mt-8 px-6">
                        <div className="space-y-3">
                          <a
                            href="https://www.firstcitizens.com/support"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-700 hover:text-green-700 font-medium transition-colors py-3"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <HelpCircle className="h-5 w-5 mr-3 text-green-700" />
                            Support
                          </a>
                          <button
                            className="flex items-center text-gray-700 hover:text-green-700 font-medium transition-colors py-3 w-full text-left"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <MapPin className="h-5 w-5 mr-3 text-green-700" />
                            Find a Location
                          </button>
                          <button
                            onClick={() => {
                              onSearchClick();
                              setIsMobileMenuOpen(false);
                            }}
                            className="flex items-center text-gray-700 hover:text-green-700 font-medium transition-colors py-3 w-full text-left"
                          >
                            <Search className="h-5 w-5 mr-3 text-green-700" />
                            Search
                          </button>
                        </div>
                        
                        {/* Login button */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <Button
                            onClick={() => {
                              onLoginClick();
                              setIsMobileMenuOpen(false);
                            }}
                            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 text-lg rounded-lg"
                          >
                            Log In
                          </Button>
                        </div>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}