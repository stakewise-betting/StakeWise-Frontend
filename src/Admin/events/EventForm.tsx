// components/admin/events/EventForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "../shared/ImageUploader";
import { PlusCircle, XCircle, Info, FileText } from "lucide-react"; // Added FileText
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

interface EventFormProps {
  contract: any;
  web3: any;
  onEventCreated: () => void;
  onClose: () => void;
}

const eventCategories = ["Sport", "Politic", "Entertainment", "Other"];

// --- (ThemedLabel, inputBaseClasses, form logic: handleInputChange, createEvent, etc. remain the same as previous version) ---
const ThemedLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}> = ({ htmlFor, children, required }) => (
  <Label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-dark-secondary mb-1.5"
  >
    {children}
    {required && <span className="ml-1 text-admin-danger">*</span>}
  </Label>
);

const inputBaseClasses = `
    block w-full bg-primary border border-gray-600/70 text-dark-primary
    placeholder:text-dark-secondary/60 rounded-md shadow-sm
    focus:ring-2 focus:ring-offset-0 focus:ring-secondary/50 focus:border-secondary/70
    text-sm
`;

// --- Form Component ---
export const EventForm: React.FC<EventFormProps> = ({
  contract,
  web3,
  onEventCreated,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    notificationMessage: "",
    notificationImageURL: "",
    rules: "",
  });
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedNotificationImageUrl, setUploadedNotificationImageUrl] =
    useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- (Input handlers, add/remove options, clearForm, createEvent logic remains the same) ---
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
      notificationImageURL: "",
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
      alert("Web3 provider or contract not available.");
      setIsSubmitting(false);
      return;
    }
    const { name, rules, description, notificationMessage, category } =
      formData;
    const imageURL = uploadedImageUrl;
    const notificationImageURL = uploadedNotificationImageUrl;
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
        "Please fill all fields, upload images, and provide >= 2 non-empty options."
      );
      setIsSubmitting(false);
      return;
    }
    const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);
    const nowTimestamp = Math.floor(Date.now() / 1000);
    if (startTimestamp >= endTimestamp) {
      alert("End time must be after start.");
      setIsSubmitting(false);
      return;
    }
    if (endTimestamp <= nowTimestamp) {
      alert("End time must be future.");
      setIsSubmitting(false);
      return;
    }
    try {
      const nextEventIdBigInt = await contract.methods.nextEventId().call();
      const eventIdForNewEvent = Number(nextEventIdBigInt);
      await contract.methods
        .createEvent(
          eventIdForNewEvent,
          name,
          description,
          imageURL,
          options.map((opt) => opt.trim()),
          startTimestamp,
          endTimestamp,
          rules,
          notificationImageURL,
          notificationMessage,
          category
        )
        .send({ from: accounts[0] });
      alert("Event created on blockchain!");
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const eventDataForMongoDB = {
          eventId: eventIdForNewEvent,
          name,
          description,
          category,
          rules,
          imageURL,
          options: options.map((opt) => opt.trim()),
          startTime: startTimestamp,
          endTime: endTimestamp,
          notificationMessage,
          notificationImageURL,
          isCompleted: false,
          winningOption: null,
          listedBy: "Admin",
          volume: 0,
        };
        await axios.post(`${backendUrl}/api/events`, eventDataForMongoDB);
        clearForm();
        onEventCreated();
        onClose();
      } catch (mongoDbError) {
        console.error("Error saving to backend:", mongoDbError);
        alert("Blockchain OK, DB save failed.");
        onEventCreated();
        onClose();
      }
    } catch (err: any) {
      console.error("Error creating event:", err);
      alert(`Error: ${err.message || "Unknown"}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  // --- End unchanged logic ---

  return (
    // Main container with background, padding, rounding, and scrollbar styling
    <div
      className="bg-card text-dark-primary rounded-lg shadow-xl max-h-[90vh] flex flex-col
                   overflow-hidden" // Use overflow-hidden here
    >
      {/* --- Integrated Header --- */}
      <div className="p-6 border-b border-gray-700/60">
        <h3 className="text-xl font-semibold text-dark-primary flex items-center gap-2 mb-1.5">
          <FileText className="w-5 h-5 text-secondary" />
          Create New Betting Event
        </h3>
        <p className="text-sm text-dark-secondary">
          Fill in the details below to create a new event. Fields marked with{" "}
          <span className="text-admin-danger">*</span> are required.
        </p>
      </div>

      {/* --- Form Content Area (Scrollable) --- */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createEvent();
        }}
        // Padding for form content, make it scrollable, apply scrollbar styles
        className="flex-grow p-6 space-y-6 overflow-y-auto
                     scrollbar-thin scrollbar-thumb-secondary/60 scrollbar-track-primary/50
                     hover:scrollbar-thumb-secondary/80" // Make thumb darker on hover
      >
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          {/* Left Column: Details */}
          <div className="md:col-span-2 space-y-5">
            {/* Event Name */}
            <div>
              <ThemedLabel htmlFor="name" required>
                Event Name
              </ThemedLabel>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., F1 2024 Drivers Champion"
                required
                className={inputBaseClasses}
              />
            </div>

            {/* Category */}
            <div>
              <ThemedLabel htmlFor="category" required>
                Category
              </ThemedLabel>
              <Select
                name="category"
                value={formData.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger
                  className={clsx(inputBaseClasses, "text-left justify-start")}
                >
                  <SelectValue
                    placeholder="Select event category"
                    className="text-dark-primary placeholder:text-dark-secondary/60"
                  />
                </SelectTrigger>
                <SelectContent className="bg-card border border-gray-600/70 text-dark-primary">
                  {eventCategories.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="focus:bg-secondary/15 focus:text-secondary hover:bg-secondary/10"
                    >
                      {" "}
                      {cat}{" "}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <ThemedLabel htmlFor="description" required>
                Event Description
              </ThemedLabel>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a clear description..."
                required
                rows={4}
                className={inputBaseClasses}
              />
            </div>

            {/* Options */}
            <div>
              <ThemedLabel htmlFor="options" required>
                Options (Betting Choices)
              </ThemedLabel>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                      required
                      className={clsx(inputBaseClasses, "flex-grow")}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-admin-danger hover:text-admin-danger/80 hover:bg-admin-danger/10 p-1 rounded-full flex-shrink-0"
                        onClick={() => removeOption(index)}
                        aria-label="Remove Option"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="mt-3 border-secondary/60 text-secondary hover:bg-secondary/10 hover:text-secondary"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add Option
              </Button>
            </div>

            {/* Rules */}
            <div>
              <ThemedLabel htmlFor="rules" required>
                Event Rules
              </ThemedLabel>
              <Textarea
                id="rules"
                name="rules"
                value={formData.rules}
                onChange={handleInputChange}
                placeholder="Specify conditions, settlement..."
                required
                rows={3}
                className={inputBaseClasses}
              />
            </div>

            {/* Start/End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <ThemedLabel htmlFor="startTime" required>
                  Start Time
                </ThemedLabel>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className={inputBaseClasses}
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div>
                <ThemedLabel htmlFor="endTime" required>
                  End Time
                </ThemedLabel>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className={inputBaseClasses}
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>

            {/* Notification Message */}
            <div>
              <ThemedLabel htmlFor="notificationMessage" required>
                Notification Message
              </ThemedLabel>
              <Textarea
                id="notificationMessage"
                name="notificationMessage"
                value={formData.notificationMessage}
                onChange={handleInputChange}
                placeholder="Concise message for notifications..."
                required
                rows={2}
                className={inputBaseClasses}
              />
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="md:col-span-1 space-y-6 md:pt-1">
            <div className="bg-primary p-4 rounded-lg border border-gray-700/60">
              <ImageUploader
                label="Event Image"
                onImageUploaded={setUploadedImageUrl}
                previewUrl={uploadedImageUrl}
                idSuffix="Event"
              />
            </div>
            <div className="bg-primary p-4 rounded-lg border border-gray-700/60">
              <ImageUploader
                label="Notification Image"
                onImageUploaded={setUploadedNotificationImageUrl}
                previewUrl={uploadedNotificationImageUrl}
                idSuffix="Notification"
              />
            </div>
          </div>
        </div>

        {/* Form Actions are now outside the scrollable area, but inside the main container */}
      </form>

      {/* --- Form Actions (Sticky Footer) --- */}
      <div className="p-4 border-t border-gray-700/60 bg-card flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="border-gray-600 text-dark-secondary hover:bg-gray-700/50 hover:text-dark-primary hover:border-gray-500"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={clearForm}
          disabled={isSubmitting}
          className="text-dark-secondary hover:bg-gray-700/50 hover:text-dark-primary"
        >
          Clear Form
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          // Attach the submit action to the form attribute
          form="event-main-form" // Add an ID to the <form> tag
          className={clsx(
            "bg-secondary text-white hover:bg-orange-600 focus-visible:ring-secondary/50",
            isSubmitting && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </div>
      {/* Add form ID here */}
      <form
        id="event-main-form"
        onSubmit={(e) => {
          e.preventDefault();
          createEvent();
        }}
      ></form>
    </div> // End Main Container
  );
};
