import { useState, useEffect } from "react";
import { Cookie, CheckCircle, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't given consent
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now()
    }));
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now()
    }));
    setIsVisible(false);
  };

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-2xl z-50" data-testid="cookie-consent-banner">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your Privacy Matters to Us
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              First Citizens Bank uses cookies and similar technologies to enhance your banking experience, 
              provide personalized services, and ensure the security of your financial information. 
              By continuing to use our website, you consent to our use of cookies as outlined in our 
              <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a> and 
              <a href="#" className="text-blue-600 hover:underline ml-1">Cookie Policy</a>.
            </p>

            {showDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Necessary Cookies</div>
                      <div className="text-gray-600">Essential for banking security and website functionality</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Analytics Cookies</div>
                      <div className="text-gray-600">Help us improve our services and user experience</div>
                    </div>
                    <div className="text-xs text-gray-500">Optional</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Marketing Cookies</div>
                      <div className="text-gray-600">Personalize offers and financial product recommendations</div>
                    </div>
                    <div className="text-xs text-gray-500">Optional</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={handleAcceptAll}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-accept-all-cookies"
              >
                Accept All Cookies
              </Button>
              
              <Button 
                onClick={handleAcceptNecessary}
                variant="outline"
                className="border-gray-300"
                data-testid="button-accept-necessary-cookies"
              >
                Accept Necessary Only
              </Button>
              
              <Button 
                onClick={handleCustomize}
                variant="ghost"
                className="text-blue-600 hover:bg-blue-50"
                data-testid="button-customize-cookies"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showDetails ? 'Hide Details' : 'Customize Settings'}
              </Button>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Last updated: September 2025 • Questions? Contact us at 
              <a href="tel:1-800-FIRST-CB" className="text-blue-600 hover:underline ml-1">1-800-FIRST-CB</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}