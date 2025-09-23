import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CreditCardToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Answer = "flexible-rewards" | "cash-back" | "low-interest" | "no-fee";

const recommendations = {
  "flexible-rewards": {
    title: "Travel Rewards Card",
    description: "Earn more points on travel and get exclusive travel rewards.",
    features: ["Earn rewards faster", "Use rewards for exclusive travel experiences", "Get an introductory balance transfer offer"],
  },
  "cash-back": {
    title: "Cash Rewards Card", 
    description: "Transform everyday purchases into unlimited cash back.",
    features: ["Earn cash back", "Use rewards as statement credits", "Get an introductory balance transfer offer"],
  },
  "low-interest": {
    title: "Smart Option Card",
    description: "Get our lowest available rate.",
    features: ["Consolidate higher interest rate balances", "Pay no annual fee", "Get an introductory balance transfer offer"],
  },
  "no-fee": {
    title: "Rewards Card",
    description: "Earn more points on special spending categories.",
    features: ["Earn rewards", "Pay no annual fee", "Get an introductory balance transfer offer"],
  },
};

export default function CreditCardTool({ open, onOpenChange }: CreditCardToolProps) {
  const [step, setStep] = useState<'question' | 'result'>('question');
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);

  const handleAnswer = (answer: Answer) => {
    setSelectedAnswer(answer);
    setStep('result');
  };

  const handleStartOver = () => {
    setStep('question');
    setSelectedAnswer(null);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep('question');
      setSelectedAnswer(null);
    }, 200);
  };

  const recommendation = selectedAnswer ? recommendations[selectedAnswer] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-credit-card-tool">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Get a credit card recommendation</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              data-testid="button-close-cc-tool"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {step === 'question' && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium">What are you looking for most in a credit card?</h4>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto hover:bg-muted"
                  onClick={() => handleAnswer('flexible-rewards')}
                  data-testid="button-answer-flexible-rewards"
                >
                  Flexible rewards
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto hover:bg-muted"
                  onClick={() => handleAnswer('cash-back')}
                  data-testid="button-answer-cash-back"
                >
                  Cash back
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto hover:bg-muted"
                  onClick={() => handleAnswer('low-interest')}
                  data-testid="button-answer-low-interest"
                >
                  A low interest rate
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto hover:bg-muted"
                  onClick={() => handleAnswer('no-fee')}
                  data-testid="button-answer-no-fee"
                >
                  No annual fee
                </Button>
              </div>
            </div>
          )}

          {step === 'result' && recommendation && (
            <div className="space-y-6">
              <h4 className="text-lg font-medium">Based on your answers, here's what we recommend</h4>
              <Card className="bg-accent text-accent-foreground">
                <CardContent className="p-6">
                  <h5 className="text-xl font-semibold mb-2">Recommended: {recommendation.title}</h5>
                  <p className="mb-4">{recommendation.description}</p>
                  <ul className="list-disc list-inside space-y-1 mb-6">
                    {recommendation.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <Button 
                    className="bg-white text-accent hover:bg-gray-100"
                    data-testid="button-cc-learn-more"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Still not sure?</p>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline"
                    data-testid="button-compare-accounts"
                  >
                    Compare Accounts
                  </Button>
                  <Button 
                    variant="ghost"
                    className="text-primary hover:underline"
                    onClick={handleStartOver}
                    data-testid="button-start-over"
                  >
                    Start Over
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
