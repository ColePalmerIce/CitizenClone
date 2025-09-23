import { Button } from "@/components/ui/button";

export default function ProductSections() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Home Improvement Loans */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Home Improvement Loans</h2>
            <h3 className="text-xl text-muted-foreground mb-6">Fast access to funds for your remodel project</h3>
            <p className="text-muted-foreground mb-8">
              A quick and easy application process to remodel without using your home as collateral.
            </p>
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-secondary"
              data-testid="button-home-improvement-learn-more"
            >
              Learn More
            </Button>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Home improvement tools and renovation materials" 
              className="rounded-xl shadow-lg w-full"
              data-testid="img-home-improvement"
            />
          </div>
        </div>

        {/* Credit Cards */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="lg:order-2">
            <h2 className="text-3xl font-bold mb-4">Credit Cards</h2>
            <h3 className="text-xl text-muted-foreground mb-6">Now it's even easier to earn more</h3>
            <p className="text-muted-foreground mb-8">
              More cash back. More rewards. More travel experiences. With our newly improved credit cards, the choice is yours.
            </p>
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-secondary"
              data-testid="button-credit-cards-learn-more"
            >
              Learn More
            </Button>
          </div>
          <div className="lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Various credit cards and payment methods" 
              className="rounded-xl shadow-lg w-full"
              data-testid="img-credit-cards"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
