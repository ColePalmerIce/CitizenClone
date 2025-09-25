import { Wallet, Home, TrendingUp, DollarSign, Banknote, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import AccountOpener from "@/components/modals/account-opener";
import CreditCardTool from "@/components/modals/credit-card-tool";
import SearchDropdown from "@/components/ui/search-dropdown";

interface HeroSectionProps {
  onAccountClick: () => void;
}

const actions = [
  {
    title: "Open a checking account",
    icon: Wallet,
    onClick: "account",
  },
  {
    title: "Start your mortgage journey",
    icon: Home,
    onClick: "mortgage",
  },
  {
    title: "Try Self-Directed Investing",
    icon: TrendingUp,
    onClick: "investing",
  },
  {
    title: "Discover ways to save",
    icon: DollarSign,
    onClick: "save",
  },
  {
    title: "Apply for a loan",
    icon: Banknote,
    onClick: "loan",
  },
  {
    title: "Choose a credit card",
    icon: CreditCard,
    onClick: "credit-card",
  },
];

const handleActionClick = (actionType: string, onAccountClick: () => void, setIsAccountOpenerOpen: (open: boolean) => void, setIsCreditCardToolOpen: (open: boolean) => void) => {
  switch (actionType) {
    case "account":
      setIsAccountOpenerOpen(true);
      break;
    case "mortgage":
      window.open("https://www.firstcitizens.com/personal/mortgages", "_blank");
      break;
    case "investing":
      window.open("https://www.firstcitizens.com/personal/investments/self-directed-investing", "_blank");
      break;
    case "save":
      window.open("https://www.firstcitizens.com/personal/savings", "_blank");
      break;
    case "loan":
      window.open("https://www.firstcitizens.com/personal/loans", "_blank");
      break;
    case "credit-card":
      setIsCreditCardToolOpen(true);
      break;
    default:
      console.log("Unknown action:", actionType);
  }
};

export default function HeroSection({ onAccountClick }: HeroSectionProps) {
  const [isAccountOpenerOpen, setIsAccountOpenerOpen] = useState(false);
  const [isCreditCardToolOpen, setIsCreditCardToolOpen] = useState(false);

  return (
    <section 
      className="relative bg-cover bg-center bg-no-repeat text-gray-900 overflow-hidden min-h-[600px]"
      style={{
        backgroundImage: `url('https://www.firstcitizens.com/adobe/dynamicmedia/deliver/dm-aid--643f9c8b-129d-4e4f-9b1b-70da53f214a2/personal-09-2025-2x-jpg.webp?format=webp&width=4800')`,
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full h-full flex flex-col justify-between">
        {/* Title and Start Investing Button */}
        <div className="max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            Take control of your portfolio with Self-Directed Investing
          </h1>
          
          <div className="mb-8">
            <Button 
              size="lg"
              className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg font-medium"
              data-testid="button-start-investing"
              onClick={() => window.open('https://www.firstcitizens.com/personal/investments/self-directed-investing', '_blank')}
            >
              Start Investing
            </Button>
          </div>
        </div>
        
        {/* Bottom Section with Search and Action Cards */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="w-full">
            <div className="max-w-5xl mx-auto">
              <div className="max-w-md">
                <SearchDropdown
                  placeholder="How can we help?"
                  className="w-full"
                  inputClassName="py-3 text-base rounded-lg border-2 border-gray-200 focus:border-green-700 focus:outline-none bg-white"
                  showCloseButton={true}
                  onSearch={(query) => {
                    console.log("Search query:", query);
                    // Handle search functionality here if needed
                  }}
                  onNavigate={(url) => {
                    const newWindow = window.open(url, '_blank');
                    if (newWindow) newWindow.opener = null;
                  }}
                  onModalOpen={(modalType) => {
                    switch (modalType) {
                      case 'account':
                        setIsAccountOpenerOpen(true);
                        break;
                      case 'creditCard':
                        setIsCreditCardToolOpen(true);
                        break;
                      case 'login':
                        // Handle login modal if you have one
                        console.log("Login modal requested");
                        break;
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* Action Cards */}
          <div className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
              {actions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Card 
                    key={action.title} 
                    className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 bg-white/90 backdrop-blur-sm border-gray-200"
                    onClick={() => handleActionClick(action.onClick, onAccountClick, setIsAccountOpenerOpen, setIsCreditCardToolOpen)}
                    data-testid={`card-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="mb-2 p-2 rounded-full bg-primary/10">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xs font-medium text-gray-800 leading-tight">
                        {action.title}
                      </h3>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Account Opener Modal */}
      <AccountOpener 
        open={isAccountOpenerOpen} 
        onOpenChange={setIsAccountOpenerOpen} 
      />

      {/* Credit Card Tool Modal */}
      <CreditCardTool 
        open={isCreditCardToolOpen} 
        onOpenChange={setIsCreditCardToolOpen} 
      />
    </section>
  );
}