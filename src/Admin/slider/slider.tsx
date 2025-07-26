import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Edit,
  Trash2,
  X,
  Plus,
  Calendar,
  FileImage,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SliderType {
  _id: string;
  heading: string;
  description: string;
  addedDate: string;
  image: {
    filename: string;
    contentType: string;
  };
  status: string;
  order?: number;
}

interface FormDataType {
  heading: string;
  description: string;
  status: "active" | "inactive";
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SliderManagement = () => {
  const [currentView, setCurrentView] = useState<"list" | "form">("list");
  const [editingSlider, setEditingSlider] = useState<SliderType | null>(null);
  const [sliders, setSliders] = useState<SliderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormDataType>({
    heading: "",
    description: "",
    status: "active",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    if (editingSlider) {
      setFormData({
        heading: editingSlider.heading || "",
        description: editingSlider.description || "",
        status: editingSlider.status as "active" | "inactive",
      });
      setPreviewUrl(`${API_BASE_URL}/sliders/image/${editingSlider._id}`);
    } else {
      resetForm();
    }
  }, [editingSlider]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const resetForm = () => {
    setFormData({
      heading: "",
      description: "",
      status: "active",
    });
    setImageFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/sliders/all-sliders`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSliders(data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setError(
        "Failed to fetch sliders. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setError("Image is too large (max 25MB)");
      return;
    }

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Please select only JPG or PNG images");
      return;
    }

    setError(null);
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (!editingSlider) {
      setPreviewUrl(null);
    } else {
      setPreviewUrl(`${API_BASE_URL}/sliders/image/${editingSlider._id}`);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.heading || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    if (!editingSlider && !imageFile) {
      setError("Image is required for new slider");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = new FormData();
      submitData.append("heading", formData.heading);
      submitData.append("description", formData.description);
      submitData.append("status", formData.status);

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      let response;
      if (editingSlider) {
        // Update existing slider
        response = await fetch(
          `${API_BASE_URL}/sliders/update-slider/${editingSlider._id}`,
          {
            method: "PUT",
            body: submitData,
          }
        );
      } else {
        // Create new slider
        response = await fetch(`${API_BASE_URL}/sliders/save-slider`, {
          method: "POST",
          body: submitData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setSuccess(
        editingSlider
          ? "Slider updated successfully!"
          : "Slider created successfully!"
      );

      // Reset form and switch to list view
      resetForm();
      setEditingSlider(null);
      setCurrentView("list");

      // Refresh sliders list
      await fetchSliders();
    } catch (error: any) {
      console.error("Error saving slider:", error);
      setError(error.message || "Error saving slider. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (slider: SliderType) => {
    setEditingSlider(slider);
    setCurrentView("form");
  };

  const handleDelete = async (sliderId: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/sliders/delete-slider/${sliderId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setSuccess("Slider deleted successfully!");
      await fetchSliders();
    } catch (error: any) {
      console.error("Error deleting slider:", error);
      setError(error.message || "Error deleting slider. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-500 text-white shadow-lg">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-500 text-white shadow-lg">
        <AlertCircle className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const LoadingIndicator = () => (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        ></div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">Loading Sliders...</h3>
        <p className="text-slate-400">
          Please wait while we fetch the latest data...
        </p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="min-h-screen bg-[#1C1C27] text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="p-2 rounded-full flex items-center justify-center bg-secondary/20">
                <FileImage className="w-6 h-6 text-secondary" />
              </div>
              Slider Management
            </h2>
            <p className="text-slate-400 text-lg">
              Create, manage, and monitor homepage sliders
            </p>
          </div>

          {currentView === "list" && (
            <Button
              onClick={() => setCurrentView("form")}
              className="group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none relative overflow-hidden bg-secondary/20 text-white border border-secondary/50 shadow-lg hover:bg-secondary/30 hover:shadow-xl hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <div className="flex items-center justify-center mr-3 rounded-lg transition-all duration-300 h-8 w-8 bg-secondary/20 text-secondary shadow-lg">
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span className="text-sm font-semibold transition-colors duration-300">
                Add New Slider
              </span>
            </Button>
          )}
        </div>

        {currentView === "form" ? (
          <div className="space-y-6">
            {success && (
              <Alert className="border-green-500/50 bg-green-900/20 text-green-300">
                <CheckCircle className="h-5 w-5 !text-green-400" />
                <AlertTitle className="font-semibold text-green-300">
                  Success
                </AlertTitle>
                <AlertDescription className="mt-2 text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white">
                    {editingSlider ? "Edit Slider" : "Add New Slider"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      resetForm();
                      setCurrentView("list");
                      setEditingSlider(null);
                    }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-8 animate-fade-in">
                  {error && (
                    <Alert className="border-red-500/50 bg-red-900/20 text-red-300">
                      <AlertCircle className="h-5 w-5 !text-red-400" />
                      <AlertTitle className="font-semibold text-red-300">
                        Error
                      </AlertTitle>
                      <AlertDescription className="mt-2 text-red-400">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label
                          htmlFor="heading"
                          className="text-slate-300 font-medium mb-2 block"
                        >
                          Heading <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          id="heading"
                          type="text"
                          value={formData.heading}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              heading: e.target.value,
                            }))
                          }
                          placeholder="Enter heading"
                          maxLength={100}
                          className="bg-[#262633] border-2 border-gray-700 focus:border-secondary rounded-lg shadow-sm text-white placeholder:text-gray-500"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Maximum 100 characters
                        </p>
                      </div>

                      <div>
                        <Label
                          htmlFor="description"
                          className="text-slate-300 font-medium mb-2 block"
                        >
                          Description <span className="text-red-400">*</span>
                        </Label>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Enter description"
                          maxLength={500}
                          rows={4}
                          className="w-full px-3 py-2 bg-[#262633] border-2 border-gray-700 focus:border-secondary rounded-lg shadow-sm text-white resize-none placeholder:text-gray-500"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          {formData.description.length}/500 characters
                        </p>
                      </div>

                      <div>
                        <Label className="text-slate-300 font-medium mb-2 block">
                          Status
                        </Label>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`relative inline-flex h-6 w-12 items-center rounded-full cursor-pointer transition-colors ${
                              formData.status === "active"
                                ? "bg-green-900/40"
                                : "bg-red-900/40"
                            }`}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                status:
                                  formData.status === "active"
                                    ? "inactive"
                                    : "active",
                              }))
                            }
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                                formData.status === "active"
                                  ? "bg-green-600 translate-x-7"
                                  : "bg-red-600 translate-x-1"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-sm font-medium px-2 py-1 rounded-md ${
                              formData.status === "active"
                                ? "text-green-400 bg-green-900/30"
                                : "text-red-400 bg-red-900/30"
                            }`}
                          >
                            {formData.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label className="text-slate-300 font-medium mb-2 block">
                          Upload Image{" "}
                          {!editingSlider && (
                            <span className="text-red-400">*</span>
                          )}
                        </Label>

                        {previewUrl ? (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-48 object-cover border-2 border-gray-700 rounded-lg shadow-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src =
                                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
                              }}
                            />
                            <Button
                              type="button"
                              onClick={handleRemoveImage}
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2 bg-black/60 border-white/20 hover:bg-black/80 text-white"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-secondary transition-colors bg-gradient-to-br from-secondary/5 to-orange-500/5">
                            <Upload className="w-12 h-12 text-secondary mx-auto mb-4" />
                            <p className="text-white mb-2 font-medium">
                              Click to upload image
                            </p>
                            <p className="text-sm text-slate-400 mb-4">
                              JPG or PNG (Max 25MB)
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/jpeg,image/jpg,image/png"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              variant="outline"
                              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                            >
                              Choose File
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700/60">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        resetForm();
                        setCurrentView("list");
                        setEditingSlider(null);
                      }}
                      disabled={isSubmitting}
                      className="border-2 border-gray-700 hover:bg-gray-700 transition-colors text-white"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="bg-secondary hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          {editingSlider ? "Update Slider" : "Create Slider"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {success && (
              <Alert className="border-green-500/50 bg-green-900/20 text-green-300">
                <CheckCircle className="h-5 w-5 !text-green-400" />
                <AlertTitle className="font-semibold text-green-300">
                  Success
                </AlertTitle>
                <AlertDescription className="mt-2 text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-500/50 bg-red-900/20 text-red-300">
                <AlertCircle className="h-5 w-5 !text-red-400" />
                <AlertTitle className="font-semibold text-red-300">
                  Error
                </AlertTitle>
                <AlertDescription className="mt-2 text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-gradient-to-br from-[#1C1C27] to-[#262633] border border-gray-700/30 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
              <div className="p-6">
                <div className="mb-6">
                  <CardTitle className="text-xl font-bold text-white">
                    Active Sliders
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your homepage banner sliders
                  </CardDescription>
                </div>

                {sliders.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileImage className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No sliders found
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Add your first slider to get started with homepage
                      banners.
                    </p>
                    <Button
                      onClick={() => setCurrentView("form")}
                      className="bg-secondary hover:bg-orange-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Slider
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#262633] border-b border-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Added Date
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Slider Details
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Image
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {sliders.map((slider) => (
                          <tr
                            key={slider._id}
                            className="hover:bg-[#262633]/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-white">
                                <Calendar className="w-4 h-4 mr-2 text-secondary" />
                                {formatDate(slider.addedDate)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="max-w-xs">
                                <div className="text-sm font-medium text-white mb-1">
                                  {slider.heading}
                                </div>
                                <div className="text-sm text-slate-400 truncate">
                                  {slider.description}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileImage className="w-4 h-4 mr-2 text-secondary" />
                                <span className="text-sm text-white font-medium">
                                  {slider.image.filename}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(slider.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={() => handleEdit(slider)}
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-700 hover:bg-gray-700 hover:border-secondary text-secondary"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(slider._id)}
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-700 hover:bg-red-900/20 hover:border-red-500 text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderManagement;
