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
  backendBaseUrl = "http://localhost:5000",
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
    <div className="w-full bg-gray-900 text-gray-100 relative">
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b border-gray-700 bg-gray-800">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-auto md:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-gray-800 border border-gray-600 text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm h-9 px-3"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading news articles...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 m-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Error Loading News</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Table Container */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-gray-100">
            {/* Desktop Table Header */}
            <thead className="hidden md:table-header-group border-b border-gray-700 bg-gray-800/50">
              <tr className="hover:bg-transparent">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap w-[100px]">
                  News ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 min-w-[250px]">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap w-[120px]">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap w-[120px]">
                  Author
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap w-[130px]">
                  Published Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredNews.length > 0 ? (
                filteredNews.map((item, index) => (
                  <tr
                    key={item._id}
                    className={`block md:table-row hover:bg-gray-800/30 transition-colors border-b border-gray-700/30
                      ${index % 2 === 0 ? "bg-gray-900/50" : "bg-transparent"}
                    `}
                  >
                    {/* Mobile Card Layout */}
                    <td className="block md:hidden p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="font-semibold text-gray-100 text-sm">
                            {item.title}
                          </span>
                          <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full">
                            #{item.newsId}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span className="bg-gray-700/40 px-2 py-0.5 rounded">
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
                        <div className="flex justify-end gap-2">
                          <button
                            className="h-7 text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleEdit(item)}
                            disabled={updatingIds.has(item.newsId)}
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>
                          <button
                            className="h-7 text-xs px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <td className="hidden md:table-cell px-4 py-3 font-medium text-blue-400">
                      #{item.newsId}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 font-medium text-gray-100">
                      <div className="max-w-xs truncate" title={item.title}>
                        {item.title}
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-700/40 text-gray-300 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-gray-400">
                      {item.author}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-gray-400">
                      {formatDate(item.publishDate)}
                    </td>
                    <td className="hidden md:table-cell px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="h-7 text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleEdit(item)}
                          disabled={updatingIds.has(item.newsId)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          className="h-7 text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleDelete(item.newsId)}
                          disabled={deletingIds.has(item.newsId)}
                        >
                          {deletingIds.has(item.newsId) ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="block md:table-row hover:bg-transparent">
                  <td
                    colSpan={6}
                    className="block md:table-cell px-4 py-10 md:text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                      <div className="p-3 rounded-full bg-gray-800 text-gray-400">
                        <AlertCircle className="h-8 w-8" />
                      </div>
                      <p className="text-gray-100 font-semibold mt-2">
                        {hasActiveFilters
                          ? "No news articles match filters"
                          : "No news articles found"}
                      </p>
                      <p className="text-gray-400 text-sm max-w-xs">
                        {hasActiveFilters
                          ? "Try adjusting your search or filters."
                          : "Check back later for new articles."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm"
                        >
                          Clear Search & Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-gray-100">
                Edit News Article #{editingItem.newsId}
              </h2>
              <button
                onClick={handleCloseEdit}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => handleFormChange("content", e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-vertical"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={editForm.author}
                    onChange={(e) => handleFormChange("author", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={editForm.publishDate}
                  onChange={(e) =>
                    handleFormChange("publishDate", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Update Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFormChange("image", e.target.files?.[0] || null)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 file:bg-gray-600 file:border-0 file:text-gray-200 file:px-4 file:py-1 file:rounded-md file:mr-4"
                />
                {editingItem.imageUrl && (
                  <p className="text-sm text-gray-400 mt-1">
                    Current image: {editingItem.imageUrl}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={handleCloseEdit}
                className="px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updatingIds.has(editingItem.newsId)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
