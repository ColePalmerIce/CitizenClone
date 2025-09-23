import { Building, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Building,
    title: "Open an Account",
    description: "See all we have to offer.",
    buttonText: "Get Started",
  },
  {
    icon: MapPin,
    title: "Find a Branch",
    description: "Meet our associates.",
    buttonText: "Locate Branch",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Reach out and we'll help.",
    buttonText: "Contact Us",
  },
];

export default function CustomerService() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Bank on Customer Service</h2>
          <p className="text-xl text-muted-foreground">Open an Account Today</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <Button 
                  variant="ghost"
                  className="p-0 h-auto text-primary font-medium hover:underline hover:bg-transparent"
                  data-testid={`button-${service.buttonText.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {service.buttonText}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
