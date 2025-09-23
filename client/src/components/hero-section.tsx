import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    badge: "Personal",
    title: "Take control of your portfolio with Self-Directed Investing",
    description: "Conduct research, place trades, and manage your investment portfolio with powerful tools and competitive pricing.",
    primaryButton: "Start Investing",
    secondaryButton: "Explore Self-Directed Investing",
  },
  {
    id: 2,
    badge: "Featured",
    title: "New: Tax overhaul—what to know now",
    description: "Stay informed about the latest tax changes and how they might affect your financial planning strategy.",
    primaryButton: "Learn More",
    secondaryButton: null,
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative hero-gradient text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`banner-slide ${index === currentSlide ? 'active' : ''} ${
                  index !== currentSlide ? 'absolute inset-0' : ''
                }`}
                style={{
                  opacity: index === currentSlide ? 1 : 0,
                }}
              >
                <span 
                  className="text-sm font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full"
                  data-testid={`text-badge-${slide.badge.toLowerCase()}`}
                >
                  {slide.badge}
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold mt-4 mb-6">
                  {slide.title}
                </h1>
                <p className="text-xl mb-8 text-blue-100">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    className="bg-white text-primary hover:bg-blue-50"
                    data-testid={`button-${slide.primaryButton.toLowerCase().replace(/[\s:]/g, '-')}`}
                  >
                    {slide.primaryButton}
                  </Button>
                  {slide.secondaryButton && (
                    <Button 
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-primary"
                      data-testid={`button-${slide.secondaryButton.toLowerCase().replace(/[\s:]/g, '-')}`}
                    >
                      {slide.secondaryButton}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Financial dashboard and investment portfolio interface" 
              className="rounded-xl shadow-2xl w-full"
              data-testid="img-hero-dashboard"
            />
          </div>
        </div>
      </div>
      
      {/* Banner controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => handleDotClick(index)}
            data-testid={`button-banner-dot-${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
