//StakeWise-Frontend/src/Admin/raffles/AddRaffleModal.tsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  FileText,
  Tag,
  Calendar,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { raffleService } from "@/services/raffleBlockchainService";
import clsx from "clsx";

interface AddRaffleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRaffleCreated: () => void;
}

// --- Reusable Themed Label (from EventForm.tsx) ---
const ThemedLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
}> = ({ htmlFor, children, required, icon }) => (
  <Label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5"
  >
    {icon && <span className="text-orange-500 flex-shrink-0">{icon}</span>}
    <span>{children}</span>
    {required && <span className="ml-0.5 text-red-500 flex-shrink-0">*</span>}
  </Label>
);

// --- Base Input Styling (from EventForm.tsx) ---
const inputBaseClasses = `
  block w-full bg-[#1c1c27] border border-gray-600/70 text-gray-200
  placeholder:text-gray-500/80 rounded-md shadow-sm
  focus:ring-1 focus:ring-offset-0 focus:ring-orange-600/50 focus:border-orange-600/70
  text-sm px-3 py-2 transition-colors duration-200
`;

// --- Base Section Styling (from EventForm.tsx) ---
const sectionBaseClasses = `
  bg-[#2a2a3a]/40 rounded-lg border border-gray-700/40 p-4 md:p-5
  transition-all duration-300
  hover:border-gray-600/60
`;

const AddRaffleModal: React.FC<AddRaffleModalProps> = ({
  open,
  onOpenChange,
  onRaffleCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    ticketPrice: "0.1",
    prizeAmount: "0.5",
    category: "",
  });

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file.");
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !formData.name || !formData.startTime || !formData.endTime) {
      toast.error("Please fill all required fields and select an image.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload image to Cloudinary via our backend
      toast.info("Uploading raffle image...");
      const imageData = new FormData();
      imageData.append("image", image);

      const uploadResponse = await axios.post(
        `${backendBaseUrl}/api/raffles/upload-image`,
        imageData,
        { withCredentials: true } // Important for auth middleware
      );

      const { imageURL } = uploadResponse.data;
      if (!imageURL) {
        throw new Error("Image URL not returned from server.");
      }
      toast.success("Image uploaded successfully!");

      // Step 2: Create the raffle on the blockchain with the new image URL
      toast.info(
        "Please confirm the transaction in your wallet to create the raffle..."
      );

      const startTimestamp = Math.floor(
        new Date(formData.startTime).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(formData.endTime).getTime() / 1000
      );

      const txHash = await raffleService.createRaffle(
        formData.name,
        imageURL,
        formData.category,
        startTimestamp,
        endTimestamp,
        formData.ticketPrice,
        formData.prizeAmount
      );

      // The backend listener will handle saving to the database automatically.
      toast.success(
        `Raffle is being created on the blockchain! Tx: ${txHash.substring(
          0,
          10
        )}...`
      );

      onRaffleCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      console.error("Error creating raffle:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create raffle. Check console for details.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      startTime: "",
      endTime: "",
      ticketPrice: "0.1",
      prizeAmount: "0.5",
      category: "Crypto",
    });
    setImage(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#181820] border-gray-700/60 text-white max-w-3xl p-0">
        <DialogHeader className="p-4 md:p-5 border-b border-gray-700/60 bg-gradient-to-r from-[#2a2a3a]/30 to-[#2a2a3a]/50">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full flex items-center justify-center bg-orange-600/20">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <DialogTitle className="text-lg md:text-xl font-semibold text-gray-100">
              Create New Raffle
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs md:text-sm text-gray-400 mt-1.5 ml-[calc(1.5rem+0.75rem)]">
            Fill in the details for the new raffle. Fields marked with{" "}
            <span className="text-red-500 font-semibold">*</span> are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {/* Form Content (Scrollable) */}
          <div className="max-h-[70vh] flex-grow p-4 md:p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-600/60 scrollbar-track-primary/50 hover:scrollbar-thumb-orange-600/80">
            {/* Details Section */}
            <section className={sectionBaseClasses}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="md:col-span-2">
                  <ThemedLabel htmlFor="name" required icon={<FileText size={14} />}>
                    Raffle Name
                  </ThemedLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Crypto Jackpot"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputBaseClasses}
                    required
                  />
                </div>
                <div>
                  <ThemedLabel htmlFor="category" required icon={<Tag size={14} />}>
                    Category
                  </ThemedLabel>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g., Crypto"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={inputBaseClasses}
                    required
                  />
                </div>
                <div>
                  <ThemedLabel
                    htmlFor="prizeAmount"
                    required
                    icon={<ShieldCheck size={14} />}
                  >
                    Prize Amount (ETH)
                  </ThemedLabel>
                  <Input
                    id="prizeAmount"
                    name="prizeAmount"
                    type="number"
                    step="any"
                    placeholder="0.5"
                    value={formData.prizeAmount}
                    onChange={handleInputChange}
                    className={inputBaseClasses}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Timing & Pricing Section */}
            <section className={sectionBaseClasses}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <ThemedLabel
                    htmlFor="startTime"
                    required
                    icon={<Calendar size={14} />}
                  >
                    Start Time
                  </ThemedLabel>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={clsx(inputBaseClasses, "dark-datetime")}
                    required
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div>
                  <ThemedLabel
                    htmlFor="endTime"
                    required
                    icon={<Calendar size={14} />}
                  >
                    End Time
                  </ThemedLabel>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={clsx(inputBaseClasses, "dark-datetime")}
                    required
                    style={{ colorScheme: "dark" }}
                  />
                </div>
                <div className="md:col-span-2">
                  <ThemedLabel
                    htmlFor="ticketPrice"
                    required
                    icon={<Tag size={14} />}
                  >
                    Ticket Price (ETH)
                  </ThemedLabel>
                  <Input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="number"
                    step="any"
                    placeholder="0.01"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className={inputBaseClasses}
                    required
                  />
                </div>
              </div>
            </section>

            {/* Image Upload Section */}
            <section className={sectionBaseClasses}>
              <ThemedLabel
                htmlFor="raffle-image"
                required
                icon={<UploadCloud size={14} />}
              >
                Raffle Image
              </ThemedLabel>
              <Input
                id="raffle-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={clsx(
                  inputBaseClasses,
                  "file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-600/20 file:text-orange-400 hover:file:bg-orange-600/30 cursor-pointer"
                )}
                required
              />
              {imagePreview && (
                <div className="mt-4 relative w-full pt-[56.25%]">
                  {" "}
                  {/* 16:9 Aspect Ratio */}
                  <img
                    src={imagePreview}
                    alt="Raffle Preview"
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-md border border-gray-600/70"
                  />
                </div>
              )}
            </section>
          </div>

          {/* Form Actions (Sticky Footer) */}
          <DialogFooter className="p-4 border-t border-gray-700/60 bg-gradient-to-r from-[#2a2a3a]/50 to-[#2a2a3a]/30 flex flex-wrap justify-end items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "bg-orange-600 hover:bg-orange-700 text-white min-w-[150px]",
                "disabled:bg-orange-600/50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </>
              ) : (
                "Create Raffle"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRaffleModal;