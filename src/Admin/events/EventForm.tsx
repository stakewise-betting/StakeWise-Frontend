// components/admin/events/EventForm.tsx
import React, { useState, useEffect } from "react"; // Added useEffect for potential future use
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "../shared/ImageUploader"; // Assuming this component exists and is functional
import {
  PlusCircle,
  XCircle,
  Info,
  FileText,
  Calendar,
  Tag,
  ListFilter,
  Loader2, // Added for loading state
  Trash2, // Added for Clear Form icon
  X, // Added for Cancel icon
} from "lucide-react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx"; // Utility for conditional classes

interface EventFormProps {
  contract: any; // Consider defining a specific Contract type
  web3: any; // Consider defining a specific Web3 type
  onEventCreated: () => void;
  onClose: () => void; // Passed from the parent (modal)
}

const eventCategories = ["Sport", "Politic", "Entertainment", "Other"];

// --- Reusable Themed Label ---
const ThemedLabel: React.FC<{
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string; // Allow passing additional classes
}> = ({ htmlFor, children, required, icon, className = "" }) => (
  <Label
    htmlFor={htmlFor}
    className={clsx(
      "block text-sm font-medium text-dark-secondary mb-1.5 flex items-center gap-1.5",
      className
    )}
  >
    {icon && <span className="text-secondary flex-shrink-0">{icon}</span>}
    <span>{children}</span>
    {required && (
      <span className="ml-0.5 text-admin-danger flex-shrink-0">*</span>
    )}
  </Label>
);

// --- Base Input Styling ---
const inputBaseClasses = `
  block w-full bg-primary/40 border border-gray-600/70 text-dark-primary
  placeholder:text-dark-secondary/60 rounded-md shadow-sm
  focus:ring-1 focus:ring-offset-0 focus:ring-secondary/50 focus:border-secondary/70
  text-sm px-3 py-2 transition-colors duration-200
`;

// --- Base Section Styling ---
const sectionBaseClasses = `
  bg-primary/30 rounded-lg border border-gray-700/40 p-4 md:p-5
  transition-all duration-300
  hover:border-gray-600/60
`;

// --- Card Styling for Image Uploaders ---
const imageCardBaseClasses = `
  bg-card text-dark-primary rounded-lg shadow-md
  border border-gray-700/60
  transition-all duration-300 ease-in-out
  hover:shadow-lg hover:border-secondary/40
  overflow-hidden relative
`;

// --- Icon Wrapper --- (Slightly simplified)
const IconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={clsx(
      "p-1.5 rounded-full flex items-center justify-center flex-shrink-0",
      className
    )}
  >
    {children}
  </div>
);

export const EventForm: React.FC<EventFormProps> = ({
  contract,
  web3,
  onEventCreated,
  onClose, // Receive onClose from parent modal
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    notificationMessage: "",
    rules: "",
  });
  // Separate state for image URLs for clarity with ImageUploader
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedNotificationImageUrl, setUploadedNotificationImageUrl] =
    useState<string>("");
  const [options, setOptions] = useState<string[]>(["", ""]); // Start with two empty options
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // For displaying errors

  // --- Handlers ---
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrorMsg(null); // Clear error on input change
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setErrorMsg(null);
    if (value) {
      // Ensure a value is selected
      setFormData({ ...formData, category: value });
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    setErrorMsg(null);
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleTimeChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string
  ) => {
    setErrorMsg(null);
    setter(value);
  };

  const addOption = () => {
    if (options.length < 10) {
      // Limit number of options if desired
      setOptions([...options, ""]);
    } else {
      setErrorMsg("Maximum number of options reached (10).");
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      setErrorMsg(null); // Clear error if successful
    } else {
      setErrorMsg("An event must have at least two options.");
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
    setUploadedImageUrl(""); // Assuming ImageUploader clears its preview via prop change
    setUploadedNotificationImageUrl("");
    setOptions(["", ""]);
    setStartTime("");
    setEndTime("");
    setIsSubmitting(false);
    setErrorMsg(null);
    // Note: Need to ensure ImageUploader component properly resets its internal state too
    // This might require passing a 'resetKey' prop or having an explicit reset function
  };

  // --- Form Validation ---
  const validateForm = () => {
    const { name, rules, description, notificationMessage, category } =
      formData;

    if (!name.trim()) return "Event Name is required.";
    if (!category) return "Category is required.";
    if (!description.trim()) return "Event Description is required.";
    if (options.length < 2 || options.some((opt) => !opt.trim()))
      return "At least two non-empty Options are required.";
    if (!startTime) return "Start Time is required.";
    if (!endTime) return "End Time is required.";
    if (!rules.trim()) return "Event Rules are required.";
    if (!notificationMessage.trim()) return "Notification Message is required.";
    if (!uploadedImageUrl) return "Main Event Image is required."; // Check state variable
    if (!uploadedNotificationImageUrl) return "Notification Image is required."; // Check state variable

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = Date.now();

    if (isNaN(start) || isNaN(end)) return "Invalid date format provided.";
    if (start >= end) return "End Time must be after Start Time.";
    if (end <= now) return "End Time must be in the future.";

    return null; // No errors
  };

  // --- Event Creation Logic ---
  const createEvent = async () => {
    setErrorMsg(null); // Clear previous errors
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const accounts = await web3?.eth.getAccounts();
      if (!accounts || accounts.length === 0 || !contract) {
        throw new Error("Wallet not connected or contract not loaded.");
      }

      const { name, rules, description, notificationMessage, category } =
        formData;
      const imageURL = uploadedImageUrl; // Use state variable
      const notificationImageURL = uploadedNotificationImageUrl; // Use state variable
      const validOptions = options.map((opt) => opt.trim()).filter(Boolean); // Ensure trimmed and non-empty

      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      // Fetch the next event ID right before creating
      const nextEventIdBigInt = await contract.methods.nextEventId().call();
      const eventIdForNewEvent = Number(nextEventIdBigInt);

      console.log(`Creating event ${eventIdForNewEvent}: ${name}`);

      // Blockchain Transaction
      await contract.methods
        .createEvent(
          eventIdForNewEvent,
          name,
          description,
          imageURL,
          validOptions,
          startTimestamp,
          endTimestamp,
          rules,
          notificationImageURL,
          notificationMessage,
          category
        )
        .send({ from: accounts[0] });

      console.log(`Blockchain event ${eventIdForNewEvent} created.`);

      // Backend Save (MongoDB)
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; // Ensure env var is set
        const eventDataForMongoDB = {
          eventId: eventIdForNewEvent,
          name,
          description,
          category,
          rules,
          imageURL,
          options: validOptions,
          startTime: startTimestamp,
          endTime: endTimestamp,
          notificationMessage,
          notificationImageURL,
          isCompleted: false,
          winningOption: null,
          listedBy: accounts[0], // Use actual creator address
          volume: 0, // Initial volume
          // Add any other fields your backend expects
        };

        await axios.post(`${backendUrl}/api/events`, eventDataForMongoDB);
        console.log(`Event ${eventIdForNewEvent} saved to backend.`);

        alert(
          "Event created successfully on blockchain and saved to database!"
        ); // Or use a toast notification
        clearForm();
        onEventCreated(); // Notify parent list to refresh
        onClose(); // Close the modal
      } catch (mongoDbError: any) {
        console.error("Error saving event to backend:", mongoDbError);
        // Critical decision: Event is on-chain but not in DB.
        // Maybe show a specific error and *don't* close the modal yet?
        // Or provide instructions to manually sync?
        setErrorMsg(
          `Blockchain transaction succeeded, but failed to save event metadata to the database. Please contact support or try saving again later. Error: ${mongoDbError.message}`
        );
        // Don't close automatically on DB error
        onEventCreated(); // Still refresh list, it might appear partially
      }
    } catch (err: any) {
      console.error("Error creating event:", err);
      let friendlyError = "An error occurred during event creation.";
      if (err.message.includes("User denied transaction signature")) {
        friendlyError = "Transaction rejected in wallet.";
      } else if (err.message.includes("insufficient funds")) {
        friendlyError = "Insufficient funds for transaction.";
      }
      // Add more specific error checks if needed
      else {
        friendlyError = `Error: ${err.message.substring(0, 150)}...`;
      }
      setErrorMsg(friendlyError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Removed bg-card, text-dark-primary etc. as modal provides background
    // Removed rounded-xl, shadow-xl as modal provides container styling
    // Removed max-h-[90vh] as modal controls height
    // Kept flex flex-col overflow-hidden
    <div className="flex flex-col overflow-hidden animate-admin-fade-in h-full">
      {/* Header (Kept from original EventForm) */}
      <div className="p-4 md:p-5 border-b border-gray-700/60 bg-gradient-to-r from-primary/30 to-primary/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <IconWrapper className="bg-secondary/20">
            <FileText className="w-5 h-5 text-secondary" />
          </IconWrapper>
          <h3
            id="modal-title"
            className="text-lg md:text-xl font-semibold text-dark-primary"
          >
            Create New Betting Event
          </h3>
        </div>
        <p className="text-xs md:text-sm text-dark-secondary mt-1.5 ml-[calc(1.5rem+0.75rem)]">
          {" "}
          {/* Adjust margin based on icon wrapper size */}
          Fill in the details below. Fields marked with{" "}
          <span className="text-admin-danger font-semibold">*</span> are
          required.
        </p>
      </div>

      {/* Form Content (Scrollable) */}
      {/* Added h-0 to make flex-grow work correctly with overflow */}
      <div className="flex-grow p-4 md:p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/60 scrollbar-track-primary/50 hover:scrollbar-thumb-secondary/80 h-0">
        {/* Display Error Message */}
        {errorMsg && (
          <div className="p-3 mb-4 text-sm text-admin-danger bg-admin-danger/10 border border-admin-danger/30 rounded-md flex items-center gap-2">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-6">
          {/* Left Column: Details (takes 2/3 on large screens) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info Section */}
            <section
              aria-labelledby="basic-info-heading"
              className={`${sectionBaseClasses} space-y-4`}
            >
              <h4
                id="basic-info-heading"
                className="flex items-center gap-2 text-dark-primary font-medium"
              >
                <Info className="w-4 h-4 text-secondary" /> Basic Information
              </h4>
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
                    <SelectValue placeholder="Select event category..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border border-gray-600/70 text-dark-primary">
                    {eventCategories.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="focus:bg-secondary/15 focus:text-secondary hover:bg-secondary/10 cursor-pointer"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                  rows={3}
                  className={inputBaseClasses}
                />
              </div>
            </section>

            {/* Options Section */}
            <section
              aria-labelledby="options-heading"
              className={`${sectionBaseClasses} space-y-4`}
            >
              <h4
                id="options-heading"
                className="flex items-center gap-2 text-dark-primary font-medium"
              >
                <ListFilter className="w-4 h-4 text-secondary" /> Betting
                Options
              </h4>
              <div>
                <ThemedLabel htmlFor="options-0" required>
                  Options (Choices)
                </ThemedLabel>{" "}
                {/* Label points to first option */}
                <div className="space-y-2.5">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 group"
                    >
                      <span className="w-6 h-6 flex items-center justify-center text-dark-secondary text-xs font-mono bg-primary/70 rounded-md border border-gray-600/50 flex-shrink-0">
                        {index + 1}
                      </span>
                      <Input
                        id={`options-${index}`}
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
                        aria-label={`Option ${index + 1}`}
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-admin-danger/70 hover:text-admin-danger hover:bg-admin-danger/10 rounded-full h-7 w-7 flex-shrink-0"
                          onClick={() => removeOption(index)}
                          aria-label={`Remove Option ${index + 1}`}
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
                  className="mt-3 bg-secondary/10 border-secondary/50 text-secondary hover:bg-secondary/20 inline-flex items-center gap-1.5"
                >
                  <PlusCircle className="h-4 w-4" /> Add Option
                </Button>
              </div>
            </section>

            {/* Timing Section */}
            <section
              aria-labelledby="timing-heading"
              className={`${sectionBaseClasses} space-y-4`}
            >
              <h4
                id="timing-heading"
                className="flex items-center gap-2 text-dark-primary font-medium"
              >
                <Calendar className="w-4 h-4 text-secondary" /> Event Timing
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4">
                <div>
                  <ThemedLabel htmlFor="startTime" required>
                    Start Time
                  </ThemedLabel>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) =>
                      handleTimeChange(setStartTime, e.target.value)
                    }
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
                    onChange={(e) =>
                      handleTimeChange(setEndTime, e.target.value)
                    }
                    required
                    className={inputBaseClasses}
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>
            </section>

            {/* Rules & Notifications Section */}
            <section
              aria-labelledby="rules-heading"
              className={`${sectionBaseClasses} space-y-4`}
            >
              <h4
                id="rules-heading"
                className="flex items-center gap-2 text-dark-primary font-medium"
              >
                <Info className="w-4 h-4 text-secondary" /> Rules &
                Notifications
              </h4>
              <div>
                <ThemedLabel htmlFor="rules" required>
                  Event Rules
                </ThemedLabel>
                <Textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleInputChange}
                  placeholder="Specify conditions for settlement, edge cases, etc."
                  required
                  rows={3}
                  className={inputBaseClasses}
                />
              </div>
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
            </section>
          </div>

          {/* Right Column: Images (takes 1/3 on large screens) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Event Image */}
            <section
              aria-labelledby="event-image-heading"
              className={imageCardBaseClasses}
            >
              <h4
                id="event-image-heading"
                className="font-medium text-dark-primary flex items-center gap-2 p-3 border-b border-gray-700/40 bg-gradient-to-b from-primary/40 to-transparent"
              >
                <IconWrapper className="bg-secondary/20 p-1">
                  <FileText className="w-4 h-4 text-secondary" />
                </IconWrapper>
                Event Image <span className="text-admin-danger ml-0.5">*</span>
              </h4>
              <div className="p-4">
                {/* Ensure ImageUploader is responsive */}
                <ImageUploader
                  label="Main display image (required)"
                  onImageUploaded={setUploadedImageUrl}
                  previewUrl={uploadedImageUrl}
                  idSuffix="Event"
                  //required={true}
                />
              </div>
            </section>

            {/* Notification Image */}
            <section
              aria-labelledby="notification-image-heading"
              className={imageCardBaseClasses}
            >
              <h4
                id="notification-image-heading"
                className="font-medium text-dark-primary flex items-center gap-2 p-3 border-b border-gray-700/40 bg-gradient-to-b from-primary/40 to-transparent"
              >
                <IconWrapper className="bg-secondary/20 p-1">
                  <Info className="w-4 h-4 text-secondary" />
                </IconWrapper>
                Notification Image{" "}
                <span className="text-admin-danger ml-0.5">*</span>
              </h4>
              <div className="p-4">
                <ImageUploader
                  label="Image for notifications (required)"
                  onImageUploaded={setUploadedNotificationImageUrl}
                  previewUrl={uploadedNotificationImageUrl}
                  idSuffix="Notification"
                  //required={true}
                />
              </div>
            </section>

            {/* Help Card */}
            <div className="bg-admin-info/10 border border-admin-info/30 rounded-lg p-4 text-sm text-dark-secondary">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-admin-info flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-admin-info mb-1.5">
                    Image Guidelines
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs">
                    <li>Recommended ratio: 16:9</li>
                    <li>Max file size: 2MB</li>
                    <li>Formats: JPG, PNG, WebP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions (Sticky Footer) */}
      {/* Added flex-shrink-0 */}
      <div className="p-4 border-t border-gray-700/60 bg-gradient-to-r from-primary/50 to-primary/30 flex flex-wrap justify-end items-center gap-3 flex-shrink-0">
        <Button
          type="button"
          onClick={onClose} // Use the onClose from props (passed by modal)
          disabled={isSubmitting}
          variant="outline" // Using shadcn variant
          className="border-gray-600 text-dark-secondary hover:bg-gray-700/50 hover:text-dark-primary"
        >
          <X className="h-4 w-4 mr-1.5" />
          Cancel
        </Button>
        <Button
          type="button"
          onClick={clearForm}
          disabled={isSubmitting}
          variant="secondary" // Using shadcn variant (assuming it maps appropriately)
          className="bg-secondary/20 text-secondary hover:bg-secondary/30 border border-secondary/50"
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Clear Form
        </Button>
        <Button
          type="button"
          onClick={createEvent}
          disabled={isSubmitting || !!validateForm()} // Disable if submitting or form invalid
          className={clsx(
            "bg-secondary hover:bg-orange-600 text-white min-w-[140px] flex items-center justify-center",
            "disabled:bg-secondary/50 disabled:cursor-not-allowed disabled:hover:bg-secondary/50" // Explicit disabled styles
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
      </div>
    </div>
  );
};
