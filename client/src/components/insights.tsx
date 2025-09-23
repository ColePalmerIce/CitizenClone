import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const articles = [
  {
    category: "Investing",
    title: "Self-directed investing fundamentals",
    description: "Even with a self-directed account, a professional approach can help you successfully manage your portfolio.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    alt: "Investment portfolio analysis and self-directed investing",
  },
  {
    category: "Retirement",
    title: "Key ways to think about financial planning",
    description: "Here are some fundamental considerations when making a financial plan.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    alt: "Financial planning documents and retirement strategy",
  },
  {
    category: "Investing",
    title: "How to choose IRA investments",
    description: "Learn how to choose IRA investments that align with your personal risk tolerance and support your retirement savings goals.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250",
    alt: "IRA investment planning and retirement account options",
  },
];

export default function Insights() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Insights</h2>
            <p className="text-muted-foreground">A few financial insights for your life</p>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search Insights" 
                className="pl-10 pr-4 py-2 w-64"
                data-testid="input-search-insights"
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card 
              key={article.title} 
              className="overflow-hidden hover:shadow-md transition-shadow"
              data-testid={`card-article-${index + 1}`}
            >
              <img 
                src={article.image}
                alt={article.alt}
                className="w-full h-48 object-cover"
                data-testid={`img-article-${index + 1}`}
              />
              <CardContent className="p-6">
                <span className="text-sm text-primary font-medium">{article.category}</span>
                <h3 className="text-xl font-semibold mt-2 mb-3">{article.title}</h3>
                <p className="text-muted-foreground mb-4">{article.description}</p>
                <Button 
                  variant="ghost"
                  className="p-0 h-auto text-primary font-medium hover:underline hover:bg-transparent"
                  data-testid={`button-read-more-${index + 1}`}
                >
                  Read More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
