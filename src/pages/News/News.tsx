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

// Define the News interface based on our schema
interface NewsItem {
  _id: string;
  newsId: number;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string; // Added image URL field
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

  // Hero section background image
  const heroBackgroundImage = "/src/assets/images/NewsBanner.png"; // Update this path to your image

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
    <div className="bg-primary min-h-screen p-4 sm:p-6 lg:p-8 text-dark-primary">
      {/* Header */}

      {/* Hero Section with Background Image */}
      <div
        className="relative h-[250px] w-full overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackgroundImage})` }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-white mb-2">News & Updates</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Latest news, announcements, and updates from our team.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mt-6 mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category === "All" ? null : category)
            }
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                            ${
                              selectedCategory === category ||
                              (category === "All" && !selectedCategory)
                                ? "bg-secondary text-white shadow-md"
                                : "bg-gray-800/40 text-dark-secondary hover:bg-gray-700/60"
                            }
                        `}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          <span className="ml-3 text-dark-secondary">
            Loading news articles...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-500 p-4 rounded-lg flex items-start gap-3 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Error Loading News</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* No News State */}
      {!loading && !error && filteredNews.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex p-3 rounded-full bg-gray-800/40 mb-4">
            <Newspaper className="w-8 h-8 text-dark-secondary" />
          </div>
          <h3 className="text-xl font-medium text-dark-primary mb-2">
            No News Articles Yet
          </h3>
          <p className="text-dark-secondary max-w-md mx-auto">
            {selectedCategory
              ? `There are no articles in the "${selectedCategory}" category.`
              : "There are no news articles to display yet. Check back later for updates."}
          </p>
        </div>
      )}

      {/* News Grid */}
      {!loading && !error && filteredNews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Card
              key={item._id}
              className="bg-card text-dark-primary rounded-xl shadow-lg border border-gray-700/60 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative w-full h-48 overflow-hidden">
                {item.newsId ? (
                  <img
                    src={`${backendBaseUrl}/api/news/${item.newsId}/image`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("/api/placeholder/400/300")) {
                        target.src = "/api/placeholder/400/300";
                        target.alt = "Placeholder image";
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800/40 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-dark-secondary/50" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 bg-secondary/90 text-white text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>

              <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="text-xl font-semibold text-dark-primary">
                  {item.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs text-dark-secondary/80">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(item.publishDate)}
                  <span className="mx-1">•</span>
                  <User className="w-3.5 h-3.5" />
                  {item.author}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-4 py-2 flex-grow">
                <div className="text-dark-secondary text-sm line-clamp-3">
                  {item.content}
                </div>
              </CardContent>

              <CardFooter className="px-4 py-3 border-t border-gray-700/50 flex justify-between">
                <span className="text-xs text-dark-secondary/70">
                  News ID: {item.newsId}
                </span>
                <button className="text-sm text-secondary hover:text-secondary/80 font-medium">
                  Read More
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsDisplayPage;
