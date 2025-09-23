import { Button } from "@/components/ui/button";

interface FooterProps {
  onCreditCardClick: () => void;
}

const footerSections = [
  {
    title: "Personal Banking",
    links: [
      "Checking Accounts",
      "Savings Accounts", 
      "Credit Cards",
      "Personal Loans",
      "Mortgages",
    ],
  },
  {
    title: "Business Banking",
    links: [
      "Business Checking",
      "Business Loans",
      "Merchant Services",
      "Treasury Management",
    ],
  },
  {
    title: "Investments & Wealth",
    links: [
      "Self-Directed Investing",
      "Wealth Management",
      "Financial Planning",
      "Retirement Services",
    ],
  },
  {
    title: "Support",
    links: [
      "Contact Us",
      "Find a Branch",
      "Security Center",
      "Digital Banking Help",
    ],
  },
];

const legalLinks = [
  "Privacy Policy",
  "Terms of Use", 
  "Accessibility",
  "Site Map",
];

export default function Footer({ onCreditCardClick }: FooterProps) {
  return (
    <footer className="bg-muted pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link}>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto hover:text-foreground hover:bg-transparent text-left justify-start"
                      onClick={link === "Credit Cards" ? onCreditCardClick : undefined}
                      data-testid={`link-footer-${link.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="font-semibold text-primary">First Citizens Bank</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span>Member FDIC</span>
              <span>Equal Housing Lender</span>
              <span>NMLS ID 503941</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <p className="mb-2">
              This material is for informational purposes only and is not intended to be an offer, specific investment strategy, recommendation or solicitation to purchase or sell any security or insurance product, and should not be construed as legal, tax or accounting advice.
            </p>
            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link) => (
                <Button 
                  key={link}
                  variant="ghost" 
                  className="p-0 h-auto hover:text-foreground hover:bg-transparent text-xs"
                  data-testid={`link-legal-${link.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
