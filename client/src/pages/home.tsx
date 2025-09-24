import { useState } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturedOffers from "@/components/featured-offers";
import DigitalBanking from "@/components/digital-banking";
import CustomerService from "@/components/customer-service";
import ForeverFirst from "@/components/forever-first";
import Insights from "@/components/insights";
import Footer from "@/components/footer";
import LoginModal from "@/components/modals/login-modal";
import SearchModal from "@/components/modals/search-modal";
import CreditCardTool from "@/components/modals/credit-card-tool";
import AccountOpener from "@/components/modals/account-opener";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreditCardToolOpen, setIsCreditCardToolOpen] = useState(false);
  const [isAccountOpenerOpen, setIsAccountOpenerOpen] = useState(false);

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
        data-testid="skip-to-main"
      >
        Skip to main content
      </a>

      <Header 
        onLoginClick={() => setIsLoginOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      <main id="main-content">
        <HeroSection onAccountClick={() => setIsAccountOpenerOpen(true)} />
        <FeaturedOffers />
        <DigitalBanking />
        <CustomerService />
        <ForeverFirst />
        <Insights 
          onAccountClick={() => setIsAccountOpenerOpen(true)}
          onSearchClick={() => setIsSearchOpen(true)}
        />
      </main>

      <Footer onCreditCardClick={() => setIsCreditCardToolOpen(true)} />

      <LoginModal 
        open={isLoginOpen} 
        onOpenChange={setIsLoginOpen} 
      />
      <SearchModal 
        open={isSearchOpen} 
        onOpenChange={setIsSearchOpen} 
      />
      <CreditCardTool 
        open={isCreditCardToolOpen} 
        onOpenChange={setIsCreditCardToolOpen} 
      />
      <AccountOpener 
        open={isAccountOpenerOpen} 
        onOpenChange={setIsAccountOpenerOpen} 
      />
    </>
  );
}
