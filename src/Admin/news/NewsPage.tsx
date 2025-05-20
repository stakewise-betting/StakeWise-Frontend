import React, { useState, FormEvent, useRef, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Newspaper,
  AlertCircle,
  CheckCircle,
  Save,
  Check,
  Image as ImageIcon,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Reusable Icon Wrapper (Copied from Dashboard) ---
const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`p-2 rounded-full flex items-center justify-center ${className}`}
  >
    {children}
  </div>
);

// --- Define Props (Optional: if needed from AdminPanel, e.g., backend URL) ---
interface NewsPageProps {
  backendBaseUrl?: string;
}

// News categories for selection
const NEWS_CATEGORIES = [
  "General",
  "Updates",
  "Events",
  "Results",
  "Announcements",
  "Feature",
];

// --- Main News Page Component ---
export const NewsPage: React.FC<NewsPageProps> = ({
  backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
}) => {
  // --- State Management ---
  const [newsId, setNewsId] = useState<number>(Date.now()); // Generate unique ID from timestamp
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("General"); // Default category
  const [author, setAuthor] = useState<string>("Admin"); // Default author
  const [savingStatus, setSavingStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Image Upload States
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Styling Classes (Adapted from Dashboard) ---
  const cardBaseClasses = `
        bg-card text-dark-primary rounded-xl shadow-lg
        border border-gray-700/60
        transition-all duration-300 ease-in-out
        bg-noise dark
        overflow-hidden
    `;

  const inputBaseClasses = `
        bg-black/20 border border-gray-700/50 rounded-md
        text-dark-primary placeholder:text-dark-secondary/60
        px-3 py-2
        outline-none focus:outline-none focus:ring-0 focus:ring-primary focus:border-transparent focus:shadow-none
    `;

  // Generate new ID when form is cleared
  const generateNewId = () => {
    setNewsId(Date.now());
  };

  // --- Image Upload Handlers ---
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSavingStatus("error");
      setSaveMessage("Image file too large (max 5MB)");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setSavingStatus("error");
      setSaveMessage("Please select an image file");
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --- Form Submission Handler ---
  const saveNewsToDatabase = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newsId || !title || !content || !category) {
      setSavingStatus("error");
      setSaveMessage("All required fields must be filled");
      return;
    }

    // Set status to saving
    setSavingStatus("saving");
    setSaveMessage("");

    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append("newsId", newsId.toString());
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      formData.append("author", author);

      // Add image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Make API call to save news with FormData
      const response = await fetch(`${backendBaseUrl}/api/news/save-news`, {
        method: "POST",
        credentials: "include", // Include cookies for authentication
        body: formData, // Using FormData instead of JSON
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save news article");
      }

      // Set status to success
      setSavingStatus("success");
      setSaveMessage("News article saved successfully!");

      // Clear form on success
      clearForm();

      // Reset status after 3 seconds
      setTimeout(() => {
        setSavingStatus("idle");
        setSaveMessage("");
      }, 3000);
    } catch (error: any) {
      console.error("Error saving news article:", error);

      // Set status to error
      setSavingStatus("error");

      // Handle duplicate entry error or other specific errors
      if (error.message.includes("already exists")) {
        setSaveMessage("A news article with this ID already exists");
      } else {
        setSaveMessage(`Error: ${error.message}`);
      }

      // Reset error status after 5 seconds
      setTimeout(() => {
        setSavingStatus("idle");
        setSaveMessage("");
      }, 5000);
    }
  };

  // Clear form and generate new ID
  const clearForm = () => {
    setTitle("");
    setContent("");
    setCategory("General");
    setAuthor("Admin");
    clearImageSelection();
    generateNewId();
  };

  // Determine button appearance based on saving status
  const getSaveButtonContent = () => {
    switch (savingStatus) {
      case "saving":
        return (
          <>
            <span className="animate-pulse">Saving...</span>
          </>
        );
      case "success":
        return (
          <>
            <Check className="w-4 h-4" />
            <span>Saved!</span>
          </>
        );
      case "error":
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <Save className="w-4 h-4" />
            <span>Create Article</span>
          </>
        );
    }
  };

  const getSaveButtonClass = () => {
    switch (savingStatus) {
      case "success":
        return "bg-green-600 text-white";
      case "error":
        return "bg-red-600 text-white";
      case "saving":
        return "bg-blue-600 text-white";
      default:
        return "bg-[#f97316] text-white hover:bg-orange-600";
    }
  };

  return (
    <div className="bg-primary min-h-screen p-4 sm:p-6 lg:p-8 text-dark-primary">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 sm:mb-8 text-dark-primary flex items-center gap-3">
        <IconWrapper className="bg-secondary/20">
          <Newspaper className="w-6 h-6 text-secondary" />
        </IconWrapper>
        Manage News
      </h2>

      {/* Add News Form Card */}
      <Card className={`${cardBaseClasses} max-w-2xl mx-auto`}>
        <CardHeader className="px-4 pt-4 pb-3 border-b border-gray-700/50">
          <CardTitle className="text-lg font-semibold text-dark-primary">
            Add New Article
          </CardTitle>
          <CardDescription className="text-sm text-dark-secondary">
            Publish updates and news for users.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-5">
          <form onSubmit={saveNewsToDatabase} className="space-y-5">
            {/* News ID (Hidden or Disabled) */}
            <div className="space-y-2">
              <Label
                htmlFor="news-id"
                className="text-sm font-medium text-dark-secondary"
              >
                News ID
              </Label>
              <Input
                id="news-id"
                type="number"
                value={newsId}
                onChange={(e) => setNewsId(parseInt(e.target.value))}
                className={`${inputBaseClasses} bg-gray-800/40`}
                disabled
              />
              <p className="text-xs text-dark-secondary/70">
                Auto-generated unique ID for this news article
              </p>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <Label
                htmlFor="news-title"
                className="text-sm font-medium text-dark-secondary"
              >
                Title
              </Label>
              <Input
                id="news-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title"
                className={inputBaseClasses}
                required
                disabled={savingStatus === "saving"}
              />
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <Label
                htmlFor="news-category"
                className="text-sm font-medium text-dark-secondary"
              >
                Category
              </Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger
                  id="news-category"
                  className={inputBaseClasses}
                  disabled={savingStatus === "saving"}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-primary text-dark-secondary border border-gray-200 shadow-md z-50">
                  {NEWS_CATEGORIES.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="hover:bg-dark-secondary hover:text-primary cursor-pointer rounded-md transition-colors"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Author Input */}
            <div className="space-y-2">
              <Label
                htmlFor="news-author"
                className="text-sm font-medium text-dark-secondary"
              >
                Author
              </Label>
              <Input
                id="news-author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                className={inputBaseClasses}
                disabled={savingStatus === "saving"}
              />
              <p className="text-xs text-dark-secondary/70">
                Defaults to "Admin" if left empty
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label
                htmlFor="news-image"
                className="text-sm font-medium text-dark-secondary"
              >
                Featured Image
              </Label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative mt-2 rounded-md overflow-hidden w-full max-w-md">
                  <img
                    src={imagePreview}
                    alt="Selected image preview"
                    className="w-full h-48 object-cover border border-gray-700/50 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={clearImageSelection}
                    className="absolute top-2 right-2 bg-black/60 p-1 rounded-full hover:bg-black/80 transition-colors"
                    title="Remove image"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              )}

              {/* File Input */}
              {!imagePreview && (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="news-image"
                    className={`w-full h-32 flex flex-col items-center justify-center px-4 py-6 
                                        border-2 border-dashed border-gray-700/50 rounded-lg cursor-pointer
                                        bg-black/10 hover:bg-black/20 transition-colors
                                        ${
                                          savingStatus === "saving"
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                        }`}
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-400">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">(Max 5MB)</p>
                    <input
                      id="news-image"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                      disabled={savingStatus === "saving"}
                    />
                  </label>
                </div>
              )}
              <p className="text-xs text-dark-secondary/70">
                Optional: Add a featured image for the news article
              </p>
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <Label
                htmlFor="news-content"
                className="text-sm font-medium text-dark-secondary"
              >
                Content
              </Label>
              <Textarea
                id="news-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your news article here..."
                className={`${inputBaseClasses} min-h-[150px]`}
                required
                disabled={savingStatus === "saving"}
              />
            </div>

            {/* Submission Feedback */}
            {saveMessage && (
              <div
                className={`flex items-center gap-2 text-sm p-3 rounded-md ${
                  savingStatus === "error"
                    ? "text-red-500 bg-red-900/20 border border-red-500/30"
                    : "text-admin-success-light bg-admin-success/20 border border-admin-success/30"
                }`}
              >
                {savingStatus === "error" ? (
                  <AlertCircle size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}
                <span>{saveMessage}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end pt-3 gap-3">
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2"
                disabled={savingStatus === "saving"}
              >
                Clear Form
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${getSaveButtonClass()}`}
                disabled={
                  savingStatus === "saving" || savingStatus === "success"
                }
              >
                {getSaveButtonContent()}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
