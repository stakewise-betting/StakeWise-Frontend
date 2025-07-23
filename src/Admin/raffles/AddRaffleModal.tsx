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
import { Loader2 } from "lucide-react";

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
  contract,
  web3,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [notificationImage, setNotificationImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [notificationImagePreview, setNotificationImagePreview] = useState<string | null>(null);
  
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
  
  const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'notification') => {
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
        if (type === 'main') {
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
      const startTimestamp = Math.floor(new Date(formData.startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(formData.endTime).getTime() / 1000);
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
      if (isNaN(parseFloat(formData.ticketPrice)) || parseFloat(formData.ticketPrice) <= 0) {
        toast.error("Ticket price must be a positive number");
        setIsSubmitting(false);
        return;
      }
      
      if (isNaN(parseFloat(formData.prizeAmount)) || parseFloat(formData.prizeAmount) <= 0) {
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
      formDataToSend.append("notificationMessage", formData.notificationMessage || "");
      
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
      toast.error(error.response?.data?.message || error.message || "Failed to create raffle");
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
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="bg-[#333447] border-gray-700/60 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Raffle Draw</DialogTitle>
          <DialogDescription>
            Create a new raffle draw event for users to participate in.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">Name</label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Summer Crypto Giveaway"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-card border border-gray-600/70 text-white"
                  required
                />
                <p className="text-sm text-gray-400">A catchy name for your raffle draw</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a detailed description of the raffle..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full min-h-[120px] px-3 py-2 rounded-md bg-card border border-gray-700 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  required
                />
                <p className="text-sm text-gray-400">Describe the raffle and its prize in detail</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-medium">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md bg-card border border-gray-700 text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="General">General</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Technology">Technology</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Travel">Travel</option>
                </select>
                <p className="text-sm text-gray-400">Categorize your raffle for better discoverability</p>
              </div>

              {/* Main Image Upload */}
              <div className="space-y-2">
                <label htmlFor="image" className="block text-sm font-medium">Raffle Image</label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'main')}
                  className="bg-card border-gray-700"
                />
                <p className="text-sm text-gray-400">Upload an image to represent the raffle (max 5MB)</p>
                
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Preview:</p>
                    <div className="w-full h-32 rounded-md overflow-hidden bg-card border border-gray-700">
                      <img
                        src={imagePreview}
                        alt="Raffle Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Start Time */}
              <div className="space-y-2">
                <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="bg-card border-gray-700"
                  min={formatDateForInput(new Date())}
                  required
                />
                <p className="text-sm text-gray-400">When the raffle will start accepting entries</p>
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="bg-card border-gray-700"
                  min={formatDateForInput(new Date())}
                  required
                />
                <p className="text-sm text-gray-400">When the raffle will stop accepting entries and select a winner</p>
              </div>

              {/* Ticket Price */}
              <div className="space-y-2">
                <label htmlFor="ticketPrice" className="block text-sm font-medium">Ticket Price (ETH)</label>
                <Input
                  id="ticketPrice"
                  name="ticketPrice"
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder="0.01"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  className="bg-card border-gray-700"
                  required
                />
                <p className="text-sm text-gray-400">Cost per ticket in ETH</p>
              </div>

              {/* Prize Amount */}
              <div className="space-y-2">
                <label htmlFor="prizeAmount" className="block text-sm font-medium">Prize Amount (ETH)</label>
                <Input
                  id="prizeAmount"
                  name="prizeAmount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.5"
                  value={formData.prizeAmount}
                  onChange={handleInputChange}
                  className="bg-card border-gray-700"
                  required
                />
                <p className="text-sm text-gray-400">Total prize amount in ETH</p>
              </div>

              {/* Notification Message */}
              <div className="space-y-2">
                <label htmlFor="notificationMessage" className="block text-sm font-medium">Notification Message</label>
                <Input
                  id="notificationMessage"
                  name="notificationMessage"
                  placeholder="A new exciting raffle is here!"
                  value={formData.notificationMessage}
                  onChange={handleInputChange}
                  className="bg-card border-gray-700"
                />
                <p className="text-sm text-gray-400">Message to display in notifications</p>
              </div>

              {/* Notification Image Upload */}
              <div className="space-y-2">
                <label htmlFor="notificationImage" className="block text-sm font-medium">Notification Image</label>
                <Input
                  id="notificationImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 'notification')}
                  className="bg-card border-gray-700"
                />
                <p className="text-sm text-gray-400">Image to display in notifications (max 5MB)</p>
                
                {notificationImagePreview && (
                  <div className="mt-4">
                    <p className="text-sm mb-2">Preview:</p>
                    <div className="w-full h-24 rounded-md overflow-hidden bg-gray-800 border border-gray-700">
                      <img
                        src={notificationImagePreview}
                        alt="Notification Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="mr-2 border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Raffle...
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