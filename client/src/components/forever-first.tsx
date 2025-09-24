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
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* First Column - Our Forever First Promise */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">Our Forever First Promise</h2>
            <p className="text-gray-700 leading-relaxed">Forever First® means the name on our door will stay the same for years to come.</p>
          </div>
          
          {/* Second Column - Forever Stable */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Forever Stable</h3>
            <p className="text-gray-700 leading-relaxed">Taking care of customers—year in, year out—isn't just our track record. It's our promise.</p>
          </div>
          
          {/* Third Column - Forever Family */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Forever Family</h3>
            <p className="text-gray-700 leading-relaxed">We're one of America's largest family-controlled banks, led for three generations by members of one family.</p>
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 text-base font-medium"
            data-testid="button-about-first-citizens"
          >
            About First Citizens
          </Button>
        </div>
      </div>
    </section>
  );
}
