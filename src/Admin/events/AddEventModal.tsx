// components/admin/events/AddEventModal.tsx (Alternative Implementation)
import React from "react";
import { EventForm } from "./EventForm";
import { X } from "lucide-react"; // Using lucide-react icon for close button
import { Button } from "@/components/ui/button"; // Keep using shadcn Button if available and working

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any;
  web3: any;
  onEventCreated: () => void;
}
//
export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  contract,
  web3,
  onEventCreated,
}) => {
  // If the modal is not open, render nothing
  if (!isOpen) return null;

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      // This else might not be strictly necessary if cleanup works reliably
      document.body.style.overflow = "unset";
    }
    // Cleanup function to restore scroll when the component unmounts or isOpen changes to false
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]); // Re-run effect if isOpen changes

  return (
    // 1. Overlay div: covers the whole screen, semi-transparent background
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose} // Close the modal if the overlay is clicked
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* 2. Modal Content container: stops click propagation, styled background, rounded corners, shadow */}
      <div
        className="relative bg-background rounded-lg shadow-xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {/* 3. Close Button: positioned absolutely in the top-right corner */}
        <Button // Use shadcn Button if it works, otherwise use a standard button
          variant="ghost" // Use shadcn variants if available
          size="icon" // Use shadcn sizes if available
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground z-10" // Added z-index
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* 4. Modal Header (Manual Implementation) */}
        <div className="p-6 md:p-8 border-b">
          {" "}
          {/* Added padding and border */}
          <h2 id="modal-title" className="text-2xl font-semibold">
            Create New Betting Event
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details below to create a new event on the blockchain
            and save its metadata. Fields marked with{" "}
            <span className="text-destructive">*</span> are required.
          </p>
        </div>

        {/* 5. Modal Body: contains the EventForm */}
        <div className="p-0">
          {" "}
          {/* Removed padding here, EventForm has its own */}
          <EventForm
            contract={contract}
            web3={web3}
            // Ensure onEventCreated handles closing if needed, or rely on EventForm's onClose
            onEventCreated={onEventCreated}
            onClose={onClose} // Pass the onClose handler to the form for its cancel button
          />
        </div>

        {/* Optional Footer - EventForm already has buttons */}
        {/* <div className="p-6 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div> */}
      </div>
    </div>
  );
};
