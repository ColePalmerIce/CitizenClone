import { Wallet, MapPin, Phone } from "lucide-react";

interface CustomerServiceProps {
  onAccountClick?: () => void;
}

const services = [
  {
    icon: Wallet,
    title: "Open an Account",
    description: "See all we have to offer.",
    action: "open_account"
  },
  {
    icon: MapPin,
    title: "Find a Branch",
    description: "Meet our associates.",
    action: "find_branch"
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Reach out and we'll help.",
    action: "call_us"
  },
];

export default function CustomerService({ onAccountClick }: CustomerServiceProps) {
  const handleServiceClick = (action: string) => {
    switch (action) {
      case "open_account":
        if (onAccountClick) {
          onAccountClick();
        }
        break;
      case "find_branch":
        window.open("https://locations.firstcitizens.com/?_gl=1*1m9wm24*_gcl_au*MjE0NDA3NzY1OC4xNzU4Njc0NTcy*_ga*MjExMDQ5OTA5NC4xNzU4Njc0NTg4*_ga_GHPE53GVHX*czE3NTg3MzMyMDYkbzUkZzEkdDE3NTg3MzMyMzYkajMwJGwwJGgw*_ga_ZLJSNLKT9D*czE3NTg3MjY2MDUkbzQkZzEkdDE3NTg3Mjg3NTQkajYwJGwwJGgw", "_blank");
        break;
      case "call_us":
        window.open("https://www.firstcitizens.com/support/call-us", "_blank");
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

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
              <div 
                key={service.title} 
                className="bg-white rounded-lg p-8 text-center hover:shadow-xl transition-all cursor-pointer hover:transform hover:-translate-y-1"
                onClick={() => handleServiceClick(service.action)}
                data-testid={`card-${service.action.replace('_', '-')}`}
              >
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
