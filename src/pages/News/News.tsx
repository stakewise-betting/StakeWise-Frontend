// src/pages/NewsPage/news.tsx
import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is installed
import NewsCard, { NewsArticle } from "../../components/NewsCard/NewsCard";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have a Skeleton component
import { SearchIcon, SlidersIcon } from "lucide-react";

// --- SIMULATION: Replace this with actual API fetching ---
// Placeholder function to simulate fetching news data like Polymarket would (from an external source/API)
const fetchAggregatedNews = async (): Promise<NewsArticle[]> => {
  console.log("Simulating fetching news from external sources...");
  // In a real scenario, you'd call your backend or a news API here.
  // Example: const response = await axios.get('/api/v1/news/aggregated');
  // Example: const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY');

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data structured like a news API response (e.g., NewsAPI.org)
  // Use data similar to the provided image for structure
  return [
    {
      id: "1", // Use unique IDs
      title: "Subversive Ballads in Elizabeth Barrett Browning's Poems (1844)",
      author: "Montobahn Sheeply",
      source: "Literary Journal", // Example source
      description:
        '"At four and a half," Elizabeth Barrett Browning reminisced, "my great delight was poring over fairy phenomenons and the a..."',
      url: "#", // Replace with actual article URL
      urlToImage:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", // Example image
      publishedAt: "2012-06-19T10:00:00Z",
      category: "GENERAL",
    },
    {
      id: "2",
      title: "Explaining Federal Budgeting Through Privilege Economy",
      author: "Arjun Guttja",
      source: "Economic Times",
      description:
        "The American federal budget, contrary to all common-sense proclamations, is not created ex nihilo each year. In fact, less...",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", // Example image
      publishedAt: "2012-06-19T09:30:00Z",
      category: "GENERAL",
    },
    {
      id: "3",
      title: "Freudian Analysis of The Manchurian Candidate",
      author: "John Antwerp",
      source: "Film Studies Quarterly",
      description:
        "The Manchurian Candidate hit the silver screen in 1962 at the the end of two important American moments: the anti-Communis...",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1470219556762-1771e7f9427d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", // Example image
      publishedAt: "2012-06-19T09:00:00Z",
      category: "GENERAL",
    },
    {
      id: "4",
      title: "Non-linearity in the Study of Consumer History",
      author: "Lawrence Bowdish",
      source: "Historical Research",
      description:
        "There is one section of American history that really lends itself to a non-linear study, but has yet to include it. Consu...",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", // Example image
      publishedAt: "2012-06-19T08:30:00Z",
      category: "GENERAL",
    },
    // Add more mock articles as needed to fill the grid
    {
      id: "5",
      title: "Exploring Renewable Energy Trends in Europe",
      author: "Jane Doe",
      source: "Energy Today",
      description:
        "European nations are accelerating their transition to renewable energy sources, driven by climate goals and technological advancements...",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      publishedAt: "2024-07-20T11:00:00Z",
      category: "Technology",
    },
    {
      id: "6",
      title: "Crypto Market Sees Volatility Amid Regulatory News",
      author: "Crypto Analyst",
      source: "CoinWatch",
      description:
        "The cryptocurrency market experienced significant price swings following announcements about potential new regulations in major economies...",
      url: "#",
      urlToImage:
        "https://images.unsplash.com/photo-1621504450280- S6HSQWf5f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", // Placeholder
      publishedAt: "2024-07-19T15:45:00Z",
      category: "Crypto",
    },
  ];
};
// --- End Simulation ---

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch news using the (simulated) aggregation function
        const fetchedArticles = await fetchAggregatedNews();

        // **IMPORTANT**: Adapt this mapping based on the ACTUAL structure
        // returned by your chosen News API or backend endpoint.
        const formattedArticles = fetchedArticles.map((article) => ({
          id: article.id || article.url, // Ensure unique ID, fallback to URL if needed
          title: article.title || "No Title",
          author: article.author || undefined, // Optional
          source:
            typeof article.source === "object"
              ? (article.source as any)?.name
              : article.source, // Handle NewsAPI source object
          description: article.description || undefined, // Optional
          url: article.url,
          urlToImage: article.urlToImage || undefined, // Optional
          publishedAt: article.publishedAt,
          category: article.category || "General", // Add category if available or default
        }));

        setArticles(formattedArticles);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news articles. Please try again later.");
        if (axios.isAxiosError(err)) {
          setError(
            `Failed to load news: ${err.response?.data?.message || err.message}`
          );
        } else if (err instanceof Error) {
          setError(`Failed to load news: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []); // Empty dependency array means this runs once on mount

  // Skeleton Loader UI
  const renderSkeletons = () =>
    Array.from({ length: 8 }).map(
      (
        _,
        index // Show 8 placeholders
      ) => (
        <div
          key={index}
          className="bg-card dark:bg-card rounded-lg shadow-md overflow-hidden"
        >
          <Skeleton className="h-40 w-full" />
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="h-6 w-full" /> {/* Title */}
            <Skeleton className="h-4 w-1/3" /> {/* Author */}
            <Skeleton className="h-12 w-full" /> {/* Description */}
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <Skeleton className="h-4 w-1/3" /> {/* Source */}
              <Skeleton className="h-4 w-1/4" /> {/* Read More */}
            </div>
          </div>
        </div>
      )
    );

  return (
    <div>
      <div className="relative w-full">
        <div className="bg-gradient-to-b from-black to-transparent absolute top-0 left-0 right-0 h-64 z-0"></div>
        <div className="relative z-10 px-6 py-16 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-4xl font-bold mb-3 text-white">
            Latest News
          </h1>
          <p className="text-gray-300 text-lg mb-12">
            Stay updated with the most recent news and developments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search news..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800/60 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-600"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="flex items-center justify-center gap-2 bg-gray-800/60 hover:bg-gray-700/70 text-white py-2.5 px-5 rounded-lg sm:w-auto">
              <SlidersIcon size={18} />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 bg-primary text-light-primary dark:text-dark-primary">

        {error && (
          <div className="text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900 p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? renderSkeletons()
            : articles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
          {!loading && articles.length === 0 && !error && (
            <p className="text-center col-span-full text-sub dark:text-dark-secondary">
              No news articles found.
            </p>
          )}
        </div>

        {/* Optional: Add Pagination component here if needed */}
        {/* <div className="mt-8 flex justify-center"> */}
        {/*   <Pagination currentPage={...} totalPages={...} onPageChange={...} /> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default NewsPage;
