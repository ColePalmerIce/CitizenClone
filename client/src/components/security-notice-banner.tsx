import { useState, useEffect } from "react";
import { Shield, X, CheckCircle, Lock } from "lucide-react";

export default function SecurityNoticeBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't dismissed it in the last 24 hours
    const lastDismissed = localStorage.getItem('security-notice-dismissed');
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    if (!lastDismissed || parseInt(lastDismissed) < oneDayAgo) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('security-notice-dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900 text-white border-b border-slate-700" data-testid="security-notice-banner">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-400 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">FDIC-Insured</span>
              <span className="mx-2">•</span>
              <span>Your deposits are protected up to $250,000 per account</span>
              <span className="mx-2">•</span>
              <span className="text-green-400">256-bit SSL Encryption</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Lock className="w-3 h-3 text-green-400" />
              <span>Secure Session</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors"
              data-testid="button-dismiss-security-notice"
              aria-label="Dismiss security notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}