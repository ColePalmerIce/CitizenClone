import { Shield, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const promises = [
  {
    icon: Shield,
    title: "Forever Stable",
    description: "Taking care of customers—year in, year out—isn't just our track record. It's our promise.",
  },
  {
    icon: Users,
    title: "Forever Family",
    description: "We're one of America's largest family-controlled banks, led for three generations by members of one family.",
  },
  {
    icon: Heart,
    title: "Forever First",
    description: "Putting customers first has been our philosophy since 1898, and it always will be.",
  },
];

export default function ForeverFirst() {
  return (
    <section className="bg-primary text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Forever First Promise</h2>
          <p className="text-xl text-blue-100">Forever First® means the name on our door will stay the same for years to come.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {promises.map((promise) => {
            const Icon = promise.icon;
            return (
              <div key={promise.title} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{promise.title}</h3>
                <p className="text-blue-100">{promise.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-white text-primary hover:bg-blue-50"
            data-testid="button-about-first-citizens"
          >
            About First Citizens
          </Button>
        </div>
      </div>
    </section>
  );
}
