// components/admin/ImageUploader.tsx
import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploaderProps {
  label: string;
  onImageUploaded: (url: string) => void;
  previewUrl?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  onImageUploaded,
  previewUrl,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        alert("Please select an image to upload.");
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "betting_event_images");
      formData.append("cloud_name", "dwlge5zg7");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dwlge5zg7/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const data = await response.json();
        onImageUploaded(data.secure_url);
        alert("Image uploaded successfully!");
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
    <div>
      <Label
        className="text-black"
        htmlFor={`${label.replace(/\s+/g, "")}Upload`}
      >
        {label}
      </Label>
      <Input
        type="file"
        id={`${label.replace(/\s+/g, "")}Upload`}
        accept="image/*"
        onChange={handleImageUpload}
        className="text-black"
        disabled={isLoading}
      />
      {previewUrl && (
        <div>
          <Label className="text-black">{label} Preview</Label>
          <img
            src={previewUrl}
            alt={`${label} Preview`}
            className="mt-2 rounded-md"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
        </div>
      )}
    </div>
  );
};
