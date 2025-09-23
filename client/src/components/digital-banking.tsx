import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Track your spending habits",
    description: "Monitor your expenses and categorize spending automatically",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
    alt: "Mobile banking app showing spending tracking",
  },
  {
    title: "Seamlessly move your money",
    description: "Transfer funds between accounts and pay bills instantly",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
    alt: "Mobile banking app for money transfers and bill payments",
  },
  {
    title: "Set alerts for transactions",
    description: "Get real-time notifications for account activity",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=500",
    alt: "Mobile banking alerts and security notifications",
  },
];

export default function DigitalBanking() {
  return (
    <section className="bg-muted py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Digital Banking</h2>
          <p className="text-xl text-muted-foreground">Bank from anywhere with your mobile devices</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="text-center">
              <div className="mb-6">
                <img 
                  src={feature.image}
                  alt={feature.alt}
                  className="mx-auto rounded-2xl shadow-lg max-w-xs"
                  data-testid={`img-digital-banking-${index + 1}`}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-secondary"
            data-testid="button-digital-banking-learn-more"
          >
            Learn More about Digital Banking
          </Button>
        </div>
      </div>
    </section>
  );
}
