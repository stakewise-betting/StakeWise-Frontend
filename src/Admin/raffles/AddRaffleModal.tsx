import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Web3 from "web3";
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
import {
  Loader2,
  Ticket,
  Lightbulb,
  FileText,
  DollarSign,
  Tag,
  Image as ImageIcon,
  Trophy,
  Flag,
  Megaphone,
  Rocket,
  Star,
} from "lucide-react";

interface AddRaffleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRaffleCreated: () => void;
  contract: any;
  web3: Web3;
}

const AddRaffleModal: React.FC<AddRaffleModalProps> = ({
  open,
  onOpenChange,
  onRaffleCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [notificationImage, setNotificationImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notificationImagePreview, setNotificationImagePreview] = useState<
    string | null
  >(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    ticketPrice: "0.01",
    prizeAmount: "0.5",
    category: "General",
    notificationMessage: "",
  });

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image change
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "notification"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        toast.error("File must be an image (JPEG, PNG, or GIF)");
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "main") {
          setImagePreview(reader.result as string);
          setImage(file);
        } else {
          setNotificationImagePreview(reader.result as string);
          setNotificationImage(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Validate form data
      if (!formData.name || formData.name.length < 3) {
        toast.error("Name must be at least 3 characters");
        setIsSubmitting(false);
        return;
      }

      if (!formData.description || formData.description.length < 10) {
        toast.error("Description must be at least 10 characters");
        setIsSubmitting(false);
        return;
      }

      if (!formData.startTime || !formData.endTime) {
        toast.error("Start and end times are required");
        setIsSubmitting(false);
        return;
      }

      // Validate time logic
      const startTimestamp = Math.floor(
        new Date(formData.startTime).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(formData.endTime).getTime() / 1000
      );
      const now = Math.floor(Date.now() / 1000);

      if (startTimestamp < now) {
        toast.error("Start time must be in the future");
        setIsSubmitting(false);
        return;
      }

      if (endTimestamp <= startTimestamp) {
        toast.error("End time must be after start time");
        setIsSubmitting(false);
        return;
      }

      // Validate numeric fields
      if (
        isNaN(parseFloat(formData.ticketPrice)) ||
        parseFloat(formData.ticketPrice) <= 0
      ) {
        toast.error("Ticket price must be a positive number");
        setIsSubmitting(false);
        return;
      }

      if (
        isNaN(parseFloat(formData.prizeAmount)) ||
        parseFloat(formData.prizeAmount) <= 0
      ) {
        toast.error("Prize amount must be a positive number");
        setIsSubmitting(false);
        return;
      }

      // Prepare form data
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("startTime", startTimestamp.toString());
      formDataToSend.append("endTime", endTimestamp.toString());
      formDataToSend.append("ticketPrice", formData.ticketPrice);
      formDataToSend.append("prizeAmount", formData.prizeAmount);
      formDataToSend.append("category", formData.category || "General");
      formDataToSend.append(
        "notificationMessage",
        formData.notificationMessage || ""
      );

      // Add images if selected
      if (image) {
        formDataToSend.append("image", image);
      }

      if (notificationImage) {
        formDataToSend.append("notificationImage", notificationImage);
      }

      // Send to backend
      const response = await axios.post(
        `${backendBaseUrl}/api/raffles`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Raffle created successfully");
        onRaffleCreated();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(response.data.message || "Failed to create raffle");
      }
    } catch (error: any) {
      console.error("Error creating raffle:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create raffle"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startTime: "",
      endTime: "",
      ticketPrice: "0.01",
      prizeAmount: "0.5",
      category: "General",
      notificationMessage: "",
    });
    setImage(null);
    setNotificationImage(null);
    setImagePreview(null);
    setNotificationImagePreview(null);
  };

  // Format date string for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="bg-gradient-to-br from-[#252538] to-[#2A2A3E] border-[#404153] text-white max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <DialogHeader className="pb-6 border-b border-[#404153]">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E27625] to-[#F59E0B] bg-clip-text text-transparent flex items-center gap-3">
            <Ticket className="h-6 w-6 text-[#E27625]" />
            Create New Raffle Draw
          </DialogTitle>
          <DialogDescription className="text-[#A1A1AA] text-lg mt-2">
            Create an exciting raffle draw event for users to participate in and
            win amazing prizes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#E27625] rounded-full"></div>
                  Raffle Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Summer Crypto Giveaway"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white placeholder-[#6B7280] focus:ring-2 focus:ring-[#E27625] focus:border-[#E27625] transition-all duration-300"
                  required
                />
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Create a catchy and memorable name for your raffle
                </p>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a detailed description of the raffle and its amazing prizes..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-[140px] px-4 py-3 rounded-xl bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#525266] text-white placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all duration-300 resize-none"
                  required
                />
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Provide detailed information to attract participants
                </p>
              </div>

              {/* Category */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="category"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-xl bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#525266] text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-300"
                >
                  <option value="General">General</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Technology">Technology</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Travel">Travel</option>
                </select>
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Help users find your raffle easily
                </p>
              </div>

              {/* Main Image Upload */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="image"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                  Raffle Image
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "main")}
                  className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white file:bg-gradient-to-r file:from-[#E27625] file:to-[#F59E0B] file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:font-semibold hover:file:from-[#F59E0B] hover:file:to-[#E27625] transition-all duration-300"
                />
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  Upload an attractive image (max 5MB, JPEG/PNG/GIF)
                </p>

                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm mb-3 text-white font-medium">
                      Preview:
                    </p>
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#525266] shadow-lg group">
                      <img
                        src={imagePreview}
                        alt="Raffle Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Start Time */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="startTime"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full"></div>
                  Start Time
                </label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] transition-all duration-300"
                  min={formatDateForInput(new Date())}
                  required
                />
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <Rocket className="h-3 w-3" />
                  When participants can start entering the raffle
                </p>
              </div>

              {/* End Time */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="endTime"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#EF4444] rounded-full"></div>
                  End Time
                </label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white focus:ring-2 focus:ring-[#EF4444] focus:border-[#EF4444] transition-all duration-300"
                  min={formatDateForInput(new Date())}
                  required
                />
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <Flag className="h-3 w-3" />
                  When the raffle closes and winner selection begins
                </p>
              </div>

              {/* Ticket Price */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="ticketPrice"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#F59E0B] rounded-full"></div>
                  Ticket Price (ETH)
                </label>
                <div className="relative">
                  <Input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="number"
                    step="0.001"
                    min="0.001"
                    placeholder="0.01"
                    value={formData.ticketPrice}
                    onChange={handleInputChange}
                    className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white focus:ring-2 focus:ring-[#F59E0B] focus:border-[#F59E0B] transition-all duration-300 pl-4 pr-12"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B] font-semibold text-sm">
                    ETH
                  </div>
                </div>
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Cost per ticket for participants
                </p>
              </div>

              {/* Prize Amount */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="prizeAmount"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#10B981] rounded-full"></div>
                  Prize Amount (ETH)
                </label>
                <div className="relative">
                  <Input
                    id="prizeAmount"
                    name="prizeAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.5"
                    value={formData.prizeAmount}
                    onChange={handleInputChange}
                    className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all duration-300 pl-4 pr-12"
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#10B981] font-semibold text-sm">
                    ETH
                  </div>
                </div>
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Total prize amount for the winner
                </p>
              </div>

              {/* Notification Message */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="notificationMessage"
                  className="text-sm font-semibold text-white mb-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
                  Notification Message
                </label>
                <Input
                  id="notificationMessage"
                  name="notificationMessage"
                  placeholder="An amazing new raffle is here! Don't miss out!"
                  value={formData.notificationMessage}
                  onChange={handleInputChange}
                  className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white placeholder-[#6B7280] focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] transition-all duration-300"
                />
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <Megaphone className="h-3 w-3" />
                  Optional message to notify users about your raffle
                </p>
              </div>

              {/* Notification Image Upload */}
              <div className="bg-gradient-to-br from-[#333447] to-[#404153] rounded-xl p-6 border border-[#525266] shadow-lg">
                <label
                  htmlFor="notificationImage"
                  className="flex items-center gap-2 text-sm font-semibold text-white mb-3"
                >
                  <div className="w-2 h-2 bg-[#EC4899] rounded-full"></div>
                  Notification Image
                </label>
                <Input
                  id="notificationImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "notification")}
                  className="bg-gradient-to-br from-[#1C1C27] to-[#252538] border-[#525266] text-white file:bg-gradient-to-r file:from-[#EC4899] file:to-[#8B5CF6] file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:mr-4 file:font-semibold hover:file:from-[#8B5CF6] hover:file:to-[#EC4899] transition-all duration-300"
                />
                <p className="text-xs text-[#A1A1AA] mt-2 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Optional image for push notifications
                </p>

                {notificationImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm mb-3 text-white font-medium">
                      Preview:
                    </p>
                    <div className="relative w-full h-28 rounded-xl overflow-hidden bg-gradient-to-br from-[#1C1C27] to-[#252538] border border-[#525266] shadow-lg group">
                      <img
                        src={notificationImagePreview}
                        alt="Notification Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-8 border-t border-[#404153]">
            <div className="flex gap-4 w-full justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#525266] to-[#6B7280] border-[#525266] text-white hover:from-[#6B7280] hover:to-[#525266] hover:border-[#6B7280] transition-all duration-300 hover:scale-105 px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#E27625] to-[#F59E0B] hover:from-[#F59E0B] hover:to-[#E27625] text-white font-semibold px-8 py-2 transition-all duration-300 hover:scale-105 shadow-lg shadow-[#E27625]/30"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Raffle...
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2 h-4 w-4" />
                    Create Raffle
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRaffleModal;
