import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchDropdown from "@/components/ui/search-dropdown";
import { useState, useMemo } from "react";

const articles = [
  {
    category: "INVESTING",
    title: "Self-directed investing fundamentals",
    image: "https://www.firstcitizens.com/content/dam/firstcitizens/images/resources/personal/investing/self-directed-investing@2x.jpg.transform/resource-card-standard-3-desktop/image.jpeg",
    alt: "Investment portfolio analysis and self-directed investing",
    action: "open_account"
  },
  {
    category: "RETIREMENT",
    title: "Key ways to think about financial planning",
    image: "https://www.firstcitizens.com/content/dam/firstcitizens/images/resources/personal/retirement/4-ways-to-think-about-financial-planning@2x.jpg.transform/resource-card-standard-3-desktop/image.jpeg",
    alt: "Financial planning documents and retirement strategy",
    action: "search_financial_planning"
  },
  {
    category: "INVESTING",
    title: "How to choose IRA investments",
    image: "https://www.firstcitizens.com/content/dam/firstcitizens/images/resources/personal/investing/how-to-choose-IRA-investments@2x.jpg.transform/resource-card-standard-3-desktop/image.jpeg",
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
            <SearchDropdown
              placeholder="Search Insights"
              value={searchQuery}
              onChange={setSearchQuery}
              suggestions={[
                "Self-directed investing",
                "Financial planning",
                "IRA investments",
                "Retirement planning", 
                "Investment strategies",
                "Portfolio management",
                "Wealth management",
                "College savings",
                "Emergency funds",
                "Tax planning"
              ]}
              className="w-80"
              inputClassName="text-center border-gray-200 bg-white"
            />
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
