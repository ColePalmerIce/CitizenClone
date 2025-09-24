import { Button } from "@/components/ui/button";

export default function DigitalBanking() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mobile Phone Interface */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden" style={{ width: '320px', height: '640px' }}>
                  {/* Phone Screen Content */}
                  <div className="h-full flex flex-col">
                    {/* Status Bar */}
                    <div className="bg-white px-6 py-3 flex justify-between items-center text-sm">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                        <div className="w-4 h-2 bg-black rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* App Header */}
                    <div className="bg-blue-600 px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                          <span className="text-white text-xs font-bold">🏦</span>
                        </div>
                        <span className="text-white font-semibold">FirstCitizensBank</span>
                      </div>
                    </div>
                    
                    {/* Bill Pay Content */}
                    <div className="flex-1 bg-gray-50 px-6 py-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Bill Pay</h2>
                      
                      <div className="space-y-4">
                        {/* Pay Bills Tab */}
                        <div className="flex space-x-4 border-b border-gray-200 pb-2">
                          <span className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">Pay Bills</span>
                          <span className="text-gray-500">Payment Activity</span>
                        </div>
                        
                        {/* Search */}
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="Search payees"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                            data-testid="input-search-payees"
                          />
                          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
                        </div>
                        
                        {/* Payees List */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2" data-testid="payee-chase">
                            <span className="font-medium text-gray-900">Chase</span>
                            <span className="text-gray-400">⋮</span>
                          </div>
                          <div className="flex justify-between items-center py-2" data-testid="payee-city-of-raleigh">
                            <span className="font-medium text-gray-900">City of Raleigh</span>
                            <span className="text-gray-400">⋮</span>
                          </div>
                          <div className="flex justify-between items-center py-2" data-testid="payee-cox">
                            <div>
                              <span className="font-medium text-gray-900">Cox</span>
                              <div className="text-xs text-gray-500" data-testid="payment-history-cox">Payment $100.00 on 3/13/2019</div>
                            </div>
                            <span className="text-gray-400">⋮</span>
                          </div>
                          <div className="flex justify-between items-center py-2" data-testid="payee-dad">
                            <span className="font-medium text-gray-900">Dad</span>
                            <span className="text-gray-400">⋮</span>
                          </div>
                          <div className="flex justify-between items-center py-2" data-testid="payee-duke">
                            <div>
                              <span className="font-medium text-gray-900">Duke</span>
                              <div className="text-xs text-gray-500" data-testid="payment-history-duke">Payment $400.00 on 7/10/2020</div>
                            </div>
                            <span className="text-gray-400">⋮</span>
                          </div>
                          <div className="flex justify-between items-center py-2" data-testid="payee-matt-c">
                            <span className="font-medium text-gray-900">Matt C</span>
                            <span className="text-gray-400">⋮</span>
                          </div>
                          <div className="flex justify-between items-center py-2" data-testid="payee-meghan2">
                            <span className="font-medium text-gray-900">Meghan2</span>
                            <span className="text-gray-400">⋮</span>
                          </div>
                          <div className="flex justify-between items-center py-2" data-testid="payee-mom">
                            <span className="font-medium text-gray-900">Mom</span>
                            <span className="text-gray-400">⋮</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Content */}
          <div className="space-y-8 relative">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Digital Banking</h2>
              <p className="text-xl text-gray-600 mb-8">Bank from anywhere with your mobile devices</p>
            </div>
            
            {/* Features List with connecting lines */}
            <div className="space-y-8 relative">
              {/* Connecting lines from phone to features */}
              <div className="absolute left-0 top-0 w-16 h-full pointer-events-none hidden lg:block">
                <svg className="w-full h-full" viewBox="0 0 64 200" fill="none">
                  <path 
                    d="M2 30 L32 30 L32 50 L62 50" 
                    stroke="#9CA3AF" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                  />
                  <path 
                    d="M2 100 L62 100" 
                    stroke="#9CA3AF" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                  />
                  <path 
                    d="M2 170 L32 170 L32 150 L62 150" 
                    stroke="#9CA3AF" 
                    strokeWidth="2" 
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
              
              <div className="pl-20 lg:pl-20 space-y-8">
                <div className="flex items-center space-x-4 relative">
                  <div className="w-2 h-2 bg-teal-600 rounded-full absolute -left-6"></div>
                  <span className="text-lg text-gray-700 font-medium">Track your spending habits</span>
                </div>
                
                <div className="flex items-center space-x-4 relative">
                  <div className="w-2 h-2 bg-teal-600 rounded-full absolute -left-6"></div>
                  <span className="text-lg text-gray-700 font-medium">Seamlessly move your money</span>
                </div>
                
                <div className="flex items-center space-x-4 relative">
                  <div className="w-2 h-2 bg-teal-600 rounded-full absolute -left-6"></div>
                  <span className="text-lg text-gray-700 font-medium">Set alerts for transactions</span>
                </div>
              </div>
            </div>
            
            {/* Learn More Button */}
            <div className="pt-6 pl-20 lg:pl-20">
              <Button 
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 text-base"
                data-testid="button-digital-banking-learn-more"
              >
                Learn More →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
