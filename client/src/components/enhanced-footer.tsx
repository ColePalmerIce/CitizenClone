import { Shield, Lock, Globe, Phone, MapPin, Mail, CreditCard } from "lucide-react";

interface EnhancedFooterProps {
  onCreditCardClick?: () => void;
}

export default function EnhancedFooter({ onCreditCardClick }: EnhancedFooterProps) {
  return (
    <footer className="bg-slate-900 text-white" data-testid="enhanced-footer">
      {/* Security Badges Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">FDIC Insured</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Equal Housing Lender</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold">
                MEMBER FDIC
              </div>
              <div className="bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold">
                EQUAL HOUSING ⚊
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1-800-FIRST-CB</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@firstcitizens.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div>First Citizens Bank</div>
                  <div>4300 Six Forks Road</div>
                  <div>Raleigh, NC 27609</div>
                </div>
              </div>
            </div>
          </div>

          {/* Banking Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Banking Services</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Personal Banking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Business Banking</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Wealth Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Loans & Credit</a></li>
              <li>
                <button 
                  onClick={onCreditCardClick}
                  className="hover:text-white transition-colors text-left flex items-center gap-1"
                  data-testid="footer-credit-cards"
                >
                  <CreditCard className="w-3 h-3" />
                  Credit Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal & Security</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility Statement</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fraud Prevention</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Center</a></li>
            </ul>
          </div>

          {/* About & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Company Overview</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press Releases</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community Impact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Branch Locator</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Disclaimers */}
      <div className="border-t border-slate-700 bg-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="space-y-4 text-xs text-gray-400">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-gray-300">FDIC Certificate #14236</span>
              <span>•</span>
              <span>Member FDIC</span>
              <span>•</span>
              <span>Equal Housing Lender</span>
              <span>•</span>
              <span>NMLS ID #433960</span>
            </div>
            
            <div className="space-y-2">
              <p>
                <strong>Investment products:</strong> NOT FDIC INSURED • NOT BANK GUARANTEED • MAY LOSE VALUE
              </p>
              <p>
                First Citizens Bank is a Member FDIC and an Equal Housing Lender. Your deposits are insured by the FDIC up to the maximum amount allowed by law. 
                Credit and lending products are subject to credit approval.
              </p>
              <p>
                This website is for informational purposes only and does not constitute an offer or solicitation to buy or sell any security. 
                Products and services may not be available in all areas.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-600">
              <div>
                © 2025 First Citizens Bank. All rights reserved.
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span>Site Map</span>
                <span>•</span>
                <span>Contact Us</span>
                <span>•</span>
                <span>Routing Number: Various</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}