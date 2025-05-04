// components/admin/events/AddEventModal.tsx
import React from "react";
import { EventForm } from "./EventForm";
import { X } from "lucide-react"; // Using lucide-react icon for close button
import { Button } from "@/components/ui/button"; // Assuming shadcn Button

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any; // Define contract type if possible
  web3: any; // Define Web3 type if possible
  onEventCreated: () => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  contract,
  web3,
  onEventCreated,
}) => {
  if (!isOpen) return null;

  // Effect to handle body scroll lock
  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen]); // Only re-run if isOpen changes

  return (
    // 1. Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-admin-fade-in" // Darker overlay, added padding
      onClick={onClose} // Close on overlay click
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title" // EventForm now provides the element with this ID
    >
      {/* 2. Modal Content container */}
      <div
        className="relative bg-card rounded-xl shadow-2xl w-full max-w-4xl lg:max-w-5xl h-[90vh] flex flex-col overflow-hidden border border-gray-700/60" // Adjusted max-w, h-[90vh], flex col, border
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal content click
      >
        {/* 3. Close Button - Positioned relative to this container */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 text-dark-secondary hover:text-dark-primary hover:bg-primary/50 rounded-full z-20" // Adjusted styling, increased z-index
          onClick={onClose}
          aria-label="Close event creation form"
        >
          <X className="h-5 w-5" />
        </Button>

        {/*
          --- MODAL HEADER REMOVED ---
          The header (title, description) is now part of the EventForm component itself.
        */}

        {/* 5. Modal Body - Contains the EventForm */}
        {/* Removed padding, let EventForm handle its internal layout & scrolling */}
        {/* Added flex-grow and overflow-hidden to ensure EventForm uses available space */}
        <div className="flex-grow overflow-hidden">
          <EventForm
            contract={contract}
            web3={web3}
            onEventCreated={() => {
              onEventCreated(); // Notify list update
              // onClose(); // EventForm now handles closing on success
            }}
            onClose={onClose} // Pass onClose down for the Cancel button in EventForm
          />
        </div>

        {/* Optional Footer REMOVED - EventForm has its own action buttons */}
      </div>
    </div>
  );
};
