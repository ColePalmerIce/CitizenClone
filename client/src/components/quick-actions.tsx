import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Home, TrendingUp, DollarSign, Banknote, CreditCard } from "lucide-react";

interface QuickActionsProps {
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
      // Handle mortgage journey navigation
      console.log("Navigate to mortgage journey");
      break;
    case "investing":
      // Handle investing navigation
      console.log("Navigate to self-directed investing");
      break;
    case "save":
      // Handle savings navigation
      console.log("Navigate to savings options");
      break;
    case "loan":
      // Handle loan application
      console.log("Navigate to loan application");
      break;
    case "credit-card":
      // Handle credit card selection
      console.log("Navigate to credit card selection");
      break;
    default:
      console.log("Unknown action:", actionType);
  }
};

export default function QuickActions({ onAccountClick }: QuickActionsProps) {
  return (
    <section className="bg-muted py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-6 gap-4 overflow-x-auto">
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Card 
                key={action.title} 
                className="hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 bg-white"
                onClick={() => handleActionClick(action.onClick, onAccountClick)}
                data-testid={`card-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 leading-tight">
                    {action.title}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
