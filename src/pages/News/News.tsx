//news page
import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaTag, FaExternalLinkAlt } from "react-icons/fa";
import { AppContext } from "@/context/AppContext";

// Define interfaces for the news data
interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
}

const News = () => {
  const { backendUrl } = useContext(AppContext)!;
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Add error state to track API errors
  const [error, setError] = useState<string | null>(null);

  // Categories for filter
  const categories = ["All", "Sports", "Crypto", "Esports", "Gaming"];

  useEffect(() => {
    fetchNews();
  }, [currentPage, selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call to fetch news - replace with your actual API endpoint
      // Add more robust error handling and logging
      console.log(`Fetching news from: ${backendUrl}/api/news/public`);
      
      const { data } = await axios.get(`${backendUrl}/api/news/public`, {
        params: {
          page: currentPage,
          limit: 6,
          category: selectedCategory === "All" ? "" : selectedCategory,
        },
        // Add timeout to prevent long waits
        timeout: 5000
      });

      if (data && data.success) {
        setNewsItems(data.news);
        setTotalPages(data.totalPages);
        console.log("Successfully fetched news data");
      } else {
        const errorMsg = "Failed to fetch news: " + (data?.message || "Unknown error");
        console.warn(errorMsg);
        setError(errorMsg);
        useFallbackData();
      }
    } catch (error: any) {
      const errorMsg = `Error fetching news: ${error.message || "Unknown error"}`;
      console.error(errorMsg);
      setError(errorMsg);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // Use fallback data if API fails
  const useFallbackData = () => {
    console.log("Using fallback news data");
    setNewsItems([
      {
        id: "1",
        title: "Manchester United Secures Dramatic Win in Premier League",
        description: "A last-minute goal gives Manchester United a crucial victory in their title race.",
        source: "Sports News Network",
        url: "#",
        imageUrl: "/api/placeholder/400/250",
        publishedAt: "2025-04-11T14:30:00Z",
        category: "Sports"
      },
      {
        id: "2",
        title: "Bitcoin Price Surges Past $100,000 for First Time",
        description: "Cryptocurrency markets rally as Bitcoin reaches new all-time high amid institutional adoption.",
        source: "Crypto Daily",
        url: "#",
        imageUrl: "/api/placeholder/400/250",
        publishedAt: "2025-04-12T09:15:00Z",
        category: "Crypto"
      },
      {
        id: "3",
        title: "Major eSports Tournament Announces $10 Million Prize Pool",
        description: "The largest prize pool in eSports history attracts top teams from around the world.",
        source: "eSports Today",
        url: "#",
        imageUrl: "/api/placeholder/400/250",
        publishedAt: "2025-04-10T11:45:00Z",
        category: "Esports"
      },
      {
        id: "4",
        title: "NBA Finals Set to Break Viewing Records",
        description: "This year's NBA finals matchup expected to draw unprecedented global audience.",
        source: "Basketball Weekly",
        url: "#",
        imageUrl: "/api/placeholder/400/250",
        publishedAt: "2025-04-09T16:20:00Z",
        category: "Sports"
      },
      {
        id: "5",
        title: "Ethereum 2.0 Upgrade Complete, Transaction Fees Plummet",
        description: "The long-awaited upgrade brings significant improvements to the Ethereum network.",
        source: "Blockchain Times",
        url: "#",
        imageUrl: "/api/placeholder/400/250",
        publishedAt: "2025-04-08T13:10:00Z",
        category: "Crypto"
      },
      {
        id: "6",
        title: "New Gaming Tournament Platform Integrates Blockchain Technology",
        description: "Revolutionary platform allows gamers to earn cryptocurrency while competing.",
        source: "Gaming Innovation",
        url: "#",
        imageUrl: "/api/placeholder/400/250",
        publishedAt: "2025-04-07T10:30:00Z",
        category: "Gaming"
      }
    ]);
    setTotalPages(5);
  };

  // Filter news based on search term
  const filteredNews = newsItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-primary text-main">
      {/* Header Banner */}
      <div className="w-full h-72 bg-cover bg-center relative" style={{ backgroundImage: "url('/api/placeholder/1200/400')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Betting News</h1>
          <p className="text-xl text-white text-center max-w-3xl">
            Stay updated with the latest news from the world of sports, crypto, and gaming.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category === "All" ? "" : category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  (category === "All" && selectedCategory === "") || selectedCategory === category
                    ? "bg-secondary text-white"
                    : "bg-secondary/10 text-sub hover:bg-secondary/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 px-4 py-2 rounded-lg bg-primary border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sub">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Show error message if API failed */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="text-sm">
              {error} (Using fallback data instead)
            </p>
          </div>
        )}

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-2xl font-semibold mb-2">No news found</h3>
            <p className="text-sub">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((news) => (
              <div key={news.id} className="bg-primary border border-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      news.category === "Sports" ? "bg-blue-500/10 text-blue-500" : 
                      news.category === "Crypto" ? "bg-purple-500/10 text-purple-500" : 
                      news.category === "Esports" ? "bg-red-500/10 text-red-500" : 
                      news.category === "Gaming" ? "bg-green-500/10 text-green-500" : 
                      "bg-secondary/10 text-secondary"
                    }`}>
                      <FaTag className="inline mr-1 text-xs" />
                      {news.category}
                    </span>
                    <span className="text-sub text-sm">
                      <FaCalendarAlt className="inline mr-1" />
                      {formatDate(news.publishedAt)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 hover:text-secondary transition-colors">
                    <Link to={`/news/${news.id}`}>{news.title}</Link>
                  </h3>
                  
                  <p className="text-sub mb-4 line-clamp-3">{news.description}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-medium">{news.source}</span>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-secondary hover:text-accent transition-colors"
                    >
                      Read more
                      <FaExternalLinkAlt className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!searchTerm && totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentPage === 1 
                    ? "bg-secondary/10 text-sub cursor-not-allowed" 
                    : "bg-secondary/10 text-sub hover:bg-secondary hover:text-white"
                }`}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    currentPage === i + 1
                      ? "bg-secondary text-white"
                      : "bg-secondary/10 text-sub hover:bg-secondary/20"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  currentPage === totalPages
                    ? "bg-secondary/10 text-sub cursor-not-allowed"
                    : "bg-secondary/10 text-sub hover:bg-secondary hover:text-white"
                }`}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;