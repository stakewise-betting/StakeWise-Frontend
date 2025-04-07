// components/admin/events/EventForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "../shared/ImageUploader"; // Adjusted path
import { PlusCircle, XCircle } from "lucide-react"; // Icons
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Select

interface EventFormProps {
  contract: any;
  web3: any;
  onEventCreated: () => void; // Callback after successful creation AND saving
  onClose: () => void; // Callback to close the modal/form container
}

// Define categories - adjust as needed
const eventCategories = ["Sport", "Politic", "Entertainment", "Other"];

export const EventForm: React.FC<EventFormProps> = ({
  contract,
  web3,
  onEventCreated,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "", // Added category
    notificationMessage: "",
    rules: "",
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedNotificationImageUrl, setUploadedNotificationImageUrl] =
    useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]); // Start with two options
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => setOptions([...options, ""]);
  const removeOption = (index: number) => {
    if (options.length > 2) {
      // Keep at least 2 options
      setOptions(options.filter((_, i) => i !== index));
    } else {
      alert("An event must have at least two options.");
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      notificationMessage: "",
      rules: "",
    });
    setUploadedImageUrl("");
    setUploadedNotificationImageUrl("");
    setOptions(["", ""]);
    setStartTime("");
    setEndTime("");
    setIsSubmitting(false);
  };

  const createEvent = async () => {
    setIsSubmitting(true);
    const accounts = await web3?.eth.getAccounts();
    if (!accounts || !contract) {
      alert(
        "Web3 provider or contract not available. Please connect your wallet."
      );
      setIsSubmitting(false);
      return;
    }

    const { name, rules, description, notificationMessage, category } =
      formData;
    const imageURL = uploadedImageUrl;
    const notificationImageURL = uploadedNotificationImageUrl;

    // Basic Validation
    if (
      !name ||
      !description ||
      !category ||
      !rules ||
      !imageURL ||
      !notificationMessage ||
      !notificationImageURL ||
      options.some((opt) => !opt.trim()) ||
      options.length < 2 ||
      !startTime ||
      !endTime
    ) {
      alert(
        "Please fill in all required fields, upload both images, and ensure at least two non-empty options are provided."
      );
      setIsSubmitting(false);
      return;
    }

    // Time validation
    const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
    const nowTimestamp = Math.floor(Date.now() / 1000);

    if (startTimestamp >= endTimestamp) {
      alert("End time must be after start time.");
      setIsSubmitting(false);
      return;
    }
    if (endTimestamp <= nowTimestamp) {
      alert("End time must be in the future.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Fetch the next event ID *before* sending the transaction
      const nextEventIdBigInt = await contract.methods.nextEventId().call();
      // Convert BigInt to number or string depending on usage. Be mindful of potential precision loss for very large numbers.
      // If your event IDs won't exceed JavaScript's Number.MAX_SAFE_INTEGER, Number() is okay. Otherwise, use string.
      const eventIdForNewEvent = Number(nextEventIdBigInt);

      console.log("Creating event with ID:", eventIdForNewEvent);
      console.log("Params:", {
        eventId: eventIdForNewEvent,
        name,
        description,
        imageURL,
        options,
        startTimestamp,
        endTimestamp,
        rules,
      });

      // Blockchain Transaction
      await contract.methods
        .createEvent(
          eventIdForNewEvent, // Ensure contract expects uint256
          name,
          description,
          imageURL,
          options.map((opt) => opt.trim()), // Send trimmed options
          startTimestamp, // Ensure contract expects uint256
          endTimestamp, // Ensure contract expects uint256
          rules
        )
        .send({ from: accounts[0] });

      alert("Event created on blockchain successfully!");

      // Save to Backend (MongoDB via your API)
      try {
        const eventDataForMongoDB = {
          eventId: eventIdForNewEvent,
          name: name,
          description: description,
          category: category, // Include category
          rules: rules,
          imageURL: imageURL,
          options: options.map((opt) => opt.trim()),
          startTime: startTimestamp,
          endTime: endTimestamp,
          notificationMessage: notificationMessage,
          notificationImageURL: notificationImageURL,
          isCompleted: false, // Mark as not completed initially
          winningOption: null, // No winner yet
          // Add other fields your backend expects, like 'listedBy', 'volume' (initially 0?)
          listedBy: "Admin", // Or fetch connected account?
          volume: 0,
        };
        await axios.post(
          "http://localhost:5000/api/events", // Ensure this matches your backend endpoint
          eventDataForMongoDB
        );
        console.log("Event data saved to backend successfully!");

        // Success: Clear form, notify parent, close modal
        clearForm();
        onEventCreated(); // Trigger refresh in parent
        onClose(); // Close the modal
      } catch (mongoDbError) {
        console.error("Error saving event data to backend:", mongoDbError);
        // Inform user, but the event *is* on the blockchain
        alert(
          "Event created on blockchain, but failed to save details to the database. Please check backend logs."
        );
        // Optionally: trigger refresh anyway, maybe clear form?
        onEventCreated(); // Still refresh list
        onClose(); // Still close modal
      }
    } catch (err: any) {
      console.error("Error creating event:", err);
      alert(
        `Error creating event: ${
          err.message || "An unexpected error occurred."
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Layout inspired by reference image
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createEvent();
      }}
      className="space-y-6 p-1 max-h-[80vh] overflow-y-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <Label htmlFor="name">
              Event Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., F1 2024 Drivers Champion"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              name="category"
              value={formData.category}
              onValueChange={handleCategoryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {eventCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">
              Event Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Detailed description of the event"
              required
            />
          </div>

          <div>
            <Label>
              Options (Betting Choices){" "}
              <span className="text-destructive">*</span>
            </Label>
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                {options.length > 2 && (
                  <Button
                    type="button" // Prevent form submission
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() => removeOption(index)}
                    aria-label="Remove Option"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="mt-1"
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Option
            </Button>
          </div>

          <div>
            <Label htmlFor="rules">
              Event Rules <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleInputChange}
              placeholder="Specific rules for betting and settlement"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">
                Start Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">
                End Time <span className="text-destructive">*</span>
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notificationMessage">
              Notification Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="notificationMessage"
              name="notificationMessage"
              value={formData.notificationMessage}
              onChange={handleInputChange}
              placeholder="Message sent to users when event is created/goes live"
              required
            />
          </div>
        </div>

        {/* Right Column: Images */}
        <div className="space-y-4">
          <ImageUploader
            label="Event Image *"
            onImageUploaded={setUploadedImageUrl}
            previewUrl={uploadedImageUrl}
            idSuffix="Event"
          />
          <ImageUploader
            label="Notification Image *"
            onImageUploaded={setUploadedNotificationImageUrl}
            previewUrl={uploadedNotificationImageUrl}
            idSuffix="Notification"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={clearForm}
          disabled={isSubmitting}
        >
          Clear Form
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </Button>
      </div>
    </form>
  );
};
