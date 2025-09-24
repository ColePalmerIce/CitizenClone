import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Youtube, ChevronRight } from "lucide-react";

interface FooterProps {
  onCreditCardClick: () => void;
}

const footerSections = [
  {
    title: "Contact",
    links: [
      { text: "Call Us", url: "https://www.firstcitizens.com/support/call-us" },
      { text: "Email Us", url: "#" },
      { text: "Careers", url: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { text: "Locations", url: "#" },
      { text: "Accessibility", url: "#" },
      { text: "Routing Number", url: "#" },
      { text: "Privacy & Security", url: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { text: "About Us", url: "#" },
      { text: "Investor Relations", url: "#" },
      { text: "Newsroom", url: "#" },
      { text: "Community Support", url: "#" },
      { text: "Terms of Use", url: "#" },
    ],
  },
  {
    title: "Banking",
    links: [
      { text: "Personal", url: "#" },
      { text: "Small Business", url: "#" }, 
      { text: "Commercial", url: "#" },
      { text: "Wealth", url: "#" },
    ],
  },
];

export default function Footer({ onCreditCardClick }: FooterProps) {
  return (
    <footer className="bg-slate-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Disclosures Section */}
        <div className="mb-8 pb-8 border-b border-slate-700">
          <Button
            variant="ghost"
            className="text-white hover:text-gray-300 hover:bg-transparent mb-4 p-0 h-auto"
            data-testid="button-disclosures"
          >
            <span className="flex items-center">
              Disclosures <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          </Button>
          <div className="text-sm text-gray-300 space-y-4">
            <p>
              This material is for informational purposes only and is not intended to be an offer, specific investment strategy, recommendation or solicitation to purchase or sell any security or insurance product, and should not be construed as legal, tax or accounting advice. Please consult with your legal or tax advisor regarding the particular facts and circumstances of your situation prior to making any financial decision. While we believe that the information presented is from reliable sources, we do not represent, warrant or guarantee that it is accurate or complete.
            </p>
            <p>Third parties mentioned are not affiliated with First Citizens Bank & Trust Company.</p>
            <p>
              Links to third-party websites may have a privacy policy different from First Citizens Bank and may provide less security than this website. First Citizens Bank and its affiliates are not responsible for the products, services and content on any third-party website.
            </p>
            <p>Bank deposit products are offered by First Citizens Bank. Member FDIC and an Equal Housing Lender. 🏠</p>
            <p>NMLS ID 503941</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-medium mb-4 text-white">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.text}>
                    {link.url !== "#" ? (
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto hover:text-gray-300 hover:bg-transparent text-gray-300 text-left justify-start flex items-center"
                        data-testid={`link-footer-${link.text.toLowerCase().replace(/\s+/g, '-')}`}
                        asChild
                      >
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {link.text} <ChevronRight className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto text-gray-500 text-left justify-start flex items-center cursor-not-allowed"
                        data-testid={`link-footer-${link.text.toLowerCase().replace(/\s+/g, '-')}`}
                        disabled
                      >
                        {link.text} <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section with Social Media and Branding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 text-gray-300 hover:text-white hover:bg-slate-700"
                data-testid="link-social-facebook"
              >
                <Facebook size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 text-gray-300 hover:text-white hover:bg-slate-700"
                data-testid="link-social-twitter"
              >
                <Twitter size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 text-gray-300 hover:text-white hover:bg-slate-700"
                data-testid="link-social-linkedin"
              >
                <Linkedin size={18} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="w-8 h-8 text-gray-300 hover:text-white hover:bg-slate-700"
                data-testid="link-social-youtube"
              >
                <Youtube size={18} />
              </Button>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-semibold text-white mb-1">forever first®</div>
            <p className="text-xs text-gray-400">
              © 2025 First Citizens Bank & Trust Company. All rights reserved. First Citizens Bank is a registered trademark of First Citizens BancShares, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
