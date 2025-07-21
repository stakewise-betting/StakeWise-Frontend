import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Newspaper,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";

// Defining the News interface based on our schema
interface NewsItem {
  _id: string;
  newsId: number;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
}

interface NewsDisplayPageProps {
  backendBaseUrl?: string;
}

export const NewsDisplayPage: React.FC<NewsDisplayPageProps> = ({
  backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
}) => {
  // State for news data
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch news from the backend
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${backendBaseUrl}/api/news/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies if needed for authentication
        });

        if (!response.ok) {
          throw new Error("Failed to fetch news articles");
        }

        const data = await response.json();
        setNewsItems(data);
      } catch (err: any) {
        console.error("Error fetching news:", err);
        setError(err.message || "An error occurred while fetching news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [backendBaseUrl]);

  // Get unique categories from news items
  const categories = [
    "All",
    ...Array.from(new Set(newsItems.map((item) => item.category))),
  ];

  // Filter news items by selected category
  const filteredNews =
    selectedCategory && selectedCategory !== "All"
      ? newsItems.filter((item) => item.category === selectedCategory)
      : newsItems;

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C27] via-[#1E1E2E] to-[#1C1C27] py-10 lg:mx-24 md:mx-16 mx-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-8 shadow-xl border border-[#333447]">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent flex items-center gap-3">
            <Newspaper className="text-[#E27625]" size={40} />
            News & Updates
          </h2>
          <p className="text-[#A1A1AA] text-lg max-w-2xl">
            Stay updated with the latest news, announcements, and developments
            from our betting platform.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-6 mb-8">
        <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-6 shadow-xl border border-[#333447]">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E27625] rounded-full"></div>
            Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(category === "All" ? null : category)
                }
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category ||
                  (category === "All" && !selectedCategory)
                    ? "bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white shadow-lg shadow-[#E27625]/30 scale-105"
                    : "bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white hover:scale-105"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl p-12 shadow-xl border border-[#333447]">
          <div className="flex justify-center items-center">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#E27625] animate-spin" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-[#E27625]/20 rounded-full animate-pulse"></div>
            </div>
            <span className="ml-4 text-[#A1A1AA] text-lg">
              Loading news articles...
            </span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl p-8 shadow-xl border border-[#EF4444]/30">
          <div className="bg-gradient-to-r from-[#EF4444]/10 to-[#DC2626]/10 border border-[#EF4444]/30 text-[#FCA5A5] p-6 rounded-xl flex items-start gap-4 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] rounded-full p-2">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-lg text-[#FCA5A5]">
                Error Loading News
              </h3>
              <p className="text-[#A1A1AA]">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* No News State */}
      {!loading && !error && filteredNews.length === 0 && (
        <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl p-16 shadow-xl border border-[#333447]">
          <div className="text-center">
            <div className="bg-gradient-to-r from-[#333447] to-[#404153] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Newspaper className="w-10 h-10 text-[#A1A1AA]" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              No News Articles Yet
            </h3>
            <p className="text-[#A1A1AA] max-w-md mx-auto text-lg">
              {selectedCategory
                ? `There are no articles in the "${selectedCategory}" category.`
                : "There are no news articles to display yet. Check back later for updates."}
            </p>
          </div>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && filteredNews.length > 0 && (
        <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl p-8 shadow-xl border border-[#333447]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNews.map((item) => (
              <Card
                key={item._id}
                className="bg-gradient-to-br from-[#1C1C27] to-[#252538] hover:from-[#252538] hover:to-[#2A2A3E] text-white rounded-xl shadow-xl border border-[#404153] overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group hover:scale-105 hover:border-[#E27625]/30"
              >
                {/* Image Section */}
                <div className="relative w-full h-48 overflow-hidden">
                  {item.newsId ? (
                    <img
                      src={`${backendBaseUrl}/api/news/${item.newsId}/image`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("/api/placeholder/400/300")) {
                          target.src = "/api/placeholder/400/300";
                          target.alt = "Placeholder image";
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#333447] to-[#404153] flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-[#A1A1AA]/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white text-xs font-semibold rounded-full shadow-lg">
                      {item.category}
                    </span>
                  </div>
                </div>

                <CardHeader className="px-5 pt-5 pb-3">
                  <CardTitle className="text-lg font-bold text-white line-clamp-2 group-hover:text-[#E27625] transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs text-[#A1A1AA] mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                      {formatDate(item.publishDate)}
                    </div>
                    <span className="mx-1 text-[#525266]">•</span>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#10B981]" />
                      {item.author}
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="px-5 py-2 flex-grow">
                  <div className="text-[#A1A1AA] text-sm line-clamp-3 leading-relaxed">
                    {item.content}
                  </div>
                </CardContent>

                <CardFooter className="px-5 py-4 border-t border-[#404153]/50 flex justify-between items-center bg-gradient-to-r from-[#333447]/30 to-[#404153]/30">
                  <span className="text-xs text-[#6B7280] font-medium">
                    ID: {item.newsId}
                  </span>
                  <button className="text-sm bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    Read More
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDisplayPage;
