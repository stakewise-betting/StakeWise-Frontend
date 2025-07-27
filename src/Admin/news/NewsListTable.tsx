import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Search,
  Loader2,
  Calendar,
  User,
  Edit2,
  X,
  Save,
  Trash2,
  Filter,
} from "lucide-react";

// News interface matching your schema
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

interface NewsListTableProps {
  backendBaseUrl?: string;
}

export const NewsListTable: React.FC<NewsListTableProps> = ({
  backendBaseUrl = "https://stakewisebackend.onrender.com",
}) => {
  // State for news data
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Edit modal state
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    category: "",
    author: "",
    publishDate: "",
    image: null as File | null,
  });

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
          credentials: "include",
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

  // Open edit modal
  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setEditForm({
      title: item.title,
      content: item.content,
      category: item.category,
      author: item.author,
      publishDate: item.publishDate.split("T")[0], // Format for date input
      image: null,
    });
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setEditingItem(null);
    setEditForm({
      title: "",
      content: "",
      category: "",
      author: "",
      publishDate: "",
      image: null,
    });
  };

  // Handle form input changes
  const handleFormChange = (field: string, value: string | File | null) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Update news item
  const handleUpdate = async () => {
    if (!editingItem) return;

    setUpdatingIds((prev) => new Set(prev).add(editingItem.newsId));

    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("content", editForm.content);
      formData.append("category", editForm.category);
      formData.append("author", editForm.author);
      formData.append("publishDate", editForm.publishDate);

      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const response = await fetch(
        `${backendBaseUrl}/api/news/${editingItem.newsId}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update news article");
      }

      const updatedItem = await response.json();

      // Update the item in local state
      setNewsItems((prevItems) =>
        prevItems.map((item) =>
          item.newsId === editingItem.newsId
            ? { ...item, ...updatedItem }
            : item
        )
      );

      handleCloseEdit();
      console.log("News article updated successfully");
    } catch (err: any) {
      console.error("Error updating news:", err);
      alert(`Failed to update news article: ${err.message}`);
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(editingItem.newsId);
        return newSet;
      });
    }
  };

  // Delete news item
  const handleDelete = async (newsId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this news article? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(newsId));

    try {
      const response = await fetch(`${backendBaseUrl}/api/news/${newsId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete news article");
      }

      // Remove the deleted item from the state
      setNewsItems((prevItems) =>
        prevItems.filter((item) => item.newsId !== newsId)
      );

      console.log("News article deleted successfully");
    } catch (err: any) {
      console.error("Error deleting news:", err);
      alert(`Failed to delete news article: ${err.message}`);
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(newsId);
        return newSet;
      });
    }
  };

  // Get category styling based on category name
  const getCategoryStyle = (category: string) => {
    const styles = {
      general: "bg-blue-600/20 text-blue-300 border-blue-500/30",
      updates: "bg-green-600/20 text-green-300 border-green-500/30",
      events: "bg-purple-600/20 text-purple-300 border-purple-500/30",
      results: "bg-orange-600/20 text-orange-300 border-orange-500/30",
      announcements: "bg-red-600/20 text-red-300 border-red-500/30",
      feature: "bg-cyan-600/20 text-cyan-300 border-cyan-500/30",
    };

    return (
      styles[category.toLowerCase() as keyof typeof styles] ||
      "bg-gray-700/30 text-slate-300 border-gray-600/20"
    );
  };

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(newsItems.map((item) => item.category))),
  ];

  // Filter news items based on search term and category
  const filteredNews = newsItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.newsId.toString().includes(searchTerm) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "All";

  return (
    <div className="w-full">
      {/* Search and Filter Controls - EventListTable Style */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-6 py-5 border-b border-gray-700/30 bg-[#1C1C27] backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h2 className="text-lg font-semibold text-white">News Overview</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Search news by title, ID, author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 w-full bg-gray-800/20 border-gray-600/20 text-white placeholder:text-gray-300 focus:border-indigo-500/50 focus:ring-indigo-500/30 focus:bg-gray-800/30 rounded-xl font-medium shadow-lg hover:border-gray-500/30 hover:bg-gray-800/25 transition-all duration-300"
            />
          </div>

          {/* Filter Button with Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 bg-secondary/10 from-secondary/20 to-secondary/10 border border-secondary/40 text-secondary hover:from-secondary/30 hover:to-secondary/20 hover:border-secondary/60 transition-all duration-300 rounded-xl px-6 font-medium shadow-lg backdrop-blur-sm appearance-none pr-10 focus:outline-none focus:ring-0"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-primary text-slate-300"
                >
                  {category}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-6 py-12 text-center bg-[#1C1C27]">
          <div className="relative">
            <div className="p-6 rounded-2xl bg-[#1C1C27] border border-gray-600/30">
              <Loader2 className="h-12 w-12 text-slate-400 mx-auto animate-spin" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">
              Loading news articles...
            </h3>
            <p className="text-slate-400 max-w-md leading-relaxed">
              Please wait while we fetch the latest news content.
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex flex-col items-center justify-center gap-6 py-12 text-center bg-[#1C1C27]">
          <div className="relative">
            <div className="p-6 rounded-2xl bg-[#1C1C27] border border-red-600/30">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white">Error Loading News</h3>
            <p className="text-slate-400 max-w-md leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Table Container - EventListTable Style */}
      {!loading && !error && (
        <div className="overflow-x-auto bg-[#1C1C27] rounded-xl border border-gray-700/30 backdrop-blur-sm">
          <table className="w-full border-collapse text-sm text-white">
            {/* Header hidden on small screens, displayed as table header group on medium+ */}
            <thead className="hidden md:table-header-group [&_tr]:border-b [&_tr]:border-gray-700/30 bg-[#1C1C27] backdrop-blur-sm">
              <tr className="hover:bg-transparent">
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[100px]">
                  News ID
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 min-w-[250px]">
                  Title
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[120px]">
                  Category
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[120px]">
                  Author
                </th>
                <th className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[130px]">
                  Published Date
                </th>
                <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="[&_tr:last-child]:border-0">
              {filteredNews.length === 0 ? (
                <tr className="block md:table-row hover:bg-transparent">
                  <td
                    colSpan={6}
                    className="block md:table-cell px-6 py-12 md:text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
                      <div className="relative">
                        <div className="p-6 rounded-2xl bg-[#1C1C27] border border-gray-600/30">
                          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white">
                          {hasActiveFilters
                            ? "No news articles match your criteria"
                            : "No news articles found"}
                        </h3>
                        <p className="text-slate-400 max-w-md leading-relaxed">
                          {hasActiveFilters
                            ? "Try adjusting your search terms or filters to find what you're looking for."
                            : "Check back later for new articles or create your first news article!"}
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg px-6 py-2 font-medium transition-all duration-300"
                        >
                          Clear Search & Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredNews.map((item) => (
                  <tr
                    key={item._id}
                    className="block md:table-row hover:bg-gray-800/20 transition-all duration-200 border-b border-gray-700/20"
                  >
                    {/* Mobile Card Layout */}
                    <td className="block md:hidden p-4">
                      <div className="space-y-3 bg-gray-800/10 rounded-lg p-4 border border-gray-700/20 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-white text-sm leading-relaxed">
                            {item.title}
                          </span>
                          <span className="text-xs bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full font-medium">
                            #{item.newsId}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span
                            className={`px-2 py-1 rounded-lg font-medium text-xs border ${getCategoryStyle(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.publishDate)}
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            className="h-8 text-xs px-3 py-1 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-500/30 text-blue-300 rounded-lg flex items-center gap-1 transition-all duration-300 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEdit(item)}
                            disabled={updatingIds.has(item.newsId)}
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            className="h-8 text-xs px-3 py-1 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30 text-red-300 rounded-lg flex items-center gap-1 transition-all duration-300 font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleDelete(item.newsId)}
                            disabled={deletingIds.has(item.newsId)}
                          >
                            {deletingIds.has(item.newsId) ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Desktop Table Layout */}
                    <td className="hidden md:table-cell px-3 py-4 font-bold text-indigo-300">
                      #{item.newsId}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 font-medium text-white">
                      <div
                        className="max-w-xs truncate font-semibold"
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getCategoryStyle(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 text-slate-300 font-medium">
                      {item.author}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 text-slate-300">
                      {formatDate(item.publishDate)}
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="h-8 w-8 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-500/30 text-blue-300 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleEdit(item)}
                          disabled={updatingIds.has(item.newsId)}
                          title="Edit Article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="h-8 w-8 bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 border border-red-500/30 text-red-300 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDelete(item.newsId)}
                          disabled={deletingIds.has(item.newsId)}
                          title="Delete Article"
                        >
                          {deletingIds.has(item.newsId) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls (Optional - EventListTable Style) */}
      {filteredNews.length > 10 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-5 border-t border-gray-700/30 bg-[#1C1C27] text-sm gap-4 backdrop-blur-sm">
          <div className="text-slate-300">
            Showing{" "}
            <span className="font-semibold text-white bg-gray-700/30 px-2 py-1 rounded-lg">
              1
            </span>{" "}
            -{" "}
            <span className="font-semibold text-white bg-gray-700/30 px-2 py-1 rounded-lg">
              {Math.min(filteredNews.length, 10)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-emerald-300">
              {filteredNews.length}
            </span>{" "}
            articles
          </div>
          <div className="flex items-center gap-3">
            <button
              disabled
              className="h-10 bg-gray-700/30 border-gray-600/30 text-gray-400 cursor-not-allowed rounded-lg px-4"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-white font-medium">Page 1</span>
            </div>
            <button
              disabled
              className="h-10 bg-gray-700/30 border-gray-600/30 text-gray-400 cursor-not-allowed rounded-lg px-4"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal - Updated styling to match theme */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1C1C27] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700/30 backdrop-blur-sm">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/30">
              <h2 className="text-xl font-semibold text-white">
                Edit News Article #{editingItem.newsId}
              </h2>
              <button
                onClick={handleCloseEdit}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800/20 border border-gray-600/20 rounded-lg text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                  Content
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => handleFormChange("content", e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-800/20 border border-gray-600/20 rounded-lg text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-vertical transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-indigo-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-800/20 border border-gray-600/20 rounded-lg text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-indigo-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editForm.author}
                    onChange={(e) => handleFormChange("author", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/20 border border-gray-600/20 rounded-lg text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={editForm.publishDate}
                  onChange={(e) =>
                    handleFormChange("publishDate", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-800/20 border border-gray-600/20 rounded-lg text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-300"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                  Update Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFormChange("image", e.target.files?.[0] || null)
                  }
                  className="w-full px-3 py-2 bg-gray-800/20 border border-gray-600/20 rounded-lg text-white focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 file:bg-gray-700/30 file:border-0 file:text-slate-300 file:px-4 file:py-1 file:rounded-lg file:mr-4 transition-all duration-300"
                />
                {editingItem.imageUrl && (
                  <p className="text-sm text-slate-400 mt-1">
                    Current image: {editingItem.imageUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700/30">
              <button
                onClick={handleCloseEdit}
                className="px-4 py-2 text-slate-300 bg-gray-700/30 hover:bg-gray-600/30 rounded-lg transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updatingIds.has(editingItem.newsId)}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingIds.has(editingItem.newsId) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {updatingIds.has(editingItem.newsId)
                  ? "Updating..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
