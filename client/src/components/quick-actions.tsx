import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAccountClick: () => void;
}

const actions = [
  {
    title: "Open an account",
    subtitle: "Open a checking account",
    buttonText: "Get Started",
  },
  {
    title: "Mortgages",
    subtitle: "Start your mortgage journey",
    buttonText: "Learn More",
  },
  {
    title: "Savings",
    subtitle: "Discover ways to save", 
    buttonText: "Explore Options",
  },
  {
    title: "Loans",
    subtitle: "Apply for a loan",
    buttonText: "Apply Now",
  },
];

export default function QuickActions({ onAccountClick }: QuickActionsProps) {
  return (
    <section className="bg-muted py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <Card 
              key={action.title} 
              className="hover:shadow-md transition-shadow"
              data-testid={`card-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{action.subtitle}</p>
                <Button 
                  variant="ghost"
                  className="p-0 h-auto text-primary font-medium hover:underline hover:bg-transparent"
                  onClick={index === 0 ? onAccountClick : undefined}
                  data-testid={`button-${action.buttonText.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {action.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
