import { Wallet, MapPin, Phone } from "lucide-react";

const services = [
  {
    icon: Wallet,
    title: "Open an Account",
    description: "See all we have to offer.",
  },
  {
    icon: MapPin,
    title: "Find a Branch",
    description: "Meet our associates.",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Reach out and we'll help.",
  },
];

export default function CustomerService() {
  return (
    <section className="py-16 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-white/90 tracking-wide mb-4 uppercase">BANK ON CUSTOMER SERVICE</p>
          <h2 className="text-3xl font-bold text-white">Open an Account Today</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.title} className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
