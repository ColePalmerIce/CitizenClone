import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

interface WelcomeNoticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WelcomeNoticeModal({ open, onOpenChange }: WelcomeNoticeModalProps) {
  const [currentTab, setCurrentTab] = useState("security");

  const tabs = [
    { id: "security", label: "Security Notice", icon: Shield },
    { id: "fraud", label: "Fraud Alerts", icon: AlertTriangle },
    { id: "compliance", label: "Compliance", icon: CheckCircle },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0" data-testid="welcome-notice-modal">
        <DialogHeader className="border-b bg-blue-900 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <DialogTitle className="text-xl font-semibold">
                Welcome to First Citizens Bank
              </DialogTitle>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-blue-200 hover:text-white transition-colors"
              data-testid="button-close-welcome-modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-2">
            Important information about your banking security and our commitment to protecting your financial future
          </p>
        </DialogHeader>

        <div className="flex">
          {/* Tab Navigation */}
          <div className="w-64 bg-gray-50 border-r">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                      currentTab === tab.id
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    data-testid={`tab-${tab.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
            {currentTab === "security" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Your Security is Our Priority
                </h3>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">FDIC Insured</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your deposits are protected up to $250,000 per depositor, per insured bank, 
                        for each account ownership category.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-blue-900">256-bit SSL Encryption</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      All data transmission between your device and our servers is encrypted 
                      using industry-standard security protocols.
                    </p>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-purple-600" />
                      <h4 className="font-medium text-purple-900">Multi-Factor Authentication</h4>
                    </div>
                    <p className="text-sm text-purple-700">
                      Additional security layers protect your account from unauthorized access, 
                      including SMS and email verification.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Important Security Reminder</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        First Citizens Bank will never ask for your login credentials, SSN, or account 
                        information via email, text, or phone. Always verify communications through 
                        official channels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentTab === "fraud" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Fraud Protection & Awareness
                </h3>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-900 mb-2">Current Fraud Alerts</h4>
                  <ul className="space-y-2 text-sm text-red-700">
                    <li>• Phishing emails claiming to be from "Account Security Team"</li>
                    <li>• Text messages requesting immediate account verification</li>
                    <li>• Phone calls claiming suspicious activity requiring immediate action</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Protect Yourself:</h4>
                  <div className="space-y-2">
                    {[
                      "Never share your login credentials with anyone",
                      "Always log in through our official website or mobile app",
                      "Monitor your accounts regularly for suspicious activity",
                      "Report suspicious communications immediately",
                      "Use strong, unique passwords for your banking accounts"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Report Fraud</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    If you suspect fraudulent activity on your account:
                  </p>
                  <div className="text-sm text-blue-700">
                    <p>📞 Call: 1-800-FRAUD-FC (24/7)</p>
                    <p>🌐 Online: Visit our Fraud Reporting Center</p>
                    <p>📱 Mobile: Use the "Report Fraud" feature in our app</p>
                  </div>
                </div>
              </div>
            )}

            {currentTab === "compliance" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Regulatory Compliance & Disclosures
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Federal Deposit Insurance Corporation (FDIC)</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      First Citizens Bank is a member of the FDIC. Your deposits are insured by the FDIC 
                      up to the maximum amount allowed by law.
                    </p>
                    <p className="text-xs text-gray-500">FDIC Certificate #14236</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Equal Housing Lender</h4>
                    <p className="text-sm text-gray-600">
                      We are committed to providing equal lending opportunities to all qualified applicants 
                      without regard to race, color, religion, sex, national origin, familial status, or disability.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Privacy & Data Protection</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Your privacy is protected under the Gramm-Leach-Bliley Act and other federal regulations. 
                      We maintain strict standards for data protection and will never sell your personal information.
                    </p>
                    <div className="text-xs text-blue-600 space-x-4">
                      <a href="#" className="hover:underline">Privacy Policy</a>
                      <a href="#" className="hover:underline">Terms of Service</a>
                      <a href="#" className="hover:underline">Cookie Policy</a>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Accessibility Commitment</h4>
                    <p className="text-sm text-gray-600">
                      We are committed to providing accessible banking services to all customers, 
                      including those with disabilities, in compliance with the Americans with Disabilities Act (ADA).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              © 2025 First Citizens Bank. All rights reserved. Member FDIC.
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-close-welcome-notice"
              >
                I Understand
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="button-continue-banking"
              >
                Continue to Banking
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}