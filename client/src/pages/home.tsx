import { useState, useEffect } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturedOffers from "@/components/featured-offers";
import DigitalBanking from "@/components/digital-banking";
import CustomerService from "@/components/customer-service";
import ForeverFirst from "@/components/forever-first";
import Insights from "@/components/insights";
import EnhancedFooter from "@/components/enhanced-footer";
import LoginModal from "@/components/modals/login-modal";
import SearchModal from "@/components/modals/search-modal";
import CreditCardTool from "@/components/modals/credit-card-tool";
import AccountOpener from "@/components/modals/account-opener";
import SecurityNoticeBanner from "@/components/security-notice-banner";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import WelcomeNoticeModal from "@/components/modals/welcome-notice-modal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreditCardToolOpen, setIsCreditCardToolOpen] = useState(false);
  const [isAccountOpenerOpen, setIsAccountOpenerOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  useEffect(() => {
    // Show welcome modal for first-time visitors
    const hasVisited = localStorage.getItem('first-citizens-visited');
    if (!hasVisited) {
      // Delay modal to allow page to load
      const timer = setTimeout(() => {
        setIsWelcomeModalOpen(true);
        localStorage.setItem('first-citizens-visited', 'true');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        data-testid="skip-to-main"
      >
        Skip to main content
      </a>

      {/* Professional Banking Security Banner */}
      <SecurityNoticeBanner />

      <Header 
        onLoginClick={() => setIsLoginOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <main id="main-content">
        <HeroSection onAccountClick={() => setIsAccountOpenerOpen(true)} />
        <FeaturedOffers />
        <DigitalBanking />
        <CustomerService onAccountClick={() => setIsAccountOpenerOpen(true)} />
        <ForeverFirst />
        <Insights 
          onAccountClick={() => setIsAccountOpenerOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
        />
      </main>

      <EnhancedFooter onCreditCardClick={() => setIsCreditCardToolOpen(true)} />

      <LoginModal 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen} 
      />
      <SearchModal 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen}
        onAccountClick={() => setIsAccountOpenerOpen(true)}
        onCreditCardClick={() => setIsCreditCardToolOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
      />
      <CreditCardTool 
        open={isCreditCardToolOpen} 
        onOpenChange={setIsCreditCardToolOpen} 
      />
      <AccountOpener 
        open={isAccountOpenerOpen} 
        onOpenChange={setIsAccountOpenerOpen} 
      />
      
      {/* Professional Banking Notice Modal */}
      <WelcomeNoticeModal 
        open={isWelcomeModalOpen} 
        onOpenChange={setIsWelcomeModalOpen} 
      />

      {/* Cookie Consent Banner */}
      <CookieConsentBanner />
    </>
  );
}
