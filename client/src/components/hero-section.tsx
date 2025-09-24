import { Search, X, Wallet, Home, TrendingUp, DollarSign, Banknote, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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

const handleActionClick = (actionType: string, onAccountClick: () => void) => {
  switch (actionType) {
    case "account":
      onAccountClick();
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
      console.log("Navigate to loan application");
      break;
    case "credit-card":
      console.log("Navigate to credit card selection");
      break;
    default:
      console.log("Unknown action:", actionType);
  }
};

export default function HeroSection({ onAccountClick }: HeroSectionProps) {
  return (
    <section 
      className="relative bg-cover bg-center bg-no-repeat text-gray-900 overflow-hidden min-h-[600px]"
      style={{
        backgroundImage: `url('https://www.firstcitizens.com/adobe/dynamicmedia/deliver/dm-aid--643f9c8b-129d-4e4f-9b1b-70da53f214a2/personal-09-2025-2x-jpg.webp?format=webp&width=4800')`,
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full h-full flex flex-col justify-between">
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
              <div className="relative max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input 
                    type="text" 
                    placeholder="How can we help?"
                    className="pl-10 pr-10 py-3 w-full bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-700 focus:border-transparent"
                    data-testid="input-help-search"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                    data-testid="button-clear-search"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </Button>
                </div>
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
                    onClick={() => handleActionClick(action.onClick, onAccountClick)}
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
    </section>
  );
}