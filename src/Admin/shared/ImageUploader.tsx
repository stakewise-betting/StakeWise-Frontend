// components/admin/shared/ImageUploader.tsx
import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  label: string;
  onImageUploaded: (url: string) => void;
  previewUrl?: string;
  idSuffix?: string; // Added for unique IDs if needed multiple times
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  onImageUploaded,
  previewUrl,
  idSuffix = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const uniqueId = `${label.replace(/\s+/g, "")}Upload${idSuffix}`;

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        // Keep the alert or use a more integrated notification system
        // alert("Please select an image to upload.");
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "betting_event_images"); // Ensure this preset exists in your Cloudinary account
      formData.append("cloud_name", "dwlge5zg7"); // Replace with your Cloudinary cloud name if different

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dwlge5zg7/image/upload`, // Replace cloud name here too
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          const message = `An error occurred: ${response.statusText} - ${
            errorData?.error?.message || "Unknown error"
          }`;
          window.alert(message);
          console.error("Cloudinary Error:", errorData);
          setIsLoading(false); // Ensure loading state is reset on error
          return;
        }

        const data = await response.json();
        onImageUploaded(data.secure_url);
        // Consider removing the alert for better UX, maybe show a success toast
        // alert("Image uploaded successfully!");
      } catch (error: any) {
        console.error("Error uploading image to Cloudinary:", error);
        alert(`Error uploading image: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [onImageUploaded]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={uniqueId}>{label}</Label>
      <Input
        type="file"
        id={uniqueId}
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isLoading}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
      />
      {isLoading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
      {previewUrl && !isLoading && (
        <div className="mt-2 p-2 border rounded-md">
          <Label className="text-sm font-medium">{label} Preview</Label>
          <img
            src={previewUrl}
            alt={`${label} Preview`}
            className="mt-2 rounded-md object-contain"
            style={{ maxWidth: "100%", maxHeight: "150px" }} // Adjusted max height
          />
        </div>
      )}
    </div>
  );
};
