// components/admin/events/EventForm.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "../shared/ImageUploader";
import {
  PlusCircle,
  XCircle,
  Info,
  FileText,
  Calendar,
  Tag,
  ListFilter,
} from "lucide-react";
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

// --- Styled Components ---
const ThemedLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
}> = ({ htmlFor, children, required, icon }) => (
  <Label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-dark-secondary mb-1.5 flex items-center gap-1.5"
  >
    {icon && <span className="text-secondary">{icon}</span>}
    {children}
    {required && <span className="ml-1 text-admin-danger">*</span>}
  </Label>
);

// --- Button Styles ---
const baseButtonClasses = `
  inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
  text-sm font-semibold
  transition-all duration-300 ease-in-out relative overflow-hidden
  border
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-secondary/80
`;

const primaryButtonClasses = `
  ${baseButtonClasses}
  bg-secondary text-white
  border-secondary/80
  hover:bg-orange-600 hover:border-orange-700
  hover:-translate-y-0.5
  shadow-sm hover:shadow-md hover:shadow-secondary/30
`;

const secondaryButtonClasses = `
  ${baseButtonClasses}
  bg-secondary/20
  border-secondary/60
  text-secondary
  hover:bg-secondary/30
  hover:-translate-y-0.5
`;

const outlineButtonClasses = `
  ${baseButtonClasses}
  bg-transparent
  border-gray-600
  text-dark-secondary
  hover:bg-gray-700/50 hover:text-dark-primary hover:border-gray-500
`;

const dangerButtonClasses = `
  ${baseButtonClasses}
  bg-admin-danger/10
  border-admin-danger/50
  text-admin-danger
  hover:bg-admin-danger/20
`;

const iconButtonClasses = `
  inline-flex items-center justify-center
  p-1 rounded-full
  transition-all duration-300 ease-in-out
  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-secondary/80
`;

// --- Input Styles ---
const inputBaseClasses = `
  block w-full bg-primary border border-gray-600/70 text-dark-primary
  placeholder:text-dark-secondary/60 rounded-md shadow-sm
  focus:ring-2 focus:ring-offset-0 focus:ring-secondary/50 focus:border-secondary/70
  text-sm
`;

// --- Card Styles ---
const cardBaseClasses = `
  bg-card text-dark-primary rounded-xl shadow-lg
  border border-gray-700/60
  transition-all duration-300 ease-in-out
  hover:shadow-xl hover:border-secondary/50
  overflow-hidden relative
  bg-noise
`;

// --- Section Styles ---
const sectionBaseClasses = `
  bg-primary/50 rounded-lg border border-gray-700/40 p-4
  transition-all duration-300
  hover:border-gray-600/60
`;

// --- Icon Wrapper ---
const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`p-1.5 rounded-full flex items-center justify-center ${className}`}
  >
    {children}
  </div>
);

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

  // --- Input handlers ---
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

  return (
    <div className="bg-card text-dark-primary rounded-xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden animate-admin-fade-in">
      {/* Header */}
      <div className="p-5 border-b border-gray-700/60 bg-gradient-to-r from-primary to-card">
        <div className="flex items-center gap-3">
          <IconWrapper className="bg-secondary/20">
            <FileText className="w-5 h-5 text-secondary" />
          </IconWrapper>
          <h3 className="text-xl font-semibold text-dark-primary">
            Create New Betting Event
          </h3>
        </div>
        <p className="text-sm text-dark-secondary mt-1.5 ml-9">
          Fill in the details below to create a new event. Fields marked with{" "}
          <span className="text-admin-danger">*</span> are required.
        </p>
      </div>

      {/* Form Content (Scrollable) */}
      <div className="flex-grow p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/60 scrollbar-track-primary/50 hover:scrollbar-thumb-secondary/80">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info Section */}
            <div className={`${sectionBaseClasses} space-y-4`}>
              <div className="flex items-center gap-2 text-dark-primary mb-2">
                <Info className="w-4 h-4 text-secondary" />
                <h4 className="font-medium">Basic Information</h4>
              </div>

              {/* Event Name */}
              <div>
                <ThemedLabel
                  htmlFor="name"
                  required
                  icon={<FileText size={14} />}
                >
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
                <ThemedLabel
                  htmlFor="category"
                  required
                  icon={<Tag size={14} />}
                >
                  Category
                </ThemedLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  required
                >
                  <SelectTrigger
                    className={clsx(
                      inputBaseClasses,
                      "text-left justify-start"
                    )}
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
                        {cat}
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
                  placeholder="Provide a clear description of the event..."
                  required
                  rows={3}
                  className={inputBaseClasses}
                />
              </div>
            </div>

            {/* Options Section */}
            <div className={`${sectionBaseClasses} space-y-4`}>
              <div className="flex items-center gap-2 text-dark-primary mb-2">
                <ListFilter className="w-4 h-4 text-secondary" />
                <h4 className="font-medium">Betting Options</h4>
              </div>

              <div>
                <ThemedLabel htmlFor="options" required>
                  Options (Betting Choices)
                </ThemedLabel>
                <div className="space-y-2">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 group"
                    >
                      <div className="w-7 h-7 flex items-center justify-center text-dark-secondary text-xs font-medium bg-primary/70 rounded-md border border-gray-600/50">
                        {index + 1}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        required
                        className={clsx(
                          inputBaseClasses,
                          "flex-grow group-hover:border-secondary/50 transition-colors"
                        )}
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={clsx(
                            iconButtonClasses,
                            "text-admin-danger/70 hover:text-admin-danger hover:bg-admin-danger/10"
                          )}
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
                  className={secondaryButtonClasses + " mt-3"}
                >
                  <PlusCircle className="h-4 w-4 mr-1.5" /> Add Option
                </Button>
              </div>
            </div>

            {/* Timing Section */}
            <div className={`${sectionBaseClasses} space-y-4`}>
              <div className="flex items-center gap-2 text-dark-primary mb-2">
                <Calendar className="w-4 h-4 text-secondary" />
                <h4 className="font-medium">Event Timing</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
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
            </div>

            {/* Rules & Notifications */}
            <div className={`${sectionBaseClasses} space-y-4`}>
              <div className="flex items-center gap-2 text-dark-primary mb-2">
                <Info className="w-4 h-4 text-secondary" />
                <h4 className="font-medium">Rules & Notifications</h4>
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
                  placeholder="Specify conditions for settlement, what happens in edge cases, etc."
                  required
                  rows={3}
                  className={inputBaseClasses}
                />
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
                  placeholder="Concise message for user notifications..."
                  required
                  rows={2}
                  className={inputBaseClasses}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Images */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Event Image */}
            <div className={cardBaseClasses}>
              <div className="bg-gradient-to-b from-secondary/20 to-transparent p-3 border-b border-gray-700/40">
                <h4 className="font-medium text-dark-primary flex items-center gap-2">
                  <IconWrapper className="bg-secondary/20 p-1">
                    <FileText className="w-4 h-4 text-secondary" />
                  </IconWrapper>
                  Event Image
                </h4>
              </div>
              <div className="p-4">
                <ImageUploader
                  label="Main event image shown to users"
                  onImageUploaded={setUploadedImageUrl}
                  previewUrl={uploadedImageUrl}
                  idSuffix="Event"
                />
              </div>
            </div>

            {/* Notification Image */}
            <div className={cardBaseClasses}>
              <div className="bg-gradient-to-b from-secondary/20 to-transparent p-3 border-b border-gray-700/40">
                <h4 className="font-medium text-dark-primary flex items-center gap-2">
                  <IconWrapper className="bg-secondary/20 p-1">
                    <Info className="w-4 h-4 text-secondary" />
                  </IconWrapper>
                  Notification Image
                </h4>
              </div>
              <div className="p-4">
                <ImageUploader
                  label="Image used in notifications"
                  onImageUploaded={setUploadedNotificationImageUrl}
                  previewUrl={uploadedNotificationImageUrl}
                  idSuffix="Notification"
                />
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-admin-info/10 border border-admin-info/30 rounded-lg p-4 text-sm text-dark-secondary">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-admin-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-admin-info mb-1">
                    Image Guidelines
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Use high-quality images (recommended 16:9 ratio)</li>
                    <li>Keep file size under 2MB</li>
                    <li>Supported formats: JPG, PNG, WebP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions (Sticky Footer) */}
      <div className="p-4 border-t border-gray-700/60 bg-gradient-to-r from-card to-primary flex justify-end space-x-3">
        <Button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className={outlineButtonClasses}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={clearForm}
          disabled={isSubmitting}
          className={secondaryButtonClasses}
        >
          Clear Form
        </Button>
        <Button
          type="button"
          onClick={createEvent}
          disabled={isSubmitting}
          className={clsx(
            primaryButtonClasses,
            isSubmitting && "opacity-70 cursor-not-allowed"
          )}
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
};
