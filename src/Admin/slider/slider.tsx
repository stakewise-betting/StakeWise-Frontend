"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { Activity, AlertCircle, Pencil, Trash2, Upload } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Define the Slider type
interface Slider {
  id: string;
  heading: string;
  description: string;
  buttonName: string;
  buttonPath: string;
  image: string;
  addedDate: string;
}

// Define form errors type
interface FormErrors {
  heading?: string;
  description?: string;
  buttonName?: string;
  buttonPath?: string;
  image?: string;
}

export default function SliderPage() {
  // State for sliders data
  const [sliders, setSliders] = useState<Slider[]>([
    {
      id: "1",
      heading: "LAS VEGAS",
      description:
        "Get up to speed with everything you need to know about the F1 Las Vegas Grand Prix. Don't miss a single race, place over 50 laps of the 6.2-kilometre Las Vegas Strip Circuit in Nevada, USA, on Saturday.",
      buttonName: "Buy Now",
      buttonPath: "home/category/f1/lasvegas",
      image: "f1Car.png",
      addedDate: "24 Apr",
    },
    {
      id: "2",
      heading: "New Event added",
      description: "Check out our latest event details",
      buttonName: "Learn More",
      buttonPath: "home/events/new",
      image: "evms.png",
      addedDate: "16 Feb",
    },
    {
      id: "3",
      heading: "LAS VEGAS",
      description:
        "Get up to speed with everything you need to know about the F1 Las Vegas Grand Prix.",
      buttonName: "Buy Now",
      buttonPath: "home/category/f1/lasvegas",
      image: "f1Car.png",
      addedDate: "24 Apr",
    },
    {
      id: "4",
      heading: "New Event added",
      description: "Check out our latest event details",
      buttonName: "Learn More",
      buttonPath: "home/events/new",
      image: "evms.png",
      addedDate: "16 Feb",
    },
  ]);

  // State for form management
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Slider, "id" | "addedDate">>({
    heading: "",
    description: "",
    buttonName: "",
    buttonPath: "",
    image: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form handlers
  const handleAddNew = () => {
    setFormData({
      heading: "",
      description: "",
      buttonName: "",
      buttonPath: "",
      image: "",
    });
    setFile(null);
    setErrors({});
    setTouched({});
    setEditingSlider(null);
    setIsFormOpen(true);
  };

  const handleEdit = (slider: Slider) => {
    setFormData({
      heading: slider.heading,
      description: slider.description,
      buttonName: slider.buttonName,
      buttonPath: slider.buttonPath,
      image: slider.image,
    });
    setFile(null);
    setErrors({});
    setTouched({});
    setEditingSlider(slider);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setSliders(sliders.filter((slider) => slider.id !== id));
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingSlider(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate();
  };

  // Form validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!formData.buttonName.trim()) {
      newErrors.buttonName = "Button name is required";
    }

    if (!formData.buttonPath.trim()) {
      newErrors.buttonPath = "Button path is required";
    }

    if (!editingSlider?.image && !file && !formData.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File handling
  const validateFile = (file: File): boolean => {
    // Check file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only JPEG and PNG files are allowed");
      return false;
    }

    // Check file size (25MB = 25 * 1024 * 1024 bytes)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("File size must be less than 25MB");
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setFormData((prev) => ({ ...prev, image: selectedFile.name }));
        setTouched((prev) => ({ ...prev, image: true }));
        setErrors((prev) => ({ ...prev, image: undefined }));
      } else {
        e.target.value = "";
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setFormData((prev) => ({ ...prev, image: droppedFile.name }));
        setTouched((prev) => ({ ...prev, image: true }));
        setErrors((prev) => ({ ...prev, image: undefined }));
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelUpload = () => {
    setFile(null);
    setFormData((prev) => ({ ...prev, image: editingSlider?.image || "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!editingSlider?.image) {
      setErrors((prev) => ({ ...prev, image: "Image is required" }));
    }
  };

  const handleDoneUpload = () => {
    // In a real app, you would upload the file to a server here
    console.log("File ready for upload:", file);
  };

  const handleClearForm = () => {
    setFormData({
      heading: "",
      description: "",
      buttonName: "",
      buttonPath: "",
      image: "",
    });
    setFile(null);
    setErrors({});
    setTouched({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    const isValid = validate();

    if (isValid) {
      if (editingSlider) {
        // Update existing slider
        setSliders(
          sliders.map((s) =>
            s.id === editingSlider.id
              ? {
                  ...editingSlider,
                  ...formData,
                }
              : s
          )
        );
      } else {
        // Add new slider
        const newSlider = {
          ...formData,
          id: Date.now().toString(),
          addedDate: new Date().toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
          }),
        };
        setSliders([...sliders, newSlider]);
      }
      setIsFormOpen(false);
      setEditingSlider(null);
    } else {
      // Mark all fields as touched to show errors
      const allTouched: Record<string, boolean> = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
    }
  };

  // Icon wrapper component
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="p-2 rounded-full flex items-center justify-center bg-secondary/20">
      {children}
    </div>
  );

  // Render the slider form
  const renderSliderForm = () => {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="block text-sm font-medium mb-1 text-dark-primary">
                Heading
              </Label>
              <Input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 bg-gray-800/50 border rounded-md text-dark-primary ${
                  touched.heading && errors.heading
                    ? "border-red-500"
                    : "border-gray-700/60"
                }`}
                placeholder="Enter heading"
              />
              {touched.heading && errors.heading && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.heading}
                </div>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1 text-dark-primary">
                Description
              </Label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                className={`w-full p-2 bg-gray-800/50 border rounded-md text-dark-primary ${
                  touched.description && errors.description
                    ? "border-red-500"
                    : "border-gray-700/60"
                }`}
                placeholder="Enter description"
              />
              {touched.description && errors.description && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </div>
              )}
              <div className="text-xs text-dark-secondary mt-1">
                {formData.description.length}/500 characters
              </div>
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1 text-dark-primary">
                Button Name
              </Label>
              <Input
                type="text"
                name="buttonName"
                value={formData.buttonName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 bg-gray-800/50 border rounded-md text-dark-primary ${
                  touched.buttonName && errors.buttonName
                    ? "border-red-500"
                    : "border-gray-700/60"
                }`}
                placeholder="Enter button name"
              />
              {touched.buttonName && errors.buttonName && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.buttonName}
                </div>
              )}
            </div>

            <div>
              <Label className="block text-sm font-medium mb-1 text-dark-primary">
                Button Path
              </Label>
              <Input
                type="text"
                name="buttonPath"
                value={formData.buttonPath}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-2 bg-gray-800/50 border rounded-md text-dark-primary ${
                  touched.buttonPath && errors.buttonPath
                    ? "border-red-500"
                    : "border-gray-700/60"
                }`}
                placeholder="Enter button path"
              />
              {touched.buttonPath && errors.buttonPath && (
                <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.buttonPath}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/60">
              <h3 className="font-medium mb-2 text-dark-primary">
                Upload Image
              </h3>
              <p className="text-sm text-dark-secondary mb-4">
                Please upload file in jpeg or png format and make sure the file
                size is under 25 MB.
              </p>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging
                    ? "border-secondary bg-secondary/10"
                    : touched.image && errors.image
                    ? "border-red-500"
                    : "border-gray-700/60"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-10 h-10 text-secondary mb-2" />
                  <p className="mb-2 text-dark-primary">Drop file or browse</p>
                  <p className="text-sm text-dark-secondary mb-4">
                    Format: jpeg, png & Max file size: 25 MB
                  </p>
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    className="px-4 py-1.5 bg-gray-800 text-dark-primary text-sm rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpeg,.jpg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {fileError && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {fileError}
                </div>
              )}

              {touched.image && errors.image && !fileError && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.image}
                </div>
              )}

              {(file || formData.image) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-dark-primary">
                    Selected file: {file ? file.name : formData.image}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={handleCancelUpload}
                      className="flex-1 py-2 border border-gray-700/60 rounded-md text-center text-dark-primary hover:bg-gray-800/50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDoneUpload}
                      className="flex-1 py-2 bg-secondary text-dark-primary rounded-md text-center hover:bg-secondary/80 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            onClick={handleClearForm}
            className="px-6 py-2 border border-gray-700/60 rounded-md text-dark-primary hover:bg-gray-800/50 transition-colors"
            variant="outline"
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-700/60 rounded-md text-dark-primary hover:bg-gray-800/50 transition-colors"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 bg-secondary text-dark-primary rounded-md hover:bg-secondary/80 transition-colors"
          >
            Save
          </Button>
        </div>
      </div>
    );
  };

  // Render the slider table
  const renderSliderTable = () => {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-dark-primary">
          On Going Banners:
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800/40 border-b border-gray-700/60">
                <th className="text-left p-3 text-sm font-medium text-dark-secondary">
                  Added Date
                </th>
                <th className="text-left p-3 text-sm font-medium text-dark-secondary">
                  Heading
                </th>
                <th className="text-left p-3 text-sm font-medium text-dark-secondary">
                  Image
                </th>
                <th className="text-left p-3 text-sm font-medium text-dark-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((slider) => (
                <tr
                  key={slider.id}
                  className="border-b border-gray-700/40 hover:bg-gray-800/20"
                >
                  <td className="p-3 text-sm text-dark-primary">
                    {slider.addedDate}
                  </td>
                  <td className="p-3 text-sm text-dark-primary">
                    {slider.heading}
                  </td>
                  <td className="p-3 text-sm text-dark-secondary">
                    {slider.image}
                  </td>
                  <td className="p-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(slider)}
                        className="p-1 text-admin-info hover:text-admin-info/80 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(slider.id)}
                        className="p-1 text-red-500 hover:text-red-500/80 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-dark-primary flex items-center gap-3">
        <IconWrapper>
          <Activity className="w-6 h-6 text-secondary" />
        </IconWrapper>
        Slider Management
      </h2>

      <Card className="bg-card rounded-xl shadow-lg border border-gray-700/60 transition-all duration-300 ease-in-out overflow-hidden relative bg-noise">
        <CardHeader className="p-6 border-b border-gray-700/60">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-dark-primary">
              {isFormOpen ? "Edit Slider" : "Manage Sliders"}
            </h1>
            {!isFormOpen && (
              <Button
                onClick={handleAddNew}
                className="px-4 py-2 bg-secondary text-dark-primary rounded-md hover:bg-secondary/80 transition-colors"
              >
                Add New Slider
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isFormOpen ? renderSliderForm() : renderSliderTable()}
        </CardContent>
      </Card>
    </div>
  );
}
