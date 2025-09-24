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
    <section className="bg-slate-700 text-white py-16" style={{backgroundColor: '#4A5C7A'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Our Forever First Promise</h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto">Forever First® means the name on our door will stay the same for years to come.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mt-16">
          {promises.map((promise) => {
            const Icon = promise.icon;
            return (
              <div key={promise.title} className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{promise.title}</h3>
                <p className="text-white/90 leading-relaxed text-base">{promise.description}</p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <Button 
            size="lg"
            className="bg-white text-slate-700 hover:bg-gray-100 px-8 py-3 text-base font-medium"
            data-testid="button-about-first-citizens"
          >
            About First Citizens
          </Button>
        </div>
      </div>
    </section>
  );
}
