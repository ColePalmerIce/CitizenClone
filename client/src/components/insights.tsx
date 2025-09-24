import { Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";

const articles = [
  {
    category: "INVESTING",
    title: "Self-directed investing fundamentals",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    alt: "Investment portfolio analysis and self-directed investing",
    action: "open_account"
  },
  {
    category: "RETIREMENT",
    title: "Key ways to think about financial planning",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    alt: "Financial planning documents and retirement strategy",
    action: "search_financial_planning"
  },
  {
    category: "INVESTING",
    title: "How to choose IRA investments",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
    alt: "IRA investment planning and retirement account options",
    action: "open_account"
  },
];

interface InsightsProps {
  onAccountClick?: () => void;
  onSearchClick?: () => void;
}

export default function Insights({ onAccountClick, onSearchClick }: InsightsProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter articles based on search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    
    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleArticleClick = (action: string) => {
    if (action === "open_account" && onAccountClick) {
      onAccountClick();
    } else if (action === "search_financial_planning" && onSearchClick) {
      onSearchClick();
    }
  };
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="text-sm font-medium text-slate-600 tracking-wide mb-4">INSIGHTS</div>
          <h2 className="text-4xl font-bold mb-8 text-slate-800">
            A few financial insights for<br />your life
          </h2>
          
          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search Insights" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 bg-white border-gray-200 text-center"
                data-testid="input-search-insights"
              />
              <Search className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => (
              <div 
                key={article.title} 
                className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => handleArticleClick(article.action)}
                data-testid={`card-article-${index + 1}`}
              >
                <div className="relative">
                  <img 
                    src={article.image}
                    alt={article.alt}
                    className="w-full h-80 object-cover"
                    data-testid={`img-article-${index + 1}`}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-slate-800/40 to-transparent"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="text-xs font-medium tracking-wide mb-2 opacity-90">
                      {article.category}
                    </div>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto text-white hover:text-gray-200 hover:bg-transparent text-left font-semibold text-lg leading-tight group-hover:underline"
                      onClick={() => handleArticleClick(article.action)}
                      data-testid={`button-article-${index + 1}`}
                    >
                      <span className="flex items-start">
                        {article.title}
                        <ChevronRight className="ml-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No insights found matching your search.</div>
              <div className="text-gray-400 text-sm mt-2">Try searching for "investing", "retirement", or "IRA"</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
