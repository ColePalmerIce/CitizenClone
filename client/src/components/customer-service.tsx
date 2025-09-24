import { Wallet, MapPin, Phone, ChevronRight } from "lucide-react";

interface CustomerServiceProps {
  onAccountClick?: () => void;
}

const services = [
  {
    icon: Wallet,
    title: "Open an Account",
    displayTitle: "Open an Account",
    description: "See all we have to offer.",
    action: "open_account",
    hasArrow: true
  },
  {
    icon: MapPin,
    title: "Find a Branch",
    displayTitle: "Find a Branch",
    description: "Meet our associates.",
    action: "find_branch",
    hasArrow: true
  },
  {
    icon: Phone,
    title: "Call Us",
    displayTitle: "Call Us",
    description: "Reach out and we'll help.",
    action: "call_us",
    hasArrow: true
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
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                  <Icon className="h-6 w-6 text-gray-500 stroke-1" strokeWidth={1} />
                </div>
                <div className="flex items-center justify-center mb-3">
                  <h3 className="text-lg font-semibold text-green-700">{service.displayTitle}</h3>
                  {service.hasArrow && (
                    <ChevronRight className="h-4 w-4 text-green-700 ml-1" strokeWidth={2} />
                  )}
                </div>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
