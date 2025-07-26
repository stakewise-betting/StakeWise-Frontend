import React, { useState, useEffect, useMemo } from "react";
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
  Twitter,
  Coins,
  Globe,
  RefreshCw,
  Filter,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ArticleDetail } from "./ArticleDetail";

// Normalized news interface for all sources
interface NormalizedNewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  source: "admin" | "twitter" | "crypto" | "external";
  sourceUrl?: string;
  newsId?: number; // Only for admin news
}

// Original admin news interface
interface AdminNewsItem {
  _id: string;
  newsId: number;
  title: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
}

// External news interfaces
interface TwitterNewsItem {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  imageUrl?: string;
  public_metrics?: {
    like_count: number;
    retweet_count: number;
  };
  attachments?: {
    media_keys: string[];
  };
}

interface CryptoNewsItem {
  id: string;
  title: string;
  body: string;
  published_on: number;
  imageurl?: string;
  url: string;
  source_info: {
    name: string;
  };
}

interface NewsCache {
  data: NormalizedNewsItem[];
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface NewsDisplayPageProps {
  backendBaseUrl?: string;
}

export const NewsDisplayPage: React.FC<NewsDisplayPageProps> = ({
  backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
}) => {
  // State management
  const [newsItems, setNewsItems] = useState<NormalizedNewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"categories" | "sources">(
    "categories"
  );
  const [selectedArticle, setSelectedArticle] =
    useState<NormalizedNewsItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Cache configuration
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  // Normalization functions
  const normalizeAdminNews = (items: AdminNewsItem[]): NormalizedNewsItem[] => {
    return items.map((item) => ({
      id: item._id,
      title: item.title,
      content: item.content,
      category: item.category,
      author: item.author,
      publishDate: item.publishDate,
      imageUrl: item.imageUrl,
      source: "admin" as const,
      newsId: item.newsId,
    }));
  };

  const normalizeTwitterNews = (
    items: TwitterNewsItem[]
  ): NormalizedNewsItem[] => {
    return items.map((item) => ({
      id: item.id,
      title: item.text.slice(0, 75) + (item.text.length > 75 ? "..." : ""),
      content: item.text,
      category: "Social Media",
      author: `User ${item.author_id}`,
      publishDate: item.created_at,
      imageUrl: item.imageUrl,
      source: "twitter" as const,
      sourceUrl: `https://twitter.com/i/status/${item.id}`,
    }));
  };

  const normalizeCryptoNews = (
    items: CryptoNewsItem[]
  ): NormalizedNewsItem[] => {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.body,
      category: "Cryptocurrency",
      author: item.source_info.name,
      publishDate: new Date(item.published_on * 1000).toISOString(),
      imageUrl: item.imageurl,
      source: "crypto" as const,
      sourceUrl: item.url,
    }));
  };

  // Cache management
  const getCacheKey = (source: string) => `news_cache_${source}`;

  const getCachedData = (source: string): NormalizedNewsItem[] | null => {
    try {
      const cached = localStorage.getItem(getCacheKey(source));
      if (cached) {
        const cacheData: NewsCache = JSON.parse(cached);
        const now = Date.now();
        if (now - cacheData.timestamp < cacheData.ttl) {
          return cacheData.data;
        }
      }
    } catch (error) {
      console.warn(`Failed to retrieve cache for ${source}:`, error);
    }
    return null;
  };

  const setCachedData = (source: string, data: NormalizedNewsItem[]) => {
    try {
      const cacheData: NewsCache = {
        data,
        timestamp: Date.now(),
        ttl: CACHE_TTL,
      };
      localStorage.setItem(getCacheKey(source), JSON.stringify(cacheData));
    } catch (error) {
      console.warn(`Failed to cache data for ${source}:`, error);
    }
  };

  // API fetch functions with retry logic
  const fetchWithRetry = async (
    url: string,
    options: RequestInit = {},
    retries = MAX_RETRIES
  ): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Fetch failed, retrying... (${retries} attempts left)`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  const fetchAdminNews = async (): Promise<NormalizedNewsItem[]> => {
    const cached = getCachedData("admin");
    if (cached) return cached;

    try {
      const response = await fetchWithRetry(`${backendBaseUrl}/api/news/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data: AdminNewsItem[] = await response.json();
      const normalized = normalizeAdminNews(data);
      setCachedData("admin", normalized);
      return normalized;
    } catch (error) {
      console.error("Error fetching admin news:", error);
      return getCachedData("admin") || []; // Return cached data as fallback
    }
  };

  const fetchTwitterNews = async (): Promise<NormalizedNewsItem[]> => {
    const cached = getCachedData("twitter");
    if (cached) return cached;

    try {
      const response = await fetchWithRetry(
        `${backendBaseUrl}/api/news/external/twitter`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data: TwitterNewsItem[] = await response.json();
      const normalized = normalizeTwitterNews(data);
      setCachedData("twitter", normalized);
      return normalized;
    } catch (error) {
      console.error("Error fetching Twitter news:", error);
      return getCachedData("twitter") || []; // Return cached data as fallback
    }
  };

  const fetchCryptoNews = async (): Promise<NormalizedNewsItem[]> => {
    const cached = getCachedData("crypto");
    if (cached) return cached;

    try {
      const response = await fetchWithRetry(
        `${backendBaseUrl}/api/news/external/crypto`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data: CryptoNewsItem[] = await response.json();
      const normalized = normalizeCryptoNews(data);
      setCachedData("crypto", normalized);
      return normalized;
    } catch (error) {
      console.error("Error fetching crypto news:", error);
      return getCachedData("crypto") || []; // Return cached data as fallback
    }
  };

  // Main fetch function that combines all sources
  const fetchAllNews = async (forceRefresh = false) => {
    if (forceRefresh) {
      // Clear all caches
      ["admin", "twitter", "crypto"].forEach((source) => {
        localStorage.removeItem(getCacheKey(source));
      });
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch from all sources concurrently
      const [adminNews, twitterNews, cryptoNews] = await Promise.allSettled([
        fetchAdminNews(),
        fetchTwitterNews(),
        fetchCryptoNews(),
      ]);

      // Combine results, handling failed requests gracefully
      const allNews: NormalizedNewsItem[] = [];

      if (adminNews.status === "fulfilled") {
        allNews.push(...adminNews.value);
      } else {
        console.warn("Admin news failed:", adminNews.reason);
      }

      if (twitterNews.status === "fulfilled") {
        allNews.push(...twitterNews.value);
      } else {
        console.warn("Twitter news failed:", twitterNews.reason);
      }

      if (cryptoNews.status === "fulfilled") {
        allNews.push(...cryptoNews.value);
      } else {
        console.warn("Crypto news failed:", cryptoNews.reason);
      }

      // Sort by publish date (newest first)
      allNews.sort(
        (a, b) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );

      setNewsItems(allNews);
      setLastRefresh(new Date());

      // If all sources failed, show error
      if (
        allNews.length === 0 &&
        adminNews.status === "rejected" &&
        twitterNews.status === "rejected" &&
        cryptoNews.status === "rejected"
      ) {
        setError(
          "Failed to load news from all sources. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("An unexpected error occurred while fetching news.");
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllNews(true);
    setRefreshing(false);
  };

  // Initial load
  useEffect(() => {
    fetchAllNews();
  }, [backendBaseUrl]);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllNews();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSource]);

  // Memoized filtering, categorization, and pagination
  const { categories, sources, filteredNews, totalPages, paginatedNews } =
    useMemo(() => {
      const uniqueCategories = [
        "All",
        ...Array.from(new Set(newsItems.map((item) => item.category))),
      ];
      const uniqueSources = [
        "All",
        ...Array.from(new Set(newsItems.map((item) => item.source))),
      ];

      let filtered = newsItems;

      if (selectedCategory && selectedCategory !== "All") {
        filtered = filtered.filter(
          (item) => item.category === selectedCategory
        );
      }

      if (selectedSource && selectedSource !== "All") {
        filtered = filtered.filter((item) => item.source === selectedSource);
      }

      // Calculate pagination
      const totalPages = Math.ceil(filtered.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedNews = filtered.slice(startIndex, endIndex);

      return {
        categories: uniqueCategories,
        sources: uniqueSources,
        filteredNews: filtered,
        totalPages,
        paginatedNews,
      };
    }, [
      newsItems,
      selectedCategory,
      selectedSource,
      currentPage,
      itemsPerPage,
    ]);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Get source icon
  const getSourceIcon = (source: string) => {
    switch (source) {
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "crypto":
        return <Coins className="w-4 h-4" />;
      case "admin":
        return <Newspaper className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  // Handle article selection
  const handleReadMore = (article: NormalizedNewsItem) => {
    setSelectedArticle(article);
  };

  const handleBackToNews = () => {
    setSelectedArticle(null);
  };

  return (
    <>
      {selectedArticle ? (
        <ArticleDetail
          article={selectedArticle}
          onBack={handleBackToNews}
          backendBaseUrl={backendBaseUrl}
        />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#1C1C27] via-[#1E1E2E] to-[#1C1C27] py-10 lg:mx-24 md:mx-16 mx-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-8 shadow-xl border border-[#333447]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent flex items-center gap-3">
                    {/* <Newspaper className="text-[#E27625]" size={40} /> */}
                    News & Updates
                  </h2>
                  <p className="text-sm sm:text-base lg:text-lg text-[#A1A1AA] max-w-2xl">
                    Latest news from admin updates, social media, and
                    cryptocurrency markets.
                  </p>
                </div>
                <div className="gap-4 hidden lg:flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  {lastRefresh && (
                    <span className="text-sm text-[#A1A1AA]">
                      Last updated: {format(lastRefresh, "HH:mm")}
                    </span>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-105"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Filters */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#252538] to-[#2A2A3E] rounded-xl p-4 sm:p-6 shadow-xl border border-[#333447]">
              {/* Tab Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 border-b border-[#404153]/50">
                <div className="flex items-center gap-4 sm:gap-6 pb-3">
                  <button
                    onClick={() => setActiveTab("categories")}
                    className={`pb-3 px-1 text-sm font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                      activeTab === "categories"
                        ? "text-[#E27625] border-[#E27625] scale-105"
                        : "text-[#A1A1AA] border-transparent hover:text-white"
                    }`}
                  >
                    Categories
                  </button>
                  <button
                    onClick={() => setActiveTab("sources")}
                    className={`pb-3 px-1 text-sm font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                      activeTab === "sources"
                        ? "text-[#E27625] border-[#E27625] scale-105"
                        : "text-[#A1A1AA] border-transparent hover:text-white"
                    }`}
                  >
                    Sources
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[#A1A1AA] sm:ml-auto pb-3 sm:pb-0">
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filters</span>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {activeTab === "categories" &&
                  categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(
                          category === "All" ? null : category
                        )
                      }
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                        selectedCategory === category ||
                        (category === "All" && !selectedCategory)
                          ? "bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white shadow-lg shadow-[#E27625]/30 scale-105"
                          : "bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white hover:scale-105"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                {activeTab === "sources" &&
                  sources.map((source) => (
                    <button
                      key={source}
                      onClick={() =>
                        setSelectedSource(source === "All" ? null : source)
                      }
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                        selectedSource === source ||
                        (source === "All" && !selectedSource)
                          ? "bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white shadow-lg shadow-[#E27625]/30 scale-105"
                          : "bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white hover:scale-105"
                      }`}
                    >
                      {source !== "All" && getSourceIcon(source)}
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && !error && filteredNews.length > 0 && (
            <div className="mb-4 flex justify-between text-sm text-[#A1A1AA] p-4 ">
              <span></span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl p-12 shadow-xl border border-[#333447]">
              <div className="flex justify-center items-center">
                <div className="relative">
                  <Loader2 className="w-12 h-12 text-[#E27625] animate-spin" />
                  <div className="absolute inset-0 w-12 h-12 border-2 border-[#E27625]/20 rounded-full animate-pulse"></div>
                </div>
                <span className="ml-4 text-[#A1A1AA] text-lg">
                  Loading news articles from all sources...
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
                  No News Articles Found
                </h3>
                <p className="text-[#A1A1AA] max-w-md mx-auto text-lg">
                  {selectedCategory || selectedSource
                    ? "No articles match your current filters. Try adjusting your selection."
                    : "There are no news articles to display yet. Check back later for updates."}
                </p>
              </div>
            </div>
          )}

          {/* News Grid */}
          {!loading && !error && paginatedNews.length > 0 && (
            <>
              <div className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] rounded-xl p-8 shadow-xl border border-[#333447]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedNews.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-gradient-to-br from-[#1C1C27] to-[#252538] hover:from-[#252538] hover:to-[#2A2A3E] text-white rounded-xl shadow-xl border border-[#404153] overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group hover:scale-105 hover:border-[#E27625]/30"
                    >
                      {/* Image Section */}
                      <div className="relative w-full h-48 overflow-hidden">
                        {/* Check for imageUrl from any source */}
                        {item.imageUrl ||
                        (item.source === "admin" && item.newsId) ? (
                          <img
                            src={
                              item.imageUrl ||
                              `${backendBaseUrl}/api/news/${item.newsId}/image`
                            }
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              // Fallback to a crypto-themed placeholder for Twitter/crypto content
                              if (!target.src.includes("placeholder")) {
                                if (item.source === "twitter") {
                                  target.src =
                                    "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop";
                                } else if (item.source === "crypto") {
                                  target.src =
                                    "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=300&fit=crop";
                                } else {
                                  target.src = "/api/placeholder/400/300";
                                }
                                target.alt = "News image";
                              }
                            }}
                            onLoad={(e) => {
                              // Add a subtle fade-in effect when image loads
                              const target = e.target as HTMLImageElement;
                              target.style.opacity = "1";
                            }}
                            style={{
                              opacity: 0,
                              transition: "opacity 0.3s ease-in-out",
                            }}
                          />
                        ) : (
                          // Enhanced placeholder with source-specific styling
                          <div className="w-full h-full bg-gradient-to-br from-[#333447] to-[#404153] flex items-center justify-center relative">
                            <div className="text-center">
                              {item.source === "twitter" && (
                                <div className="mb-2">
                                  <Twitter className="w-8 h-8 text-blue-400 mx-auto" />
                                </div>
                              )}
                              {item.source === "crypto" && (
                                <div className="mb-2">
                                  <Coins className="w-8 h-8 text-yellow-400 mx-auto" />
                                </div>
                              )}
                              {(!item.source || item.source === "admin") && (
                                <ImageIcon className="w-12 h-12 text-[#A1A1AA]/50" />
                              )}
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        {/* Enhanced badges with better visibility */}
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white text-xs font-semibold rounded-full shadow-lg">
                            {item.category}
                          </span>
                        </div>

                        {/* Add loading indicator overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/50 px-3 py-1 rounded-full text-white text-xs">
                            {item.source === "twitter"
                              ? "Twitter Post"
                              : item.source === "crypto"
                              ? "Crypto News"
                              : "Article"}
                          </div>
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
                          {item.source === "admin" && item.newsId
                            ? `ID: ${item.newsId}`
                            : `Source: ${item.source}`}
                        </span>
                        {item.sourceUrl ? (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            View Original
                          </a>
                        ) : (
                          <button
                            onClick={() => handleReadMore(item)}
                            className="text-sm bg-gradient-to-r from-[#3B82F6] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white px-3 py-1.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                          >
                            Read More
                          </button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 p-6">
                  <div className="flex justify-center items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {/* First page if not visible */}
                      {getPageNumbers()[0] > 1 && (
                        <>
                          <button
                            onClick={() => handlePageClick(1)}
                            className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white rounded-lg transition-all duration-300 hover:scale-105"
                          >
                            1
                          </button>
                          {getPageNumbers()[0] > 2 && (
                            <span className="px-3 py-2 text-sm text-[#A1A1AA]">
                              ...
                            </span>
                          )}
                        </>
                      )}

                      {/* Visible page numbers */}
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageClick(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105 ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-[#E27625] to-[#F59E0B] text-white shadow-lg shadow-[#E27625]/30"
                              : "bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      {/* Last page if not visible */}
                      {getPageNumbers()[getPageNumbers().length - 1] <
                        totalPages && (
                        <>
                          {getPageNumbers()[getPageNumbers().length - 1] <
                            totalPages - 1 && (
                            <span className="px-3 py-2 text-sm text-[#A1A1AA]">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageClick(totalPages)}
                            className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white rounded-lg transition-all duration-300 hover:scale-105"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#333447] to-[#404153] text-[#A1A1AA] hover:from-[#404153] hover:to-[#525266] hover:text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default NewsDisplayPage;
