import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function FeaturedOffers() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tax Overhaul Banner */}
        <Link href="/insights/tax-overhaul" data-testid="link-tax-overhaul">
          <div className="bg-blue-900 text-white p-6 rounded-lg mb-6 flex justify-between items-center cursor-pointer hover:bg-blue-800 transition-colors">
            <h2 className="text-xl font-semibold">
              New: Tax overhaul—what to know now
            </h2>
            <div className="flex items-center text-white hover:text-gray-200">
              <span className="mr-1">Learn More</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Two Cards Layout */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Home Improvement Loans Card */}
          <Link href="/loans/home-improvement" data-testid="card-home-improvement">
            <Card className="bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-colors h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="mb-4">
                  <span className="text-sm font-medium uppercase tracking-wide opacity-90">HOME IMPROVEMENT LOANS</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 leading-tight">
                  Fast access to funds for your remodel project
                </h3>
                
                <p className="text-blue-100 mb-6 flex-grow">
                  A quick and easy application process to remodel without using your home as collateral.
                </p>
                
                <div className="flex items-center text-white hover:text-gray-200">
                  <span className="mr-1">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Credit Cards Card */}
          <Link href="/credit-cards" data-testid="card-credit-cards">
            <Card className="bg-green-700 text-white border-none cursor-pointer hover:bg-green-800 transition-colors h-full">
              <CardContent className="p-8 h-full flex flex-col">
                <div className="mb-4">
                  <span className="text-sm font-medium uppercase tracking-wide opacity-90">CREDIT CARDS</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 leading-tight">
                  Now it's even easier to earn more
                </h3>
                
                <p className="text-green-100 mb-6 flex-grow">
                  More cash back. More rewards. More travel experiences. With our newly improved credit cards, the choice is yours.
                </p>
                
                <div className="flex items-center text-white hover:text-gray-200">
                  <span className="mr-1">Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}