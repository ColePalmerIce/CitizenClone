import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

const FEATURES = [
  {
    id: 'spending',
    title: 'Track your spending habits',
    image: 'https://www.firstcitizens.com/adobe/dynamicmedia/deliver/dm-aid--c140da00-a814-4536-afe5-4846e5b9e9e3/feature-highlight-device-spending-2x-png.webp?preferwebp=true&format=webp&preferwebp=true',
    alt: 'Spending tracker interface showing spending categories and analytics'
  },
  {
    id: 'transfer', 
    title: 'Seamlessly move your money',
    image: 'https://www.firstcitizens.com/adobe/dynamicmedia/deliver/dm-aid--d4ccfd26-193b-4b62-97ac-79a8aa48508d/bill-pay-device-2x-png.webp?preferwebp=true&format=webp&preferwebp=true',
    alt: 'Bill pay interface showing payment options and payees'
  },
  {
    id: 'alerts',
    title: 'Set alerts for transactions', 
    image: 'https://www.firstcitizens.com/adobe/dynamicmedia/deliver/dm-aid--293a6d1d-70d9-4056-ae82-71ecc6f4b5e6/device-alerts-2x-png.webp?preferwebp=true&format=webp&preferwebp=true',
    alt: 'Transaction alerts and notifications settings interface'
  }
];

export default function DigitalBanking() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);
  const isLoadingRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const clearLoadingInterval = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  };

  const clearAutoRotate = () => {
    if (autoRotateRef.current) {
      clearInterval(autoRotateRef.current);
      autoRotateRef.current = null;
    }
  };

  const handleFeatureClick = (index: number) => {
    if (index === activeFeature || isLoadingRef.current) return;
    
    // Clear any existing intervals
    clearLoadingInterval();
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulate loading animation
    loadingIntervalRef.current = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearLoadingInterval();
          setIsLoading(false);
          setActiveFeature(index);
          return 0;
        }
        return prev + 2;
      });
    }, 20);
  };

  // Centralized auto-rotate control - only start if not paused and not loading
  useEffect(() => {
    clearAutoRotate();
    
    if (!isPaused && !isLoading) {
      autoRotateRef.current = setInterval(() => {
        setActiveFeature(prev => (prev + 1) % FEATURES.length);
      }, 5000);
    }
    
    return () => clearAutoRotate();
  }, [isPaused, isLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAutoRotate();
      clearLoadingInterval();
    };
  }, []);

  // Pause auto-rotation during user interaction
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };
  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mobile Phone Interface */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-white rounded-[2rem] overflow-hidden relative" style={{ width: '320px', height: '640px' }}>
                  {/* Loading overlay with animated progress bar */}
                  {isLoading && (
                    <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div 
                          className="h-full bg-blue-600 rounded-full transition-all duration-100 ease-out"
                          style={{ width: `${loadingProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">Loading...</p>
                    </div>
                  )}
                  
                  {/* Phone Screen Content - Dynamic Image */}
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <img
                      key={activeFeature} // Force re-render for smooth transition
                      src={FEATURES[activeFeature].image}
                      alt={FEATURES[activeFeature].alt}
                      className="max-w-full max-h-full object-contain transition-opacity duration-500"
                      data-testid={`phone-image-${FEATURES[activeFeature].id}`}
                      onError={(e) => {
                        // Fallback to a simple placeholder if image fails to load
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjY0MCIgdmlld0JveD0iMCAwIDMyMCA2NDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNjQwIiBmaWxsPSIjRjNGNEY2Ii8+PHBhdGggZD0iTTE2MCAxODBIMjQwVjQ2MEgxNjBWMTgwWiIgZmlsbD0iIzlDQTNBRiIvPjxwYXRoIGQ9Ik0xMzYgMjAwVjIzMkgxNTJWMjAwSDE2MFYyMzJIMTc2VjIwMEgxODRWMjMySDIwMFYyMDBIMjA4VjIzMkgyMjRWMjAwSDIyNFYyNjRIMTM2VjIwMFoiIGZpbGw9IiM0Qjc2ODAiLz48L3N2Zz4=';
                      }}
                    />
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
                <svg className="w-full h-full" viewBox="0 0 64 240" fill="none">
                  {FEATURES.map((_, index) => {
                    const yPosition = 50 + (index * 80);
                    const isActive = activeFeature === index;
                    return (
                      <g key={index}>
                        <path 
                          d={index === 1 ? `M2 ${yPosition} L62 ${yPosition}` : `M2 ${yPosition} L32 ${yPosition} L32 ${50 + 80} L62 ${50 + 80}`}
                          stroke={isActive ? "#0891b2" : "#9CA3AF"} 
                          strokeWidth={isActive ? "3" : "2"} 
                          strokeDasharray="5,5"
                          className="transition-all duration-300"
                        />
                        {/* Loading progress line */}
                        {isLoading && activeFeature === index && (
                          <path 
                            d={index === 1 ? `M2 ${yPosition} L62 ${yPosition}` : `M2 ${yPosition} L32 ${yPosition} L32 ${50 + 80} L62 ${50 + 80}`}
                            stroke="#3b82f6"
                            strokeWidth="4"
                            strokeDasharray="5,5"
                            strokeDashoffset={`${100 - loadingProgress}%`}
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              <div 
                className="pl-20 lg:pl-20 space-y-8"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {FEATURES.map((feature, index) => (
                  <div 
                    key={feature.id}
                    className={`flex items-center space-x-4 relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                      activeFeature === index ? 'transform scale-105' : ''
                    } ${isLoading ? 'pointer-events-none' : ''}`}
                    onClick={() => handleFeatureClick(index)}
                    data-testid={`feature-${feature.id}`}
                  >
                    <div className={`w-3 h-3 rounded-full absolute -left-6 transition-all duration-300 ${
                      activeFeature === index ? 'bg-cyan-600 scale-125 shadow-lg' : 'bg-teal-600'
                    }`}>
                      {/* Loading indicator on active feature */}
                      {isLoading && activeFeature === index && (
                        <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-spin" />
                      )}
                    </div>
                    
                    {/* Loading progress bar next to active feature */}
                    {isLoading && activeFeature === index && (
                      <div className="absolute -bottom-2 left-0 w-full">
                        <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-75 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <span className={`text-lg font-medium transition-colors duration-300 select-none ${
                      activeFeature === index 
                        ? 'text-cyan-700 font-semibold' 
                        : 'text-gray-700 hover:text-cyan-600'
                    }`}>
                      {feature.title}
                    </span>
                  </div>
                ))}
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
